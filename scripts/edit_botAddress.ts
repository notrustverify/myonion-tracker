import { getSigner } from "@alephium/web3-test"
import { ALPH_TOKEN_ID, DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT, NodeProvider, SignerProvider, addressVal, binToHex, byteVecVal, encodePrimitiveValues, stringToHex, u256Val } from "@alephium/web3";
import { PrivateKeyWallet } from "@alephium/web3-wallet";
import { DeployFunction, Deployer, Network } from "@alephium/cli";
import { Settings } from "../alephium.config";
import { loadDeployments } from "../artifacts/ts/deployments";
import { getNetwork } from "./network";
import { TokenMapping, UpdateBotAddress } from "../artifacts/ts";

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
    
    await UpdateBotAddress.execute(signer, {
      initialFields: {
          oracle: "79b75a922382f264422a1a4a7a874ee63340ab703612b5ade24b1324176f0b00",
          newBot: "1618v8SuPEQ1jTZnf7ZSaCufBAUZY6rKhXYhQuoHi2AzM"
      },
      attoAlphAmount: DUST_AMOUNT
    })
  }
  
  export default deployScript