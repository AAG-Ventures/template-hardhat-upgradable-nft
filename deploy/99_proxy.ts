import { deployments } from '../variants/index';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NFTV1 } from '../dist/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // admin deployment info
  const adminDeployment = await hre.deployments.get('NFTAdmin');

  for (const deployment of deployments) {
    const nftDeployment = await hre.deployments.get(deployment.deploymentPrefix + '-NFTV1');
    const nftContract = await hre.ethers.getContractAt('NFTV1', nftDeployment.address) as NFTV1; 

    /**
     * - proxy constructor
     *   - address logic
     *   - address admin
     *   - bytes data = `init(string name, string symbol, string uri, address owner)`
     */
    await deploy(deployment.deploymentPrefix + '-NFTProxy', {
      from: deployer,
      args: [
        nftContract.address,
        adminDeployment.address,
        nftContract.interface.encodeFunctionData('init', [
          deployment.name,
          deployment.symbol,
          deployer,
        ]),
      ],
      log: true,
      skipIfAlreadyDeployed: true,
      contract: 'NFTProxy',
    });
  }
};

export default func;
const variants = deployments.map((deployment) => deployment.deploymentPrefix + '-NFTV1');
func.id = 'Proxy';
func.tags = ['hardhat', 'v1'];
func.dependencies = [...variants];
