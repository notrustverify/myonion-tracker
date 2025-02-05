'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTokensList } from '../../lib/configs'
import { ANS } from '@alph-name-service/ans-sdk'
import { AiOutlineUser } from "react-icons/ai"
import { useWallet } from '@alephium/web3-react'
import { getAlephiumLoanConfig } from '../../lib/configs'
import { 
  CancelLoanService, 
  PayLoanService, 
  AcceptLoanService 
} from '../../services/loan.services'

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
  if (!address) return "Unknown"
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
}

const DashboardLoanModal = ({ isOpen, onClose, loan }) => {
  const { account, signer } = useWallet()
  const [creatorAnsName, setCreatorAnsName] = useState('')
  const [creatorAnsUri, setCreatorAnsUri] = useState('')
  const [loaneeAnsName, setLoaneeAnsName] = useState('')
  const [loaneeAnsUri, setLoaneeAnsUri] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const config = getAlephiumLoanConfig()

  const isCreator = account?.address === loan.creator
  const isBorrower = account?.address === loan.loanee

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const ans = new ANS('mainnet', false, config.defaultNodeUrl, config.defaultExplorerUrl)
        
        if (loan.creator) {
          const creatorProfile = await ans.getProfile(loan.creator)
          if (creatorProfile?.name) setCreatorAnsName(creatorProfile.name)
          if (creatorProfile?.imgUri) setCreatorAnsUri(creatorProfile.imgUri)
        }

        if (loan.loanee && loan.loanee !== loan.creator) {
          const loaneeProfile = await ans.getProfile(loan.loanee)
          if (loaneeProfile?.name) setLoaneeAnsName(loaneeProfile.name)
          if (loaneeProfile?.imgUri) setLoaneeAnsUri(loaneeProfile.imgUri)
        }
      } catch (error) {
        console.error("Error fetching ANS profiles:", error)
      }
    }

    if (isOpen) {
      getProfiles()
    }
  }, [isOpen, loan, config.defaultNodeUrl, config.defaultExplorerUrl])

  const handleRepayLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await PayLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id,
        loan.tokenRequested,
        loan.tokenAmount
      )
      
      onClose()
    } catch (err) {
      console.error("Error repaying loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await CancelLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id
      )
      
      onClose()
    } catch (err) {
      console.error("Error cancelling loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await AcceptLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id
      )
      
      onClose()
    } catch (err) {
      console.error("Error accepting loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawCollateral = async () => {
    setIsLoading(true)
    try {
      console.log("Withdrawing collateral for loan:", loan.id)
    } catch (error) {
      console.error("Error withdrawing collateral:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const collateralRatio = ((loan.collateralAmount / loan.tokenAmount) * 100).toFixed(0)

  const getRiskLevel = (ratio) => {
    const numericRatio = parseFloat(ratio)
    if (numericRatio < 150) return 'liquidation'
    if (numericRatio < 200) return 'high'
    if (numericRatio < 300) return 'aggressive'
    if (numericRatio < 400) return 'moderate'
    return 'conservative'
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              scale: 0.95, 
              opacity: 0, 
              y: -20,
              transition: { duration: 0.15 }
            }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-700/50"
          >
            <div className="border-b border-gray-700/50 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white">Manage Loan</h3>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30 p-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="block text-sm text-gray-400 mb-3">Creator</span>
                  <div className="flex items-center gap-3">
                    {creatorAnsUri ? (
                      <img 
                        src={creatorAnsUri} 
                        className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                        alt="" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                        <AiOutlineUser className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-[15px] text-white">
                        {creatorAnsName || "Unnamed"}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {shortenAddress(loan.creator)}
                      </p>
                    </div>
                  </div>
                </div>

                {loan.loanee && loan.loanee !== loan.creator && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <span className="block text-sm text-gray-400 mb-3">Borrower</span>
                    <div className="flex items-center gap-3">
                      {loaneeAnsUri ? (
                        <img 
                          src={loaneeAnsUri} 
                          className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                          alt="" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                          <AiOutlineUser className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-[15px] text-white">
                          {loaneeAnsName || "Unnamed"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {shortenAddress(loan.loanee)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Amount</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.tokenRequested).logoURI}
                        alt={getTokenInfo(loan.tokenRequested).symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-2xl font-semibold text-white">
                        {formatNumber(loan.tokenAmount)}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.tokenRequested).symbol}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Collateral</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.collateralToken).logoURI}
                        alt={getTokenInfo(loan.collateralToken).symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-2xl font-semibold text-white">
                        {formatNumber(loan.collateralAmount)}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.collateralToken).symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Term</span>
                  <span className="text-lg font-medium text-white">
                    {loan.duration} months
                  </span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Interest</span>
                  <span className="text-lg font-medium text-green-400">
                    {loan.interest}%
                  </span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Collateral Ratio</span>
                  <span className={`text-lg font-medium ${getCollateralRatioColor(collateralRatio)}`}>
                    {collateralRatio}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {error && (
                  <div className="col-span-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {isBorrower && loan.status === 'active' && (
                  <button 
                    onClick={handleRepayLoan}
                    disabled={isLoading}
                    className="group px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
                      hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
                      border border-green-500/20 hover:border-green-500/30 
                      transition-all duration-300 ease-out
                      text-green-400 hover:text-green-300 font-medium 
                      shadow-lg shadow-green-900/20 hover:shadow-green-900/30
                      flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Repay Loan</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
                
                {isCreator && loan.status === 'pending' && (
                  <button 
                    onClick={handleCancelLoan}
                    disabled={isLoading}
                    className="group px-6 py-4 rounded-xl bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-400/20 
                      hover:from-red-500/30 hover:via-red-500/40 hover:to-red-400/30
                      border border-red-500/20 hover:border-red-500/30 
                      transition-all duration-300 ease-out
                      text-red-400 hover:text-red-300 font-medium 
                      shadow-lg shadow-red-900/20 hover:shadow-red-900/30
                      flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Cancel Loan</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
                
                {!isCreator && loan.status === 'pending' && (
                  <button 
                    onClick={handleAcceptLoan}
                    disabled={isLoading}
                    className="group px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500/20 via-blue-500/30 to-blue-400/20 
                      hover:from-blue-500/30 hover:via-blue-500/40 hover:to-blue-400/30
                      border border-blue-500/20 hover:border-blue-500/30 
                      transition-all duration-300 ease-out
                      text-blue-400 hover:text-blue-300 font-medium 
                      shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30
                      flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Accept Loan</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DashboardLoanModal 