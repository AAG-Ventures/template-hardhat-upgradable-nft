import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { nftFixture } from './shared/nftv2';
import variants from '../variants';
import { Wallet } from 'ethers';
import { NFTV2 } from '../dist/types';

const argv = variants.demo;

use(waffle.solidity);

describe('NFTV2', () => {
  let users: Wallet[];

  let owner: Wallet, assignedAdmin: Wallet, user: Wallet;
  let nft: NFTV2;

  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
    owner = users[0];
    assignedAdmin = users[1];
    user = users[2];
  });

  beforeEach('deploy fixture', async () => {
    ({ nft, assignedAdmin } = await loadFixture(nftFixture));
  });

  it('check status', async () => {
    expect(await nft.owner()).eq(owner.address);
    expect(await nft.name()).eq(argv.name);
    expect(await nft.symbol()).eq(argv.symbol);
    expect(await nft.admin()).eq(assignedAdmin.address);
  });

  describe('#init', () => {
    it('should revert', async () => {
      await expect(nft.init(argv.name, argv.symbol, owner.address, assignedAdmin.address))
        .revertedWith('Initializable: contract is already initialized');
    });
  });

  describe('as owner', () => {
    it('check status', async () => {
      expect(await nft.owner()).eq(owner.address);
      expect(await nft.name()).eq(argv.name);
      expect(await nft.symbol()).eq(argv.symbol);
      expect(await nft.admin()).eq(assignedAdmin.address);
    });
    it('can airdrop', async () => {
      await nft.airdrop(user.address, 'ipfs://testnet_hash/');
      expect(await nft.balanceOf(user.address)).eq(1);
    });
    it('can set admin', async () => {
      await nft.setAdmin(user.address);
      expect(await nft.admin()).eq(user.address);
    });
  });

  describe('as admin', () => {
    beforeEach('connect as admin', async () => {
      nft = nft.connect(assignedAdmin);
    });
    it('check status', async () => {
      expect(await nft.owner()).eq(owner.address);
      expect(await nft.name()).eq(argv.name);
      expect(await nft.symbol()).eq(argv.symbol);
      expect(await nft.admin()).eq(assignedAdmin.address);
    });
    it('can airdrop', async () => {
      await nft.connect(assignedAdmin).airdrop(user.address, 'ipfs://testnet_hash/');
      expect(await nft.balanceOf(user.address)).eq(1);
    });
    it('cannot set admin', async () => {
      await expect(nft.setAdmin(user.address))
        .revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('as user', () => {
    beforeEach('connect as user', async () => {
      nft = nft.connect(user);
    });
    it('check status', async () => {
      expect(await nft.owner()).eq(owner.address);
      expect(await nft.name()).eq(argv.name);
      expect(await nft.symbol()).eq(argv.symbol);
      expect(await nft.admin()).eq(assignedAdmin.address);
    });
    it('cannot airdrop', async () => {
      await expect(nft.airdrop(user.address, 'ipfs://testnet_hash/'))
        .revertedWith('NFT: not admin');
    });
    it('cannot set admin', async () => {
      await expect(nft.setAdmin(user.address))
        .revertedWith('Ownable: caller is not the owner');
    });
  });
});
