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
      admin: deployer.account.address,
      loanTemplate: '2e592369cd28f91517375b9cfdb57591b44696158cfe4f1280f69c979dd6d900',
      auctionHouse: 'b88a9891213af953a06c0bdc5f4a03ee25ab4d24a3b911ff59c2320b8a54fd00',
      feeTemplate: '7e407cb9eed93a0ecfd065a29c567c339b916b730c307acb3e1df14d7fa7d500',
      activeLoans: 0n,
      rate: 300n,
      oracle: '285zrkZTPpUCpjKg9E3z238VmpUBQEAbESGsJT6yX7Rod',
      alpaca: '02a2a321f3bbab2ecc834191ad9b3db6eafdbd8d791db7fb77c341aeff0e8a00',
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan Factory: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan