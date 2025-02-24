import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { Settings } from '../alephium.config'
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { ALPH_TOKEN_ID, DUST_AMOUNT, hexToString, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, stringToHex, ZERO_ADDRESS } from '@alephium/web3'
import { CreateStablePool, Deposit, Pool, Withdraw } from '../artifacts/ts';
import { getNetwork } from './network';

const nodeProvider = new NodeProvider('https://node.testnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const upgradeNetwork = getNetwork()
  
  let tx = await CreateStablePool.execute(signer, {
    initialFields: {
      poolCode: Pool.contract.bytecode,
      admin: deployer.account.address,
      debtTemplate: "9b87ad5f7950ed4fc5ab6531c220ca4eb7aed5109a2852d8e1f004f9836e6800",
      poolToken: ALPH_TOKEN_ID,
      poolDecimals: 0n,
      poolPair: stringToHex("ALPH/USD"),
      name: stringToHex("Lalph"),
      symbol: stringToHex("LALPH"),
      sTokenSupply: 0n,
      exchangeRate: 1_000000_000000_000000n,
      totalPoolAssets: 0n,
      depositedAmount: 0n,
      totalBorrowed: 0n,
      fees: 0n,
      oracle: "216wgM3Xi5uBFYwwiw2T7iZoCy9vozPJ4XjToW74nQjbV"
    },
    attoAlphAmount: DUST_AMOUNT + MINIMAL_CONTRACT_DEPOSIT
  })

  /*
  let tx = await Deposit.execute(signer, {
    initialFields: {
      pool: 'bec1d77e73a9c08c64248a58eac5445597588c697bb98edbc2bb4313c021ee00',
      amount: ONE_ALPH * 3n
    },
    attoAlphAmount: (DUST_AMOUNT * 4n) + (ONE_ALPH * 3n)
  })
  */

  /*
  let tx = await Withdraw.execute(signer, {
    initialFields: {
      pool: 'bec1d77e73a9c08c64248a58eac5445597588c697bb98edbc2bb4313c021ee00',
      amount: 1000000000000000000n
    },
    attoAlphAmount: (DUST_AMOUNT * 4n),
    tokens: [{id: "bec1d77e73a9c08c64248a58eac5445597588c697bb98edbc2bb4313c021ee00", amount: 900000000000000000n}]
  })
  */

  console.log("TX ID: " + tx.txId)
}

export default deployScript