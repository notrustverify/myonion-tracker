import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, ONE_ALPH, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { AcceptLoan, Bid, CreateLoan, EditLoanFactory, Redeem } from "../artifacts/ts";

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
    let tx = await AcceptLoan.execute(signer, {
      initialFields: {
          loanFactory: "e8b899d2238e845321762afb6046afe6898fd37cd4140b3176349006850a9800",
          contract: "df3103c32d4e6999975417e316bb95a8820b42c95affd8cbcc0684a9be6fca00"
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: ALPH_TOKEN_ID, amount: ONE_ALPH * 3n}]
    })
    */

    /*
    let tx = await Bid.execute(signer, {
      initialFields: {
        contract: "b88a9891213af953a06c0bdc5f4a03ee25ab4d24a3b911ff59c2320b8a54fd00",
        id: "be68ab6eee43eacb0215e8310feb902db9e2ab4beb0988f5d7d8ecaa014c7100",
        token: ALPH_TOKEN_ID,
        amount: 1_100000000000000000n
      },
      attoAlphAmount: DUST_AMOUNT * 3n,
      tokens: [{id: ALPH_TOKEN_ID, amount: ONE_ALPH * 3n}]
    })
    */

    /*
    let tx = await Redeem.execute(signer, {
      initialFields: {
        contract: "b88a9891213af953a06c0bdc5f4a03ee25ab4d24a3b911ff59c2320b8a54fd00",
        id: "be68ab6eee43eacb0215e8310feb902db9e2ab4beb0988f5d7d8ecaa014c7100"
      },
      attoAlphAmount: DUST_AMOUNT * 3n,
      tokens: [{id: ALPH_TOKEN_ID, amount: ONE_ALPH * 3n}]
    })
    */

    let tx = await EditLoanFactory.execute(signer, {
      initialFields: {
        contract: "9ac2843e6105edc5f48def727149f0da5a20035c3fd0e7e9b2b06d7b4015d200",
        factoryId: "e1cc79ca2a9c3143426ffc3fbab5ac14550cb7c4ef94793598101b31cf831900"
      },
      attoAlphAmount: DUST_AMOUNT,
    })

    // should add this everywhere
    console.log(tx.txId)
  }
  
  export default deployScript