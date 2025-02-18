import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { ZERO_ADDRESS } from '@alephium/web3'
import { AuctionFactory } from '../artifacts/ts';

const deployLoan: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(AuctionFactory, {
    initialFields: {
        admin: deployer.account.address,
        auctionTemplate: 'b09f3c5d7d7c504ae7f1d7e0cd1419dd4d667bd6d1e93e12f81cff9659627100',
        auctionNumber: 0n,
        fee: 300n
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan Factory: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan