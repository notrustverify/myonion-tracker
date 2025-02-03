import { NetworkId, ONE_ALPH } from "@alephium/web3"
import { loadDeployments } from "../../artifacts/ts/deployments"

export function getNetwork() {
  const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'testnet')
  return network
}

export function getDefaultNodeUrl() {
  const network = getNetwork()
  return network === 'devnet' ?
    'http://127.0.0.1:22973' : network === 'testnet' ?
      'https://wallet-v20.testnet.alephium.org' : 'https://wallet-v20.mainnet.alephium.org'
}

export function getDefaultExplorerUrl() {
  const network = getNetwork()
  return network === 'devnet' ?
    'http://localhost:9090' : network === 'testnet' ?
      'https://backend-v113.testnet.alephium.org' : 'https://backend-v113.mainnet.alephium.org'
}

export function getBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:3019'
}

export function getMongoUrl() {
  return process.env.MONGO_URL ?? 'mongodb://localhost:27017'
}

function getPollingInterval() {
  const network = getNetwork()
  return network === 'testnet' ? 1000 : 100000
}

export function loadSettings(network) {
  return {
    commissionRate: 200
  }
}

function getTokenCreateConfig() {
  const network = getNetwork()
  const groupIndex = 0
  const contractAddress = "vgz6gJB8GVmZgokXJzBNagTUuZJyUuNmAtHtKqQJZ8Go"                    // 4/14/24
  const contractId = "1db99e938897977a45a9467b63f3aa83515b28f0a49b2064935729b65a734400"     // 4/14/24
  const pacaId = "b2d71c116408ae47b931482a440f675dc9ea64453db24ee931dacd578cae9002"         // $PACA ID
  return { network, groupIndex, contractAddress, contractId, pacaId}
}

function getTokenTemplateConfig() {
  const network = getNetwork()
  const groupIndex = 0
  const contractAddress = "vXmb4V9aqCeuUTciZjtvtJLGo86LioMeP7LCHjsVTraK"                    // 4/14/24
  const contractId = "1b5d3f0f2c2db3f91cb1d32675854a1add4fa9a4397a252a4a855fb60ada5a00"     // 4/14/24
  return {network, groupIndex, contractAddress, contractId}
}

export const TokenCreate = getTokenCreateConfig()
export const TokenTemplate = getTokenTemplateConfig()