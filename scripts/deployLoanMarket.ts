import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { LoanMarket } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(LoanMarket, {
    initialFields: {
        creator: '',
        token: '',
        tokenAmount: 0n,
        minTokenAmount: 0n,
        minInterest: 0n,
        maxTime: 0n,
        liquidation: false,
        collateralRatioRequired: false,
        ratioRequired: 0n,
        parentContract: ''
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan Market: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan