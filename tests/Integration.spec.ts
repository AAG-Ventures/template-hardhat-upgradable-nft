import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { integrationFixture } from './shared/integration';
import variants from '../variants';

import { Wallet } from 'ethers';
import { NFTV2, NFTProxy, NFTAdmin } from '../dist/types';

const argv = variants.demo;

use(waffle.solidity);

describe('Integration', () => {
  let users: Wallet[];
  let nft: NFTV2;
  let proxy: NFTProxy;
  let admin: NFTAdmin;
  let instance: NFTV2;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });

  beforeEach('deploy fixture', async () => {
    ({ nft, proxy, admin } = await loadFixture(integrationFixture));
    instance = nft.attach(proxy.address);
  });

  it('check proxy status', async () => {
    /**
     * proxy status
     * - need admin to get the proxy status
     */
    expect(await admin.owner()).eq(users[0].address);
    expect(await admin.getProxyAdmin(proxy.address)).eq(admin.address);
    expect(await admin.getProxyImplementation(proxy.address)).eq(nft.address);

    /**
     * proxy status from nft
     */
    expect(await instance.owner()).eq(users[0].address);
    expect(await instance.name()).eq(argv.name);
    expect(await instance.symbol()).eq(argv.symbol);
  });

  describe('#init', () => {
    it('should revert', async () => {
      await expect(instance.init(
        'Token Name',
        'TN',
        ethers.constants.AddressZero,
        users[1].address,
      )).revertedWith('Initializable: contract is already initialized');
    });
  });

  describe('#upgradeTo', () => {
    /**
     * remain blank due to there's no V2 or other logic
     */
  });
});
