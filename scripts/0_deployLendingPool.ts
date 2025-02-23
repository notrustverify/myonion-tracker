import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { ALPH_TOKEN_ID, DUST_AMOUNT, hexToString, NodeProvider, stringToHex, ZERO_ADDRESS } from '@alephium/web3'
import { Pool } from '../artifacts/ts';
import { getNetwork } from './network';

const nodeProvider = new NodeProvider('https://node.testnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const upgradeNetwork = getNetwork()

  const result = await deployer.deployContract(Pool, {
    initialFields: {
        admin: deployer.account.address,
        debtTemplate: '9b87ad5f7950ed4fc5ab6531c220ca4eb7aed5109a2852d8e1f004f9836e6800',
        poolToken: ALPH_TOKEN_ID,
        poolDecimals: 18n,
        poolPair: hexToString('ALPH/USD'),
        name: hexToString('sALPH-PACA'),
        symbol: hexToString('SALPH'),
        sTokenSupply: 0n,
        exchangeRate: 1_000000_000000_000000n,
        totalPoolAssets: 0n,
        depositedAmount: 0n,
        totalBorrowed: 0n,
        fees: 0n,
        oracle: '216wgM3Xi5uBFYwwiw2T7iZoCy9vozPJ4XjToW74nQjbV'
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