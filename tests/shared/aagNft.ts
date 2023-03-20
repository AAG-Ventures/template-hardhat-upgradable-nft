import { ethers } from 'hardhat';
import variants from '../../variants';

import { Fixture } from 'ethereum-waffle';
import { NFTV1 } from '../../dist/types';

interface ContractFixture {
  nft: NFTV1;
}

const argv = variants.demo;

export const nftFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    /**
     * V1
     */
    const nft = (await (
      await ethers.getContractFactory('NFTV1')
    ).deploy()) as NFTV1;
    await nft.deployed();

    // init
    await nft.init(
      argv.name,
      argv.symbol,
      (await ethers.getSigners())[0].address,
    );
    
    return {
      nft,
    };
  };
