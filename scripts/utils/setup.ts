import * as ethers from 'ethers';
import * as dotenv  from 'dotenv';
import nftAbi from '../../abi/contracts/NFTV1.sol/NFTV1.json';
import { networks } from '../../helpers/networks';
import { NFTAdmin, NFTV1 } from '../../dist/types';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const adminDeployment = require(`../../deployments/${process.env.NETWORK}/NFTAdmin.json`);
const majutaniDeployment = require(`../../deployments/${process.env.NETWORK}/AGRO-MTP-NFTProxy.json`);
const greensDeployment = require(`../../deployments/${process.env.NETWORK}/AGRO-GREENS-NFTProxy.json`);

export const proxies = {
  admin: adminDeployment,
  majutani: majutaniDeployment,
  greens: greensDeployment,
};

const majutaniImpl = require(`../../deployments/${process.env.NETWORK}/AGRO-MTP-NFTV1.json`);
const greensImpl = require(`../../deployments/${process.env.NETWORK}/AGRO-GREENS-NFTV1.json`);

export const implementations = {
  majutani: majutaniImpl,
  greens: greensImpl,
};

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

export const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

export const getContracts = () => {
  return {
    admin: new ethers.Contract(adminDeployment.address, adminDeployment.abi, wallet) as NFTAdmin,
    majutani: new ethers.Contract(majutaniDeployment.address, nftAbi, wallet) as NFTV1,
    greens: new ethers.Contract(greensDeployment.address, nftAbi, wallet) as NFTV1,
  };
};

export const txConfig = {
  gasPrice: networks[process.env.NETWORK || ''].gasPrice !== undefined ? networks[process.env.NETWORK || ''].gasPrice : undefined,
};