import * as dotenv from 'dotenv';

dotenv.config();

export const networks = {
  harmonyTestnet: {
    url: 'https://api.s0.b.hmny.io',
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    live: true,
    saveDeployments: true,
  },
  
  saakuruTestnet:{
    url: 'https://rpc-testnet-vip.saakuru.network/6dG7YMt68oH3xdFqwqg8HMoE0uyAIsZo',
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },

  saakuruMainnet:{
    url: 'https://rpc.saakuru.network',
    accounts: [`0x${process.env.PRIVATE_KEY}`],
    live: true,
    saveDeployments: true,
    gasPrice: 0,
  },
};