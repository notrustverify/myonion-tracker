import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { AlpacaFiOracle } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(AlpacaFiOracle, {
    initialFields: {
        admin: deployer.account.address,
        updateBot: deployer.account.address
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Oracle: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan