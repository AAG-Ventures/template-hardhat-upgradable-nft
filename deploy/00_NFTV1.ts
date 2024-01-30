import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { deployments } from '../variants/index';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  for (const deployment of deployments) {
    await deploy(deployment.deploymentPrefix + '-NFTV1', {
      from: deployer,
      args: [],
      log: true,
      skipIfAlreadyDeployed: true,
      contract: 'NFTV1',
    });
  }
};

export default func;
func.id = 'NFTV1';
func.tags = ['hardhat', 'v1'];
func.dependencies = [];
