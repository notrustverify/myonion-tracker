import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { TokenMapping, WithdrawLoanFactoryFees } from "../artifacts/ts";
import { AUTOMATIC_FONT_OPTIMIZATION_MANIFEST } from "next/dist/shared/lib/constants";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

// adds oracle support to call pair; example ('ALPH/USD')
const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    await TokenMapping.execute(signer, {
      initialFields: {
        loanFactory: "291ef5ba0bec2d64a0cb8ccf474464b118fc7a1a1186a8e03187cc0a8fd4d400",
        token: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
        add: false,
        pairtoken: stringToHex("ABX/USD"),
        decimals: 9n,
        alephiumOracle: false
      },
      attoAlphAmount: DUST_AMOUNT + MINIMAL_CONTRACT_DEPOSIT
    })

    /*
    await WithdrawLoanFactoryFees.execute(signer, {
      initialFields: {
        loanFactory: "291ef5ba0bec2d64a0cb8ccf474464b118fc7a1a1186a8e03187cc0a8fd4d400",
        token: ALPH_TOKEN_ID,
        who: deployer.account.address,
        amount: 800000_000000_000000n
      },
      attoAlphAmount: DUST_AMOUNT + MINIMAL_CONTRACT_DEPOSIT
    })
    */
  }
  
  export default deployScript