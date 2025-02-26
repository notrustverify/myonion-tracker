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
      loanTemplate: 'cc54aa67366da4237c432b6e6546a71a762f0c3ae205fcb1117168494e0fa400',
      auctionHouse: '9ac2843e6105edc5f48def727149f0da5a20035c3fd0e7e9b2b06d7b4015d200',
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