import * as dotenv  from 'dotenv';
import { getContracts, txConfig, proxies, implementations } from './utils/setup';
import { ContractTransaction } from 'ethers/lib/ethers';

dotenv.config();

const upgrade = async (proxy: string, implementation: string) => {
  let tx: ContractTransaction;
  const contracts = getContracts();
  tx = await contracts.admin.upgrade(proxy, implementation, txConfig);
  console.log(await tx.wait());
};

const main = async () => {
  console.log('starting');
  await upgrade(proxies.majutaniPassport.address, implementations.majutaniPassport.address);
  console.log(await getContracts().majutaniPassport.owner());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
