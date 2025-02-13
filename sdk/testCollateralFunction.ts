import { NodeProvider, addressFromContractId, node, web3 } from "@alephium/web3";
import { LoanInstance } from "../artifacts/ts"

const nodeProvider = new NodeProvider('https://node.mainnet.alephium.org')                  // Mainnet

web3.setCurrentNodeProvider(nodeProvider)
const details = await new LoanInstance("22EBi6TgB3gjUAxaU1tW1T14PBsMQW9xFKrbK6Ph2ijou")
let info = await details.fetchState()
console.log(info.fields.tokenAmount)