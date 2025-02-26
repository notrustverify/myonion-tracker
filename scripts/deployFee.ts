import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { Auction, Fee } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(Fee, {
    initialFields: {
        admin: deployer.account.address,
        parentContract: deployer.account.address,
        asset: '',
        fees: 0n,
        hasGas: false
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan