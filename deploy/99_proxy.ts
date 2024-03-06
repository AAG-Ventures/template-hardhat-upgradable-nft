import variants from '../variants/index';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NFTV1 } from '../dist/types';
import config from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // admin deployment info
  const adminDeployment = await hre.deployments.get('NFTAdmin');

  // nft deployment info
  const nftDeployment = await hre.deployments.get(variants[config.VARIANT_TYPE].deploymentPrefix + '-NFTV1');
  const nftContract = await hre.ethers.getContractAt('NFTV1', nftDeployment.address) as NFTV1;

  /**
   * - proxy constructor
   *   - address logic
   *   - address admin
   *   - bytes data = `init(string name, string symbol, string uri, address owner)`
   */
  await deploy(variants[config.VARIANT_TYPE].deploymentPrefix + '-NFTProxy', {
    from: deployer,
    args: [
      nftContract.address,
      adminDeployment.address,
      nftContract.interface.encodeFunctionData('init', [
        variants[config.VARIANT_TYPE].name,
        variants[config.VARIANT_TYPE].symbol,
        deployer,
      ]),
    ],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'NFTProxy',
  });
};

export default func;
func.id = 'Proxy';
func.tags = ['hardhat', 'v1'];
func.dependencies = [variants[config.VARIANT_TYPE].deploymentPrefix + '-NFTV1'];
