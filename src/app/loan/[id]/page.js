'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '../../../components/navbar'
import { Footer } from '../../../components/footer'
import { motion } from 'framer-motion'
import { getBackendUrl, getTokensList } from '../../../lib/configs'
import { ANS } from '@alph-name-service/ans-sdk'
import { getAlephiumLoanConfig } from '../../../lib/configs'
import Timer from '../../../components/Timer'
import { useWallet } from '@alephium/web3-react'
import { ForfeitLoanService, CancelLoanService, AcceptLoanService, LiquidateLoanService } from '../../../services/loan.services'
import { AiOutlineUser } from 'react-icons/ai'
import ShareLoanButton from '../../../components/ShareLoanButton'

export default function LoanDetailPage() {
  const [loanDetails, setLoanDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const params = useParams()
  const backendUrl = getBackendUrl()
  
  const [ansProfiles, setAnsProfiles] = useState({})
  const { signer, account } = useWallet()

  const DEFAULT_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'

  const formatDuration = (duration) => {
    const minutes = duration / (60 * 1000);
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    
    if (months >= 1) return `${Math.floor(months)} month${Math.floor(months) !== 1 ? 's' : ''}`;
    if (days >= 1) return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''}`;
    if (hours >= 1) return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
    return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`;
  }

  const fetchLoanDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/api/loan-by-id/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch loan details')
      }
      const data = await response.json()
      setLoanDetails(data)
      
      const addresses = [data.loan.borrower, data.loan.lender].filter(Boolean)
      fetchAnsProfiles(addresses)
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching loan details:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const fetchAnsProfiles = async (addresses) => {
    try {
      const config = getAlephiumLoanConfig()
      const ans = new ANS('mainnet', false, config.defaultNodeUrl, config.defaultExplorerUrl)
      const profiles = {}

      for (const address of addresses) {
        if (address && address !== DEFAULT_ADDRESS) {
          const profile = await ans.getProfile(address)
          if (profile?.name) {
            profiles[address] = profile
          }
        }
      }

      setAnsProfiles(profiles)
    } catch (error) {
      console.error('Error fetching ANS profiles:', error)
    }
  }

  const getTokenInfo = (tokenId) => {
    const tokens = getTokensList()
    return tokens.find(t => t.id === tokenId) || {
      symbol: 'Unknown',
      logoURI: '/tokens/unknown.png',
      decimals: 18
    }
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value)
  }

  const shortenAddress = (address) => {
    if (!address || address === DEFAULT_ADDRESS) return "-"
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
  }

  const calculateCollateralRatio = () => {
    if (!loanDetails) return 0
    
    const { loan: loanData, marketData } = loanDetails
    
    const collateralTokenDecimals = getTokenInfo(loanData.collateralToken).decimals
    const requestedTokenDecimals = getTokenInfo(loanData.tokenRequested).decimals
    
    const collateralValueUSD = (loanData.collateralAmount / Math.pow(10, collateralTokenDecimals)) * 
                              marketData.collateralToken.priceUSD
    
    const loanValueUSD = (loanData.tokenAmount / Math.pow(10, requestedTokenDecimals)) * 
                        marketData.requestedToken.priceUSD
    
    return (collateralValueUSD / loanValueUSD) * 100
  }

  const getRiskLevel = (ratio) => {
    const numericRatio = parseFloat(ratio)
    if (numericRatio < 150) return 'liquidation'
    if (numericRatio < 200) return 'high'
    if (numericRatio < 300) return 'aggressive'
    if (numericRatio < 400) return 'moderate'
    return 'conservative'
  }

  const [isLoading, setIsLoading] = useState(false)

  const handleForfeit = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
    try {
      const result = await ForfeitLoanService(
        signer,
        config.loanFactoryContractId,
        loanDetails.loan.id
      )
      window.addTransactionToast('Forfeiting Loan', result.txId)
    } catch (err) {
      console.error("Error forfeiting loan:", err)
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
    const config = getAlephiumLoanConfig();
    try {
      const result = await CancelLoanService(
        signer,
        config.loanFactoryContractId,
        loanDetails.loan.id
      )
      window.addTransactionToast('Cancelling Loan', result.txId)
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
    const config = getAlephiumLoanConfig();
    try {
      const result = await AcceptLoanService(
        signer,
        config.loanFactoryContractId,
        loanDetails.loan.id,
        loanDetails.loan.tokenRequested,
        loanDetails.loan.tokenAmount
      )
      window.addTransactionToast('Accepting Loan', result.txId)
    } catch (err) {
      console.error("Error accepting loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLiquidate = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
    try {
      const result = await LiquidateLoanService(
        signer,
        config.loanFactoryContractId,
        loanDetails.loan.id
      )
      window.addTransactionToast('Liquidating Loan', result.txId)
    } catch (err) {
      console.error("Error liquidating loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderActionButton = () => {  
    const endTime = new Date(loanDetails.loan.endDate).getTime()
    const now = new Date().getTime()
    const isExpired = now >= endTime
    const isLiquidatable = (collateralRatio < 150 && loanDetails.loan.canLiquidate) || (isExpired && loanDetails.loan.canLiquidate)
    const isActive = loanDetails.loan.active
    const isPending = !loanDetails.loan.active
    const isBorrower = loanDetails.loan.borrower === account?.address

    if (isLiquidatable) {
      return (
        <button 
          onClick={handleLiquidate}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-400/20 
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
              <span>Liquidate Loan</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      )
    }

    if (isExpired && isActive) {
      return (
        <button 
          onClick={handleForfeit}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-400/20 
            hover:from-orange-500/30 hover:via-orange-500/40 hover:to-orange-400/30
            border border-orange-500/20 hover:border-orange-500/30 
            transition-all duration-300 ease-out
            text-orange-400 hover:text-orange-300 font-medium 
            shadow-lg shadow-orange-900/20 hover:shadow-orange-900/30
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Forfeit Loan</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      )
    }

    if (isPending && !isActive && !isBorrower) {
      return (
        <button 
          onClick={handleAcceptLoan}
          disabled={isLoading || isBorrower}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
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
              <span>Accept Loan</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      )
    }

    if (isPending && !isActive && isBorrower) {
      return (
        <button 
          onClick={handleCancelLoan}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-gray-500/20 via-gray-500/30 to-gray-400/20 
            hover:from-gray-500/30 hover:via-gray-500/40 hover:to-gray-400/30
            border border-gray-500/20 hover:border-gray-500/30 
            transition-all duration-300 ease-out
            text-gray-400 hover:text-gray-300 font-medium 
            shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
      )
    }
    
    return null
  }

  useEffect(() => {
    if (params.id) {
      fetchLoanDetails()
    }
  }, [params.id, backendUrl])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !loanDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <div className="flex-grow flex justify-center items-center flex-col gap-4">
          <h2 className="text-2xl text-red-400">Error loading loan details</h2>
          <p className="text-gray-400">{error || "Loan not found"}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </div>
    )
  }

  const { loan: loanData, marketData } = loanDetails
  const collateralRatio = calculateCollateralRatio()
  
  const requestedTokenInfo = getTokenInfo(loanData.tokenRequested)
  const collateralTokenInfo = getTokenInfo(loanData.collateralToken)
  
  const displayLoanAmount = formatNumber(loanData.tokenAmount / Math.pow(10, requestedTokenInfo.decimals))
  const displayCollateralAmount = formatNumber(loanData.collateralAmount / Math.pow(10, collateralTokenInfo.decimals))
  
  const loanValueUSD = formatNumber((loanData.tokenAmount / Math.pow(10, requestedTokenInfo.decimals)) * 
                      marketData.requestedToken.priceUSD)
  
  const collateralValueUSD = formatNumber((loanData.collateralAmount / Math.pow(10, collateralTokenInfo.decimals)) * 
                            marketData.collateralToken.priceUSD)

  const riskLevel = getRiskLevel(collateralRatio.toFixed(2))

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 flex-grow"
      >
        <div className="mb-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Loans
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Loan Details</h1>
            <p className="text-gray-400">ID: {loanData.id.substring(0, 16)}...</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-6 py-3 rounded-full text-lg font-medium ${
              loanData.active 
                ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
            } flex items-center justify-center gap-3`}>
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full ${loanData.active ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              </div>
            </div>
            
            <ShareLoanButton 
              loanId={params.id}
              loanData={loanData}
              requestedTokenInfo={requestedTokenInfo}
              collateralTokenInfo={collateralTokenInfo}
              displayLoanAmount={displayLoanAmount}
              displayCollateralAmount={displayCollateralAmount}
              loanValueUSD={loanValueUSD}
              collateralValueUSD={collateralValueUSD}
              collateralRatio={collateralRatio}
              riskLevel={riskLevel}
              formatDuration={formatDuration}
              shortenAddress={shortenAddress}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Loan Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400 block mb-2">Loan Amount</span>
                  <div className="flex items-center gap-3">
                    <img 
                      src={requestedTokenInfo.logoURI}
                      alt={requestedTokenInfo.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <span className="font-medium text-xl text-white">{displayLoanAmount}</span>
                      <span className="text-gray-400 ml-2">{requestedTokenInfo.symbol}</span>
                      <span className="text-sm text-gray-500 block">(${loanValueUSD})</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Collateral</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <img 
                      src={collateralTokenInfo.logoURI}
                      alt={collateralTokenInfo.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <span className="font-medium text-xl text-white">{displayCollateralAmount}</span>
                      <span className="text-gray-400 ml-2">{collateralTokenInfo.symbol}</span>
                      <span className="text-sm text-gray-500 block">(${collateralValueUSD})</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400 block mb-2">Interest Rate</span>
                  <span className="font-medium text-xl text-green-400">{(loanData.interest / 100).toFixed(2)}%</span>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400 block mb-2">Duration</span>
                  <span className="font-medium text-xl text-white">{formatDuration(parseInt(loanData.duration))}</span>
                </div>
                
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-sm text-gray-400 block mb-2">Time Remaining</span>
                  <span className="font-medium text-xl text-white">
                    {loanData.active ? (
                      <Timer createdAt={loanData.acceptedAt} duration={parseInt(loanData.duration)} />
                    ) : (
                      "Not started"
                    )}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Loan Timeline</h2>
              
              <div className="relative pl-8 pb-8">
                <div className="absolute top-0 left-3 h-full w-0.5 bg-gray-700"></div>
                
                <div className="relative mb-8">
                  <div className="absolute -left-8 mt-1.5 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Loan Created</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(loanData.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Loan request created by borrower
                    </p>
                  </div>
                </div>
                
                <div className="relative mb-8">
                  <div className="absolute -left-8 mt-1.5 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Loan Accepted</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(loanData.acceptedAt).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Loan funded by lender
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-8 mt-1.5 w-6 h-6 rounded-full bg-gray-700/50 border border-gray-600/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Loan Expiration</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(loanData.endDate).toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Deadline for loan repayment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Participants</h2>
              
              <div className="mb-6">
                <span className="text-sm text-gray-400 block mb-3">Borrower</span>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  {ansProfiles[loanData.borrower]?.imgUri ? (
                    <img 
                      src={ansProfiles[loanData.borrower].imgUri} 
                      className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                      alt="" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                      <AiOutlineUser className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-white block">
                      {ansProfiles[loanData.borrower]?.name || shortenAddress(loanData.borrower)}
                    </span>
                    {ansProfiles[loanData.borrower]?.name && (
                      <span className="text-sm text-gray-400">{shortenAddress(loanData.borrower)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <span className="text-sm text-gray-400 block mb-3">Lender</span>
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                  {ansProfiles[loanData.lender]?.imgUri ? (
                    <img 
                      src={ansProfiles[loanData.lender].imgUri} 
                      className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                      alt="" 
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                      <AiOutlineUser className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-white block">
                      {ansProfiles[loanData.lender]?.name || shortenAddress(loanData.lender)}
                    </span>
                    {ansProfiles[loanData.lender]?.name && (
                      <span className="text-sm text-gray-400">{shortenAddress(loanData.lender)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6">Loan Status</h2>
              
              <div className="space-y-3 p-3 md:p-4 bg-gray-900/50 rounded-xl border border-gray-800 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Level</span>
                  <div className="flex items-center gap-2">
                    <motion.span className={`font-medium ${
                      riskLevel === 'conservative' ? 'text-green-500' :
                      riskLevel === 'moderate' ? 'text-yellow-500' :
                      riskLevel === 'aggressive' ? 'text-orange-500' :
                      riskLevel === 'high' ? 'text-red-500' :
                      'text-red-600'
                    }`}>
                      {collateralRatio.toFixed(2)}%
                    </motion.span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                    <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                    <div className="w-[34%] h-full"></div>
                  </div>

                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(() => {
                          const ratio = parseFloat(collateralRatio);
                          if (ratio <= 150) return 0;
                          if (ratio <= 200) return ((ratio - 150) / 50) * 33;
                          if (ratio <= 300) return 33 + ((ratio - 200) / 100) * 33;
                          if (ratio <= 400) return 66 + ((ratio - 300) / 100) * 34;
                          return 100;
                        })()}%`,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }}
                      className={`h-full transition-all duration-300 ${
                        riskLevel === 'conservative' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        riskLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        riskLevel === 'aggressive' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                        riskLevel === 'high' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        'bg-gradient-to-r from-red-700 to-red-600'
                      }`}
                    />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between text-xs mt-1 px-1"
                  >
                    <span className="text-red-500">150%</span>
                    <span className="text-orange-500">200%</span>
                    <span className="text-yellow-500">300%</span>
                    <span className="text-green-500">400%+</span>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    Minimum collateral ratio: 150%. Lower ratios risk liquidation.
                  </span>
                </motion.div>
              </div>
              
              {collateralRatio < 150 && loanData.canLiquidate && (
                <div className="mb-6">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="font-medium text-red-400">
                          Liquidation Risk
                        </span>
                        <p className="text-sm text-gray-400 mt-1">
                          This loan is at risk of liquidation due to low collateral ratio
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {renderActionButton()}
            </div>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  )
}
