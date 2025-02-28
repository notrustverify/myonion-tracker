import { NetworkId, NodeProvider, web3, addressFromContractId } from "@alephium/web3"
import { loadDeployments } from "../../artifacts/ts/deployments"
import { LoanInstance } from "../../artifacts/ts"

export interface AlephiumLoanConfig {
  network: NetworkId,
  groupIndex: number,
  loanFactoryContractId: string,
  loanFactoryContractAddress: string,
  auctionFactoryContractId: string,
  auctionFactoryContractAddress: string,
  loanAdminAddress: string,
  pollingInterval: number,
  defaultNodeUrl: string,
  defaultExplorerUrl: string,
  backendUrl: string,
  mongoUrl: string
}

export interface TokenInfo {
  id: string
  name: string
  symbol: string
  decimals: number
  description: string
  logoURI: string
  isOracle: boolean
}

export function getNetwork(): NetworkId {
  const network = 'mainnet' as NetworkId
  return network
}

export function getNodeProvider(): NodeProvider {
  return new NodeProvider(getDefaultNodeUrl())
}

export function getDefaultNodeUrl(): string {
  return 'https://node.alphaga.app'
}


export function getDefaultExplorerUrl(): string {
  return 'https://backend.mainnet.alephium.org'
}

export function getBackendUrl(): string {
  return 'https://backend.alpacafi.app'
}

export function getMongoUrl(): string {
  return process.env.MONGO_URL || 'mongodb://localhost:27017/'
}

function getPollingInterval(): number {
  const network = getNetwork()
  return network === 'devnet' ? 1000 : 100000
}

export function getAlephiumLoanConfig(): AlephiumLoanConfig {
  const network = getNetwork()
  const deployments = loadDeployments(network, "16gAmGuCysLjGxHK8TUENkvhbqvwZRb6BabUbsxLYkSkd")
  const loanFactory = deployments?.contracts?.LoanFactory?.contractInstance
  const auctionFactory = deployments?.contracts?.AuctionFactory?.contractInstance
  const groupIndex = loanFactory?.groupIndex
  return {
    network,
    groupIndex: groupIndex || 0,
    loanAdminAddress: deployments.deployerAddress,
    loanFactoryContractId: loanFactory?.contractId || '',
    loanFactoryContractAddress: loanFactory?.address || '',
    auctionFactoryContractId: auctionFactory?.contractId || '',
    auctionFactoryContractAddress: auctionFactory?.address || '',
    defaultNodeUrl: getDefaultNodeUrl(),
    defaultExplorerUrl: getDefaultExplorerUrl(),
    backendUrl: getBackendUrl(),
    pollingInterval: getPollingInterval(),
    mongoUrl: getMongoUrl()
  }
}

export function calculateLoanRepayment(
  loanAmount: number,
  interestRatePer10k: number,
  acceptedDate: Date
): number {
  if (interestRatePer10k > 0) {
    // Calculate elapsed time
    let elapsedTime = new Date().getTime() - acceptedDate.getTime()

    // Avoid integer truncation: multiply first, then divide
    let gain = (loanAmount * interestRatePer10k * elapsedTime) / (31556926000 * 10000)

    // Calculate 7% flat interest (tokenAmount * 7 / 100)
    let flatInterest = (loanAmount * 7) / 100

    // Return the original amount + accrued interest + flat interest
    return loanAmount + gain + flatInterest
  } else {
    return loanAmount
  }
}

