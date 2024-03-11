import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { nftFixture } from './shared/nftv1';
import variants from '../variants';
import { Wallet } from 'ethers';
import { NFTV1 } from '../dist/types';

const argv = variants.demo;

use(waffle.solidity);

describe('NFTV1', () => {
  let users: Wallet[];

  let owner: Wallet, assignedAdmin: Wallet, user: Wallet;
  let nft: NFTV1;

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
    expect(await nft.isAdmin(assignedAdmin.address)).eq(true);
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
      expect(await nft.isAdmin(assignedAdmin.address)).eq(true);
    });
    it('can airdrop', async () => {
      await nft.airdrop(user.address, 'ipfs://testnet_hash/');
      expect(await nft.balanceOf(user.address)).eq(1);
    });
    it('can set admin', async () => {
      await nft.setAdmin(user.address, true);
      expect(await nft.isAdmin(user.address)).eq(true);
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
      expect(await nft.isAdmin(assignedAdmin.address)).eq(true);
    });
    it('can airdrop', async () => {
      await nft.connect(assignedAdmin).airdrop(user.address, 'ipfs://testnet_hash/');
      expect(await nft.balanceOf(user.address)).eq(1);
    });
    it('cannot set admin', async () => {
      await expect(nft.setAdmin(user.address, true))
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
      expect(await nft.isAdmin(assignedAdmin.address)).eq(true);
    });
    it('cannot airdrop', async () => {
      await expect(nft.airdrop(user.address, 'ipfs://testnet_hash/'))
        .revertedWith('NFT: not admin');
    });
    it('cannot set admin', async () => {
      await expect(nft.setAdmin(user.address, true))
        .revertedWith('Ownable: caller is not the owner');
    });
  });
});
