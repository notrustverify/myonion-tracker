import { NetworkId } from "@alephium/web3"

export interface Token {
    id: string
    name: string
    symbol: string
    decimals: number
    description: string
    logoURI: string
    nameOnChain?: string
    symbolOnChain?: string
  }

  export interface TokenList {
    networkId: number
    tokens: Token[]
  }

  function getNetwork(): NetworkId {
    const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet') as NetworkId
    return network
  }

export async function getTokenList(): Promise<Token[]> {
    const url = `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${getNetwork()}.json`
  
    const response = await fetch(url)
  
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
  
    const data = await response.json() as TokenList
    return data.tokens
  }
  
  export function findTokenFromId(tokenList: Token[], tokenId: string): Token | undefined {
    return tokenList?.find((token) => token.id === tokenId)
  }