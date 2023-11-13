import * as ethers from 'ethers';
import * as dotenv  from 'dotenv';
import nftAbi from '../../abi/contracts/NFTV1.sol/NFTV1.json';
import { networks } from '../../helpers/networks';
import { NFTAdmin, NFTV1 } from '../../dist/types';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const adminDeployment = require(`../../deployments/${process.env.NETWORK}/NFTAdmin.json`);
const AAGVIPBDeployment = require(`../../deployments/${process.env.NETWORK}/AAGVIPB-NFTProxy.json`);

export const proxies = {
  admin: adminDeployment,
  AAGVIPB: AAGVIPBDeployment,
};

const AAGVIPBImpl = require(`../../deployments/${process.env.NETWORK}/AAGVIPB-NFTV1.json`);
export const implementations = {
  AAGVIPB: AAGVIPBImpl,
};

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

export const wallet = new ethers.Wallet(`0x${process.env.PRIVATE_KEY}`, provider);

export const getContracts = () => {
  return {
    admin: new ethers.Contract(adminDeployment.address, adminDeployment.abi, wallet) as NFTAdmin,
    AAGVIPB: new ethers.Contract(AAGVIPBDeployment.address, nftAbi, wallet) as NFTV1,
  };
};

export const txConfig = {
  gasPrice: networks[process.env.NETWORK || ''].gasPrice !== undefined ? networks[process.env.NETWORK || ''].gasPrice : undefined,
};