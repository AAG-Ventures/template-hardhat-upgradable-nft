import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { NFTProxy, NFTAdmin, NFTV1 } from '../../dist/types';
import variants from "../../variants";

const argv = variants.demo;

interface ContractFixture {
  nft: NFTV1;
  admin: NFTAdmin;
  proxy: NFTProxy;
}

export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();

    // nft
    const nft = await (
      await ethers.getContractFactory('NFTV1')
    ).deploy() as NFTV1;
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
        users[0].address,
      ]),
    ) as NFTProxy;
    
    await proxy.deployed();

    return {
      nft,
      admin,
      proxy,
    };
  };
