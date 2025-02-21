'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { getTokensList } from '../../lib/configs'
import DashboardLoanModal from './DashboardLoanModal'
import Timer from '../Timer'

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

const DEFAULT_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'

const truncateAddress = (address) => {
  if (!address || address === DEFAULT_ADDRESS) return 'No borrower yet'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const DashboardLoanCard = ({ 
  tokenAmount,
  tokenRequested,
  collateralAmount,
  collateralToken,
  duration,
  interest,
  lender,
  borrower,
  status = 'active',
  type,
  canLiquidate,
  createdAt,
  id,
  tokenPrices,
  isPricesLoading,
  ansProfile
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const lenderName = ansProfile?.lender?.name;
  const borrowerName = ansProfile?.borrower?.name;

  const displayValue = formatNumber(tokenAmount / Math.pow(10, getTokenInfo(tokenRequested).decimals))
  const displayCollateral = formatNumber(collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals))
  
  const usdValue = !isPricesLoading && tokenPrices[tokenRequested] ? 
    formatNumber((tokenAmount / Math.pow(10, getTokenInfo(tokenRequested).decimals)) * tokenPrices[tokenRequested]) : '...'
  const usdCollateral = !isPricesLoading && tokenPrices[collateralToken] ? 
    formatNumber((collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals)) * tokenPrices[collateralToken]) : '...'

  const collateralRatio = tokenPrices[collateralToken] && tokenPrices[tokenRequested] 
    ? ((collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals)) * tokenPrices[collateralToken]) / 
      ((tokenAmount / Math.pow(10, getTokenInfo(tokenRequested).decimals)) * tokenPrices[tokenRequested]) * 100
    : 0

  const getStatusBadge = (status) => {
    if (status === 'terminated') {
      return (
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/20 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          Terminated
        </div>
      )
    }
    if (status === 'active') {
      return (
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/20 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
          Active
        </div>
      )
    }
    return (
      <div className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        Pending
      </div>
    )
  }

  const checkLoanStatus = () => {
    if (status === 'pending') return 'pending'
    const createdAtTimestamp = new Date(createdAt).getTime()
    const endDate = createdAtTimestamp + duration
    if (Date.now() > endDate) return 'terminated'
    return 'active'
  }

  const currentStatus = checkLoanStatus()

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        onClick={() => setIsModalOpen(true)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-5 text-white border border-gray-700/50 hover:border-gray-600/50 transition-all hover:shadow-xl hover:shadow-gray-900/20 cursor-pointer relative group"
      >
        <div className="transition-all duration-300 group-hover:blur-sm">
          <div className="flex justify-between items-start mb-6">
            <motion.div 
              className="flex flex-col"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-gray-400 mb-1">Loan amount</span>
              <div className="flex items-center gap-2">
                <img 
                  src={getTokenInfo(tokenRequested).logoURI}
                  alt={getTokenInfo(tokenRequested).symbol}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-2xl font-semibold">{displayValue}</span>
                <span className="text-sm text-gray-400">{getTokenInfo(tokenRequested).symbol}</span>
                <span className="text-xs text-gray-500">(${usdValue})</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {getStatusBadge(currentStatus)}
            </motion.div>
          </div>

          <motion.div 
            className="mb-6 p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Collateral</span>
              <span className={`text-xs font-medium ${getCollateralRatioColor(collateralRatio)}`}>
                {collateralRatio}% Ratio
              </span>
            </div>
            <div className="flex items-center gap-3">
              <img 
                src={getTokenInfo(collateralToken).logoURI}
                alt={getTokenInfo(collateralToken).symbol}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <span className="font-medium text-lg">{displayCollateral}</span>
                <span className="text-gray-400 ml-2">{getTokenInfo(collateralToken).symbol}</span>
                <span className="text-xs text-gray-500 ml-2">(${usdCollateral})</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div 
              className="p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-gray-400 block mb-1">Time Left</span>
              <span className="font-medium">
                <Timer createdAt={createdAt} duration={duration} />
              </span>
            </motion.div>
            <motion.div 
              className="p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-gray-400 block mb-1">Interest</span>
              <span className="font-medium text-green-400">{(interest / 100).toFixed(2)}%</span>
            </motion.div>
          </div>

          <motion.div 
            className="border-t border-gray-700/50 pt-4"
            animate={{ opacity: isHovered ? 0.9 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Lender</span>
                <span className="text-sm font-medium">
                  {lenderName || truncateAddress(lender)}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-right">
                <span className="text-xs text-gray-400">Borrower</span>
                <span className="text-sm font-medium text-gray-400">
                  {borrowerName || truncateAddress(borrower)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="group/btn px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
            hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
            border border-green-500/20 hover:border-green-500/30 
            transition-all duration-300 ease-out
            text-green-400 hover:text-green-300 font-medium 
            shadow-lg shadow-green-900/20 hover:shadow-green-900/30
            flex items-center justify-center gap-2">
            <span>Manage Loan</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-0.5" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </motion.div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]">
          <DashboardLoanModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            loan={{
              id,
              tokenAmount,
              tokenRequested,
              collateralAmount,
              collateralToken,
              duration,
              interest,
              borrower: borrower === DEFAULT_ADDRESS ? null : borrower,
              lender: lender === DEFAULT_ADDRESS ? null : lender,
              status,
              type,
              canLiquidate,
              createdAt
            }}
            tokenPrices={tokenPrices}
            isPricesLoading={isPricesLoading}
            ansProfile={ansProfile}
          />
        </div>,
        document.body
      )}
    </>
  )
}

export default DashboardLoanCard 