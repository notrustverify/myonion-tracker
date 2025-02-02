import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { LoanFactory } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(LoanFactory, {
    initialFields: {
        admin: '',
        loanTemplate: '',
        marketTemplate: '',
        activeLoans: 0n,
        rate: 0n,
        oracle: ''
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan Factory: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan