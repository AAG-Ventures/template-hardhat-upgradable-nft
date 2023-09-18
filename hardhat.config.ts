import * as path from 'path';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-ganache';
import '@symblox/hardhat-abi-gen';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import 'solidity-coverage';
import 'hardhat-gas-reporter';
import { networks } from './helpers/networks';

dotenv.config();

const config: HardhatUserConfig = {
  // default network
  defaultNetwork: 'hardhat',

  // network config
  networks: {
    ...networks,
  },

  // solidity config
  solidity: {
    compilers: [
      {
        version: '0.8.0',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'berlin',
        },
      },
      {
        version: '0.8.2',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'berlin',
        },
      },
    ],
    overrides: {
      'contracts/upgrade/NFTAdmin.sol': {
        version: '0.8.2',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'berlin',
        },
      },
      'contracts/upgrade/NFTProxy.sol': {
        version: '0.8.2',
        settings: {
          optimizer: { enabled: true, runs: 200 },
          evmVersion: 'berlin',
        },
      },
    },
  },

  // repository config
  paths: {
    sources: path.resolve(__dirname, 'contracts'),
    tests: path.resolve(__dirname, 'tests'),
    cache: path.resolve(__dirname, 'dist/.cache'),
    artifacts: path.resolve(__dirname, 'dist/artifacts'),
    deploy: path.resolve(__dirname, 'deploy'),
    deployments: path.resolve(__dirname, 'deployments'),
  },

  // typechain
  typechain: {
    outDir: 'dist/types',
    target: 'ethers-v5',
  },

  // etherscan
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  // hardhat-deploy
  namedAccounts: {
    deployer: 0,
  },

  // gas reporter
  gasReporter: {
    currency: 'USD',
    gasPrice: 100,
    enabled: (process.env.REPORT_GAS) ? true : false,
  },
};

export default config;
