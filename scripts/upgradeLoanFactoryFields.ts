import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { Loan, LoanFactory, LoanFactoryInstance, LoanFactoryTypes, UpdateLoanCode, UpdateLoanFactoryCode, UpdateLoanFactoryFields } from "../artifacts/ts";

const dotenv = require('dotenv');
dotenv.config()

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet
const signer = new PrivateKeyWallet({ privateKey: String(process.env.key), nodeProvider })

const deployScript: DeployFunction<Settings> = async (
    deployer: Deployer,
    network: Network<Settings>
  ): Promise<void> => {
    const upgradeNetwork = getNetwork()

    const contractFields: LoanFactoryTypes.Fields = {
        admin: "",  // non-mut
        loanTemplate: "",   // non-mut
        marketTemplate: "", // non-mut
        activeLoans: 0n,    // mutable
        rate: 0n,   // mutable
        oracle: "", // non-mut
        alpaca: ""  // non-mut
    }
    
      const encodedImmFields = encodePrimitiveValues([
        addressVal(deployer.account.address),
        byteVecVal("38d777236fc0553ea388b43355f01e3ffb8047b2d7c9fe07d9b6fb5aa506be00"),
        byteVecVal("8457244d771cb3097dbf07b141a9eda9863292b4f5954b2ace53eceb9cef7d00"),
        byteVecVal("c70f64b8d77fa03c807c1a6c133878481b640efbd9b36d30412d828f01000f00"), // alephium oracle
        byteVecVal("02a2a321f3bbab2ecc834191ad9b3db6eafdbd8d791db7fb77c341aeff0e8a00")
      ])
    
      const encodedMutFields = encodePrimitiveValues([
        u256Val(8n),
        u256Val(300n)
      ])
    
    await UpdateLoanFactoryFields.execute(signer, {
      initialFields: {
          loanFactory: "e8b899d2238e845321762afb6046afe6898fd37cd4140b3176349006850a9800",
          newCode: LoanFactory.contract.bytecode,
          immFields: binToHex(encodedImmFields),
          mutFields: binToHex(encodedMutFields)
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript