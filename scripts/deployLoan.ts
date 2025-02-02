import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { Loan } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(Loan, {
    initialFields: {
        creator: deployer.account.address,
        loanee: ZERO_ADDRESS,
        tokenRequested: '',
        tokenAmount: 0n,
        collateralToken: '',
        collateralAmount: 0n,
        interest: 0n,
        rate: 0n,
        duration: 0n,
        startTime: 0n,
        active: false,
        parentContract: deployer.account.address,
        canLiquidate: false,
        liquidation: false,
        ratio: 0n,
        highestBidder: ZERO_ADDRESS,
        highestBid: 0n,
        timeToEnd: 0n
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan