import { deploy, Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DUST_AMOUNT, NodeProvider, stringToHex, ZERO_ADDRESS } from '@alephium/web3'
import { Debt } from '../artifacts/ts';
import { getNetwork } from './network';

const nodeProvider = new NodeProvider('https://node.testnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const upgradeNetwork = getNetwork()

  const result = await deployer.deployContract(Debt, {
    initialFields: {
      debtor: deployer.account.address,
      loanAmount: 0n,
      collateralAmount: 0n,
      timeCreated: 0n,
      interestRate: 0n,
      parentContract: deployer.account.address
    }
  })

  const contractId = result.contractInstance.contractId
  const contractAddress = result.contractInstance.address
  console.log(`Test Token: ${contractAddress}, contract id: ${contractId}`)

  /*
  await MintSupply.execute(signer, {
    initialFields: {
      contract: '046d1734f3f1dce9ad233c04a647530c79917c093e90c3e0043a56be2f8aca00',
      amount: 10_000000_000000_000000n // 10
    },
    attoAlphAmount: DUST_AMOUNT
  })
  */
}

export default deployScript