import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('NFTV1', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'NFTV1',
  });
};

export default func;
func.id = '00_NFTV1';
func.tags = ['hardhat', 'demo'];
func.dependencies = [];
