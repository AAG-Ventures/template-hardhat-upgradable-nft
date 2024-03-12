import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { nftFixture } from './shared/nftv1';
import variants from '../variants';
import { Wallet } from 'ethers';
import { NFTV1 } from '../dist/types';

const argv = variants.demo;

use(waffle.solidity);

describe('Admin', () => {
  let users: Wallet[];

  let owner: Wallet, assignedAdmin: Wallet, user: Wallet;
  let nft: NFTV1;

  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });

  beforeEach('deploy fixture', async () => {
    ({ nft, owner, assignedAdmin } = await loadFixture(nftFixture));
    user = users[2];
  });

  it('check status', async () => {
    expect(await nft.owner()).eq(owner.address);
    expect(await nft.name()).eq(argv.name);
    expect(await nft.symbol()).eq(argv.symbol);
    expect(await nft.isAdmin(assignedAdmin.address)).eq(true);
    expect(await nft.isAdmin(user.address)).eq(false);
  });

  describe('changing admin', () => {
    it('should revert', async () => {
      await expect(nft.setAdmin(assignedAdmin.address, false))
        .revertedWith('NFT: last admin');
    });

    it('can set admin', async () => {
      await nft.setAdmin(user.address, true);
      expect(await nft.isAdmin(user.address)).eq(true);
    });

    it('can remove admin', async () => {
      await nft.setAdmin(user.address, true);
      await nft.setAdmin(user.address, false);
      expect(await nft.isAdmin(user.address)).eq(false);
    });

    it('should revert', async () => {
      await nft.setAdmin(user.address, true);
      await nft.setAdmin(user.address, false);
      expect(await nft.isAdmin(user.address)).eq(false);
      await expect(nft.setAdmin(assignedAdmin.address, false))
        .revertedWith('NFT: last admin');
    });
  });
});
