import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { proxyFixture } from './shared/proxy';
import variants from '../variants';

import { Wallet } from 'ethers';
import { NFTV1, NFTProxy, NFTAdmin } from '../dist/types';

const argv = variants.demo;

use(waffle.solidity);

describe('Proxy', () => {
  let users: Wallet[];
  let owner: Wallet, assignedAdmin: Wallet, user: Wallet;

  let nftv1: NFTV1, nftv1Instance: NFTV1;
  let proxy: NFTProxy;
  let admin: NFTAdmin;

  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('init fixture', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });

  beforeEach('deploy fixture', async () => {
    ({ nftv1, proxy, admin, owner, assignedAdmin } = await loadFixture(proxyFixture));
    nftv1Instance = nftv1.attach(proxy.address);
  });

  describe('before upgrade', () => {
    it('check proxy status', async () => {
      /**
       * proxy status
       * - need admin to get the proxy status
       */
      expect(await admin.owner()).eq(owner.address);
      expect(await admin.getProxyAdmin(proxy.address)).eq(admin.address);
      expect(await admin.getProxyImplementation(proxy.address)).eq(nftv1.address);

      /**
       * proxy status from nft
       */
      expect(await nftv1Instance.owner()).eq(users[0].address);
      expect(await nftv1Instance.name()).eq(argv.name);
      expect(await nftv1Instance.symbol()).eq(argv.symbol);
    });

    describe('when reinitialized', () => {
      it('should revert', async () => {
        await expect(nftv1Instance.init(
          'Token Name',
          'TN',
          ethers.constants.AddressZero,
          ethers.constants.AddressZero,
        )).revertedWith('Initializable: contract is already initialized');
      });
    });
  });

  describe('when upgrading', () => {
    let nftNew: NFTV1;

    beforeEach('deploy new logic', async () => {
      nftNew = (await (
        await ethers.getContractFactory('NFTV1')
      ).deploy()) as NFTV1;
      await nftNew.deployed();
    });

    it('should upgrade to new contract', async () => {
      await admin.upgrade(nftv1Instance.address, nftNew.address);
      expect(await admin.getProxyImplementation(nftv1Instance.address)).eq(nftNew.address);
      expect(await nftv1Instance.isAdmin(assignedAdmin.address)).eq(true);
    });
  });
});
