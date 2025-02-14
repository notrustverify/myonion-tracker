import { NetworkId, NodeProvider, ONE_ALPH, addressFromContractId } from "@alephium/web3"
import { LoanInstance } from "../artifacts/ts"

export function getNetwork(): NetworkId {
    const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
    return network
}