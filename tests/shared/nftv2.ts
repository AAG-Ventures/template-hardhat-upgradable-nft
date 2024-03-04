import { ethers } from 'hardhat';
import variants from '../../variants';

import { Fixture } from 'ethereum-waffle';
import { NFTV2 } from '../../dist/types';
import { Wallet } from 'ethers';

interface ContractFixture {
  nft: NFTV2;
  assignedAdmin: Wallet;
}

const argv = variants.demo;

export const nftFixture: Fixture<ContractFixture> =
  async function (users: Wallet[]): Promise<ContractFixture> {
    /**
     * V1
     */
    const nft = (await (
      await ethers.getContractFactory('NFTV2')
    ).deploy()) as NFTV2;

    await nft.deployed();

    const owner = users[0];
    const assignedAdmin = users[1];

    // init
    await nft.init(
      argv.name,
      argv.symbol,
      owner.address,
      assignedAdmin.address,
    );

    return {
      nft, assignedAdmin,
    };
  };
