import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { addressFromContractId, web3, hexToString, number256ToBigint, prettifyNumber, prettifyNumberConfig } from '@alephium/web3'
import axios from 'axios';

const TOKEN_LIST_URL = 'https://raw.githubusercontent.com/alephium/token-list/master/tokens/mainnet.json';

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

async function fetchTokenList() {
  try {
    const response = await axios.get(TOKEN_LIST_URL);
    return response.data.tokens;
  } catch (error) {
    console.error('Error fetching token list:', error);
    return [];
  }
}

export async function getTokenNameById(tokenId) {
  const tokens = await fetchTokenList();
  const token = tokens.find(t => t.id === tokenId);
  return token ? token.symbol : null;
}

export async function getTokenImageById(tokenId) {
  const tokens = await fetchTokenList();
  const token = tokens.find(t => t.id === tokenId);
  return token ? token.logoURI : null;
}

export function checkHexString(value, expected) {
  const result = hexToString(value);
  if (result !== expected) {
    throw new Error(`Expected ${expected}, but got ${result}`);
  }
}

export const contractAlphBalanceOf = async (contractid) => {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(addressFromContractId(contractid))
  const balance = balances.balance
  return balance === undefined ? 0n : BigInt(balance)
}

export const alphBalanceOf = async (address) => {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  const balance = balances.balance
  return balance === undefined ? 0n : BigInt(balance)
}

export const balanceOf = async (tokenId, address) => {
  const balances = await web3.getCurrentNodeProvider().addresses.getAddressesAddressBalance(address)
  const balance = balances.tokenBalances?.find((t) => t.id === tokenId)
  return balance === undefined ? 0n : BigInt(balance.amount)
}

export const contractBalanceOf = (state, tokenId) => {
  const token = state.asset.tokens?.find((t) => t.id === tokenId)
  return token === undefined ? 0n : number256ToBigint(token.amount)
}

function isConfirmed(txStatus) {
  return txStatus.type === 'Confirmed'
}

export async function waitTxConfirmed(provider, txId) {
  const status = await provider.transactions.getTransactionsStatus({ txId: txId })
  if (isConfirmed(status)) {
    return status
  }
  await new Promise((r) => setTimeout(r, 5000))
  return waitTxConfirmed(provider, txId)
}

const prettifyConfig = {
  ...prettifyNumberConfig['ALPH'],
  maxDecimalPlaces: 2
}

export function formatNFTPrice(price) {
  const priceStr = price.toString()
  if (priceStr.length > 24) {
    return prettifyNumberWithUnit(price, 24, 'M')
  }
  if (priceStr.length > 21) {
    return prettifyNumberWithUnit(price, 21, 'K')
  }
  return prettifyNumberWithUnit(price, 18, '')
}

function prettifyNumberWithUnit(number, decimals, unit) {
  const prettifyAmount = prettifyNumber(number, decimals, prettifyConfig)
  if (prettifyAmount === undefined) return undefined
  return prettifyAmount + unit
}

export async function contractExists(contractId, provider) {
  const address = addressFromContractId(contractId)
  return provider
    .addresses
    .getAddressesAddressGroup(address)
    .then(_ => true)
    .catch((e) => {
      if (e instanceof Error && e.message.indexOf("Group not found") !== -1) {
        return false
      }
      throw e
    })
}