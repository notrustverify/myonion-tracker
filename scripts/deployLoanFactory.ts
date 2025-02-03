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
      loanTemplate: '38d777236fc0553ea388b43355f01e3ffb8047b2d7c9fe07d9b6fb5aa506be00',
      marketTemplate: '8457244d771cb3097dbf07b141a9eda9863292b4f5954b2ace53eceb9cef7d00',
      activeLoans: 0n,
      rate: 300n,
      oracle: '285zrkZTPpUCpjKg9E3z238VmpUBQEAbESGsJT6yX7Rod',
      alpaca: '79b75a922382f264422a1a4a7a874ee63340ab703612b5ade24b1324176f0b00'
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Loan Factory: ${contractAddress}, contract id: ${contractId}`)
}

export default deployLoan