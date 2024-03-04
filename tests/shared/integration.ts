import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { NFTProxy, NFTAdmin, NFTV2 } from '../../dist/types';
import variants from '../../variants';

const argv = variants.demo;

interface ContractFixture {
  nft: NFTV2;
  admin: NFTAdmin;
  proxy: NFTProxy;
}

export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();
    const owner = users[0];
    const assignedAdmin = users[1];

    // nft
    const nft = await (
      await ethers.getContractFactory('NFTV2')
    ).deploy() as NFTV2;
    await nft.deployed();

    // admin
    const admin = await (
      await ethers.getContractFactory('NFTAdmin')
    ).deploy() as NFTAdmin;
    await admin.deployed();

    /**
     * - proxy constructor
     *   - address logic
     *   - address admin
     *   - bytes data = `init(string name, string symbol, string uri, address owner)`
     */
    const proxy = await (await ethers.getContractFactory('NFTProxy')).deploy(
      nft.address,
      admin.address,
      nft.interface.encodeFunctionData('init', [
        argv.name,
        argv.symbol,
        owner.address,
        assignedAdmin.address,
      ]),
    ) as NFTProxy;

    await proxy.deployed();

    return {
      nft,
      admin,
      proxy,
    };
  };