export function getTokensList(): TokenInfo[] {
  return [
    {
      id: "0000000000000000000000000000000000000000000000000000000000000000",
      name: "Alephium",
      symbol: "ALPH",
      decimals: 18,
      description: "Alephium is a scalable, decentralized, and secure blockchain platform that enables the creation of fast and secure applications.",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ALPH.png",
      isOracle: true
    },
    {
      id: "722954d9067c5a5ad532746a024f2a9d7a18ed9b90e27d0a3a504962160b5600",
      name: "USD Coin (Ethereum via AlphBridge)",
      symbol: "USDCeth",
      decimals: 6,
      description: "USDC Bridged to Alephium from Ethereum via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDCeth.png",
      isOracle: true
    },
    {
      id: "7ff5e72636f640eb2c28056df3b6879e4c86933505abebf566518ad396335700",
      name: "Tether USD (BSC via AlphBridge)",
      symbol: "USDTbsc",
      decimals: 18,
      description: "USDT Bridged to Alephium from BSC via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDTbsc.png",
      isOracle: true
    },
    /*
    {
      id: "75e1e9f91468616a371fe416430819bf5386a3e6a258864c574271a404ec8900",
      name: "USD Coin (BSC via AlphBridge)",
      symbol: "USDCbsc",
      decimals: 18,
      description: "USDC Bridged to Alephium from BSC via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDCbsc.png",
    },
    {
      id: "3d0a1895108782acfa875c2829b0bf76cb586d95ffa4ea9855982667cc73b700",
      name: "Dai Stablecoin (AlphBridge)",
      symbol: "DAI",
      decimals: 18,
      description: "DAI Bridged to Alephium from Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/DAI.png"
    },
    {
      id: "556d9582463fe44fbd108aedc9f409f69086dc78d994b88ea6c9e65f8bf98e00",
      name: "Tether USD (Ethereum via AlphBridge)",
      symbol: "USDTeth",
      decimals: 6,
      description: "USDT Bridged to Alephium from Ethereum via Alephium Bridge",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/USDTeth.png",
    },*/
    {
      id: "9b3070a93fd5127d8c39561870432fdbc79f598ca8dbf2a3398fc100dfd45f00",
      name: "AlphBanX",
      symbol: "ABX",
      decimals: 9,
      description: "AlphBanX is a decentralized lending platform that allows you to borrow AlphBanX Dollars using ALPH as collateral. Choose your own interest rate and bet on liquidations - earning yield from borrowing fees and from liquidated loans.",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ABX.png",
      isOracle: false
    },
    {
      id: "1a281053ba8601a658368594da034c2e99a0fb951b86498d05e76aedfe666800",
      name: "AYIN",
      symbol: "AYIN",
      decimals: 18,
      description: "$AYIN is a DEX token, that incentivises users through fees and other mechanisms to participate in trading on Alephium",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/AYIN.png",
      isOracle: true
    },
    {
      id: "cad22f7c98f13fe249c25199c61190a9fb4341f8af9b1c17fcff4cd4b2c3d200",
      name: "Elexium",
      symbol: "EX",
      decimals: 18,
      description: "Elexium: The People’s Choice. The first VE dex on Alephium Blockchain",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/EX.png",
      isOracle: false
    },
    {
      id: "bb440a66dcffdb75862b6ad6df14d659aa6d1ba8490f6282708aa44ebc80a100",
      name: "AlphPad",
      symbol: "APAD",
      decimals: 18,
      description: "AlphPad The Premier Launchpad on Alephium - Elevating Projects to New Heights!",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/APAD.png",
      isOracle: false
    },
    {
      id: "bcb548631e52e79fd617e0e62180d6d79ad259652093590a874acbeb8b65ac00",
      name: "RalphBuilder",
      symbol: "BUILD",
      decimals: 18,
      description: "Fuel of the RalphBuilder ecosystem",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/BUILD.png",
      isOracle: false
    },
    {
      id: "a7af44d2756d69dedf4ea4cf8e6415f1188b80e99f217d0b73e270b9c0408300",
      name: "MyOnion.fun",
      symbol: "ONION",
      decimals: 18,
      description: "My onions - where the only thing getting diced is weak hands.",
      logoURI: "https://raw.githubusercontent.com/alephium/token-list/master/logos/ONION.png",
      isOracle: false
    },
  ]
}