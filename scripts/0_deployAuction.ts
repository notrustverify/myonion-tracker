import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { Auction } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(Auction, {
    initialFields: {
        parentContract: deployer.account.address,
        tokenRequested: '',
        tokenAmount: 0n,
        collateralToken: '',
        collateralAmount: 0n,
        fee: 0n,
        loaner: deployer.account.address,
        highestBidder: deployer.account.address,
        timeToEnd: 0n
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan