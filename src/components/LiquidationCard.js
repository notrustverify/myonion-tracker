'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { getAlephiumLoanConfig, getTokensList } from '../lib/configs'
import Timer from './Timer'
import { LiquidateLoanService } from '../services/loan.services'
import { useWallet } from '@alephium/web3-react'

const DEFAULT_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'

const getCollateralRatioColor = (ratio) => {
  const numericRatio = parseInt(ratio)
  if (numericRatio >= 150) return 'text-green-400'
  if (numericRatio >= 120) return 'text-yellow-400'
  if (numericRatio >= 100) return 'text-orange-400'
  return 'text-red-400'
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value)
}

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList()
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const shortenAddress = (address) => {
  if (!address || address === DEFAULT_ADDRESS) return "-"
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
}

const LiquidationCard = ({ 
  value,
  currency = 'ALPH',
  collateralAmount,
  collateralCurrency,
  term,
  interest,
  lender,
  borrower,
  status = 'active',
  liquidation,
  canLiquidate,
  id,
  tokenPrices,
  isPricesLoading,
  ansProfile,
  createdAt
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signer } = useWallet()

  const displayValue = formatNumber(value / Math.pow(10, getTokenInfo(currency).decimals))
  const displayCollateral = formatNumber(collateralAmount / Math.pow(10, getTokenInfo(collateralCurrency).decimals))
  
  const usdValue = !isPricesLoading && tokenPrices && tokenPrices[currency] ? 
    formatNumber((value / Math.pow(10, getTokenInfo(currency).decimals)) * tokenPrices[currency]) : '...'
  const usdCollateral = !isPricesLoading && tokenPrices && tokenPrices[collateralCurrency] ? 
    formatNumber((collateralAmount / Math.pow(10, getTokenInfo(collateralCurrency).decimals)) * tokenPrices[collateralCurrency]) : '...'

  const collateralRatio = !isPricesLoading && tokenPrices && tokenPrices[currency] && tokenPrices[collateralCurrency] ? 
    (((collateralAmount / Math.pow(10, getTokenInfo(collateralCurrency).decimals)) * tokenPrices[collateralCurrency]) / 
    ((value / Math.pow(10, getTokenInfo(currency).decimals)) * tokenPrices[currency]) * 100).toFixed(0) : '...'

    const handleLiquidate = async () => {
        if (!signer) {
          return
        }
    
        setIsLoading(true)
        const tokenInfo = getTokenInfo(currency)
        const collateralInfo = getTokenInfo(collateralCurrency)
        const config = getAlephiumLoanConfig();
        try {
          const result = await LiquidateLoanService(
            signer,
            config.loanFactoryContractId,
            id,
            collateralInfo.isOracle,
            tokenInfo.isOracle
          )
          window.addTransactionToast('Liquidating Loan', result.txId)
          
          onClose()
        } catch (err) {
          console.error("Error liquidating loan:", err)
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-red-900/20 to-gray-900/90 rounded-xl p-5 text-white border border-red-700/50 transition-all hover:shadow-xl hover:shadow-red-900/20 relative"
    >
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Loan amount</span>
            <div className="flex items-center gap-2">
              <img 
                src={getTokenInfo(currency).logoURI}
                alt={getTokenInfo(currency).symbol}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-2xl font-semibold">{displayValue}</span>
              <span className="text-sm text-gray-400">{getTokenInfo(currency).symbol}</span>
              <span className="text-xs text-gray-500">(${usdValue})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Collateral</span>
          <span className={`text-xs font-medium ${getCollateralRatioColor(collateralRatio)}`}>
            {collateralRatio}% Ratio
          </span>
        </div>
        <div className="flex items-center gap-3">
          <img 
            src={getTokenInfo(collateralCurrency).logoURI}
            alt={getTokenInfo(collateralCurrency).symbol}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <span className="font-medium text-lg">{displayCollateral}</span>
            <span className="text-gray-400 ml-2">{getTokenInfo(collateralCurrency).symbol}</span>
            <span className="text-xs text-gray-500 ml-2">(${usdCollateral})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <span className="text-xs text-gray-400 block mb-1">Time Left</span>
          <span className="font-medium">
            <Timer createdAt={createdAt} duration={term} />
          </span>
        </div>
        <div className="p-3 bg-gray-800/50 rounded-lg">
          <span className="text-xs text-gray-400 block mb-1">Interest</span>
          <span className="font-medium text-green-400">{(interest / 100).toFixed(2)}%</span>
        </div>
      </div>

      <div className="border-t border-gray-700/50 pt-4 mb-4">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Lender</span>
            <span className="text-sm font-medium">
              {ansProfile?.lender?.name || shortenAddress(lender)}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs text-gray-400">Borrower</span>
            <span className="text-sm font-medium text-gray-400">
              {ansProfile?.borrower?.name || shortenAddress(borrower)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button
          onClick={handleLiquidate}
          disabled={isLoading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-400/20 
            hover:from-red-500/30 hover:via-red-500/40 hover:to-red-400/30
            border border-red-500/20 hover:border-red-500/30 
            transition-all duration-300 ease-out
            text-red-400 hover:text-red-300 font-medium 
            shadow-lg shadow-red-900/20 hover:shadow-red-900/30
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
          ) : (
            <>
              <span>Liquidate</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default LiquidationCard 