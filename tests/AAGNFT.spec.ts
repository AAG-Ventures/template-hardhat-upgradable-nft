import { expect, use } from 'chai';
import { ethers, waffle } from 'hardhat';
import { nftFixture } from './shared/aagNft';
import variants from '../variants';
import { Wallet } from 'ethers';
import { NFTV1 } from '../dist/types';

const argv = variants.MTPPassport;

use(waffle.solidity);

describe('AAGNFT', () => {
  let users: Wallet[];
  let nft: NFTV1;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;

  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });

  beforeEach('deploy fixture', async () => {
    ({ nft } = await loadFixture(nftFixture));
    // mint 
    await nft.airdrop(users[1].address, 'ipfs://test');
  });

  it('check status', async () => {
    expect(await nft.owner()).eq(users[0].address);
    expect(await nft.name()).eq(argv.name);
    expect(await nft.symbol()).eq(argv.symbol);
  });

  it('Should get correct url', async () => {
    expect(await nft.tokenURI(1)).eq('https://static.aag.ventures/nft/majutani-1.json');
  });

  describe('#init', () => {
    it('should revert', async () => {
      await expect(nft.init(argv.name, argv.symbol, users[0].address))
        .revertedWith('Initializable: contract is already initialized');
    });
  });
});
