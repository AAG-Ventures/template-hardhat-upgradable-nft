// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

import "./interface/INFT.sol";
import "./core/CoreNFT.sol";

contract NFTV1 is INFT, Ownable, CoreNFT, Initializable {
    // solhint-disable-next-line
    constructor() ERC721("", "") {}

    /// @dev MUST call when proxy deployment
    ///  Using `openzeppelin-contracts/contracts/proxy/transparent/TransparentUpgradeableProxy.sol`.
    ///  Therefore doesn't setup `onlyOwner`.
    function init(
        string memory name_,
        string memory symbol_,
        address owner_
    ) external initializer {
        _setName(name_);
        _setSymbol(symbol_);
        _transferOwnership(owner_);
    }

    /** ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
     * Admin Mutable Function
    ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== */
    /// @notice airdrop for use
    function airdrop(
        address account_,
        string memory uri_
    ) external onlyOwner {
       _mint(account_, uri_);
    }

    /// @notice burn token
    function burn(uint256 id_) public onlyExistingNft(id_) onlyOwner {
        _burn(id_);
    }

    /// @notice setup uri
    function setURI(uint256 tokenId_, string memory uri_) external onlyExistingNft(tokenId_) onlyOwner {
        _setURI(tokenId_, uri_);
    }

    /** ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
     * View Functions
    ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== */
    function getOwnedTokens(address address_)
        external
        view
        returns (TokenView[] memory)
    {
        uint256 balance_ = ERC721.balanceOf(address_);
        TokenView[] memory tokens_ = new TokenView[](balance_);
        if (balance_ > 0) {
            for (uint256 i = 0; i < balance_; i++) {
                uint256 id_ = tokenOfOwnerByIndex(address_, i);
                string memory uri_ = tokenURI(id_);
                tokens_[i] = TokenView(id_, uri_);
            }
        }
        return tokens_;
    }

    /** ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
     * Modifiers
    ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== */
    /// @notice check if nft is existed
    modifier onlyExistingNft(uint256 id_) {
        require(_exists(id_), "NFT: nonexistent token");
        _;
    }
    
    /// @dev lock transfer when token is locked
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @notice support interface
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override
        returns (bool)
    {
        return
            interfaceId == type(INFT).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
