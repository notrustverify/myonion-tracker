'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAlephiumLoanConfig, getTokensList } from '../lib/configs'
import { useWallet } from '@alephium/web3-react'
import { alphBalanceOf, balanceOf } from '../lib/utils'
import AuctionTimer from './AuctionTimer'
import { BidAuctionService, RedeemAuctionService } from '../services/loan.services'

const DEFAULT_ADDRESS = "tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq"

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

const AuctionCard = ({ 
  id,
  bidAmount,
  bidToken,
  collateralAmount,
  collateralToken,
  timeToEnd,
  endDate,
  loaner,
  highestBidder,
  tokenPrices,
  isPricesLoading,
  ansProfile
}) => {
  const [bidsAmount, setBidsAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tokenBalance, setTokenBalance] = useState(0)
  const { account, signer } = useWallet()
  const config = getAlephiumLoanConfig()
  const tokenInfo = getTokenInfo(bidToken)
  const currentBidValue = bidAmount
  const minBidInTokens = currentBidValue / Math.pow(10, tokenInfo.decimals)
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        const balance = tokenInfo.id === '0000000000000000000000000000000000000000000000000000000000000000'
          ? await alphBalanceOf(account.address)
          : await balanceOf(tokenInfo.id, account.address)
        
        setTokenBalance(Number(balance) / Math.pow(10, tokenInfo.decimals))
      }
    }

    fetchBalance()
  }, [account?.address, bidToken, tokenInfo.id, tokenInfo.decimals])

  const handleSetMaxAmount = () => {
    setBidsAmount(tokenBalance.toFixed(2).toString())
  }

  const displayValue = formatNumber(bidAmount / Math.pow(10, getTokenInfo(bidToken).decimals))
  const displayCollateral = formatNumber(collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals))
  
  const displayCurrentBid = formatNumber(currentBidValue / Math.pow(10, getTokenInfo(bidToken).decimals))

  const usdBidValue = !isPricesLoading && tokenPrices && tokenPrices[bidToken] ? 
    formatNumber((bidAmount / Math.pow(10, getTokenInfo(bidToken).decimals)) * tokenPrices[bidToken]) : '...'
  const usdCollateralValue = !isPricesLoading && tokenPrices && tokenPrices[collateralToken] ? 
    formatNumber((collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals)) * tokenPrices[collateralToken]) : '...'
  const usdCurrentBidValue = !isPricesLoading && tokenPrices && tokenPrices[bidToken] ? 
    formatNumber((currentBidValue / Math.pow(10, getTokenInfo(bidToken).decimals)) * tokenPrices[bidToken]) : '...'

  const handleBid = async () => {
    setError('')
    setIsLoading(true)
    try {
      const bidAmountInTokens = parseFloat(bidsAmount) * Math.pow(10, tokenInfo.decimals)
      const result = await BidAuctionService(signer, config.auctionFactoryContractId, id, bidToken, bidAmountInTokens)
      window.addTransactionToast('Placing Bid', result.txId)
    } catch (error) {
      setError('Failed to place bid')
      console.error('Error placing bid:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidBid = bidsAmount && !isNaN(bidsAmount) && parseFloat(bidsAmount) >= minBidInTokens

  const isAuctionEnded = new Date(timeToEnd).getTime() <= new Date().getTime()

  const handleRedeem = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
    try {
      const result = await RedeemAuctionService(
        signer,
        config.auctionFactoryContractId,
        id
      )
      window.addTransactionToast('Redeeming Auction', result.txId)
    } catch (err) {
      console.error("Error redeeming auction:", err)
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
      className="bg-gradient-to-br from-purple-900/20 to-gray-900/90 rounded-xl p-5 text-white border border-purple-700/50 transition-all hover:shadow-xl hover:shadow-purple-900/20 relative"
    >
      <div className="absolute top-0 left-0 right-0 bg-purple-500/20 rounded-t-xl p-3 text-center border-b border-purple-500/20">
        <span className="text-xs text-purple-300 flex items-center justify-center gap-2">
          {highestBidder !== loaner ? (
            <>
              {isAuctionEnded ? 'Auction ended' : 'Auction ends in'}
              <span className="bg-purple-600/80 px-3 py-1 rounded text-sm font-semibold text-white">
                <AuctionTimer endTime={endDate} className="font-medium" />
              </span>
            </>
          ) : (
            <>
              Place a bid to start the auction
            </>
          )}
        </span>
      </div>

      <div className="mt-16">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 mb-1">Collateral for auction</span>
              <div className="flex items-center gap-2">
                <img 
                  src={getTokenInfo(collateralToken).logoURI}
                  alt={getTokenInfo(collateralToken).symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-2xl font-semibold">{displayCollateral}</span>
                <span className="text-sm text-gray-400">{getTokenInfo(collateralToken).symbol}</span>
                <span className="text-xs text-gray-500">(${usdCollateralValue})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">
              {highestBidder !== loaner ? 'Current Bid' : 'Starting Bid'}
            </span>
            {highestBidder !== loaner && (
              <span className="text-xs text-purple-300">
                Min: {formatNumber(minBidInTokens)} {tokenInfo.symbol}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={getTokenInfo(bidToken).logoURI}
              alt={getTokenInfo(bidToken).symbol}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <span className="font-medium text-lg">{displayCurrentBid}</span>
              <span className="text-gray-400 ml-2">{getTokenInfo(bidToken).symbol}</span>
              <span className="text-xs text-gray-500 ml-2">(${usdCurrentBidValue})</span>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 pt-4 mb-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Loaner</span>
              <span className="text-sm font-medium">
                {ansProfile?.loaner?.name || shortenAddress(loaner)}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-gray-400">Highest Bidder</span>
              <span className="text-sm font-medium text-purple-300">
                {highestBidder !== loaner ? ansProfile?.highestBidder?.name || shortenAddress(highestBidder) : 'No bids yet'}
              </span>
            </div>
          </div>
        </div>

        {isAuctionEnded && highestBidder === account?.address ? (
          <div className="mb-4">
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              onClick={handleRedeem}
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
                hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
                border border-green-500/20 hover:border-green-500/30 
                transition-all duration-300 ease-out
                text-green-400 hover:text-green-300 font-medium 
                shadow-lg shadow-green-900/20 hover:shadow-green-900/30
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
              ) : (
                <>
                  <span>Redeem Auction</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        ) : (isAuctionEnded || highestBidder === loaner) && highestBidder !== account?.address ? (
          <div className="mb-4">
            <div className="relative">
              <input
                type="number"
                value={bidsAmount}
                onChange={(e) => setBidsAmount(e.target.value)}
                placeholder={`Enter bid amount in ${tokenInfo.symbol}`}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-purple-500/20 
                  text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={handleSetMaxAmount}
                  className="px-2 py-1 text-xs font-medium text-purple-400 hover:text-purple-300 
                    bg-purple-500/10 hover:bg-purple-500/20 
                    border border-purple-500/20 hover:border-purple-500/30 
                    rounded-lg transition-colors duration-200"
                >
                  MAX
                </button>
                {!isPricesLoading && bidsAmount && (
                  <span className="text-sm text-gray-400">
                    ≈ ${formatNumber(parseFloat(bidsAmount) * (tokenPrices[bidToken] || 0))}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Available balance: {formatNumber(tokenBalance)} {tokenInfo.symbol}
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            
            <button
              onClick={handleBid}
              disabled={isLoading || !isValidBid}
              className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/20 via-purple-500/30 to-purple-400/20 
                hover:from-purple-500/30 hover:via-purple-500/40 hover:to-purple-400/30
                border border-purple-500/20 hover:border-purple-500/30 
                transition-all duration-300 ease-out
                text-purple-400 hover:text-purple-300 font-medium 
                shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
              ) : (
                <>
                  <span>Place Bid</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 4v16m8-8H4" />
                  </svg>
                </>
              )}
            </button>
          </div>
        ) : !isAuctionEnded && highestBidder === account?.address ? (
          <div className="mb-4">
            <p className="text-gray-400 text-sm">You are the highest bidder</p>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-gray-400 text-sm">This auction has ended</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AuctionCard 