import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { NFTProxy, NFTAdmin, NFTV1 } from '../../dist/types';
import variants from '../../variants';
import { Wallet } from 'ethers';

const argv = variants.demo;

interface ContractFixture {
  nftv1: NFTV1;
  admin: NFTAdmin;
  proxy: NFTProxy;
  owner: Wallet,
  assignedAdmin: Wallet,
}

export const proxyFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await (ethers as any).getSigners();
    const owner = users[0];
    const assignedAdmin = users[1];

    // nftv1
    const nftv1 = await (
      await ethers.getContractFactory('NFTV1')
    ).connect(owner).deploy() as NFTV1;
    await nftv1.deployed();

    // admin
    const admin = await (
      await ethers.getContractFactory('NFTAdmin')
    ).connect(owner).deploy() as NFTAdmin;
    await admin.deployed();

    /**
     * - proxy constructor
     *   - address logic
     *   - address admin
     *   - bytes data = `init(string name, string symbol, string uri, address owner)`
     */
    const proxy = await (await ethers.getContractFactory('NFTProxy')).connect(owner).deploy(
      nftv1.address,
      admin.address,
      nftv1.interface.encodeFunctionData('init', [
        argv.name,
        argv.symbol,
        owner.address,
        assignedAdmin.address,
      ]),
    ) as NFTProxy;

    await proxy.deployed();

    return {
      nftv1,
      admin,
      proxy,
      owner,
      assignedAdmin,
    };
  };
