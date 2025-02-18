import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { CreateLoan, ForceCancelMarket, Loan, LoanMarket, TokenMapping, UpdateLoanCode, UpdateMarketCode } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()
    
    /*
    await UpdateMarketCode.execute(signer, {
      initialFields: {
          market: "8457244d771cb3097dbf07b141a9eda9863292b4f5954b2ace53eceb9cef7d00",
          newCode: LoanMarket.contract.bytecode
      },
      attoAlphAmount: DUST_AMOUNT
    })
    */

    await ForceCancelMarket.execute(signer, {
      initialFields: {
          loan: "8457244d771cb3097dbf07b141a9eda9863292b4f5954b2ace53eceb9cef7d00"
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript