import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { AcceptLoan, CreateLoan } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.twokey), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    let tx = await AcceptLoan.execute(signer, {
      initialFields: {
          loanFactory: "e8b899d2238e845321762afb6046afe6898fd37cd4140b3176349006850a9800",
          contract: "df3103c32d4e6999975417e316bb95a8820b42c95affd8cbcc0684a9be6fca00",
          tokenOracle: true,
          collateralOracle: true
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: ALPH_TOKEN_ID, amount: ONE_ALPH * 3n}]
    })

    // should add this everywhere
    console.log(tx.txId)
  }
  
  export default deployScript