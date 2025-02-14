'use client'

import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import LoanCard from '../../components/LoanCard'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getBackendUrl, getTokensList, getAlephiumLoanConfig } from '../../lib/configs'
import LoanModal from '../../components/LoanModal'
import { ANS } from '@alph-name-service/ans-sdk'

export default function LiquidationPage() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [ansProfiles, setAnsProfiles] = useState({})
  const [isPricesLoading, setIsPricesLoading] = useState(true)
  const [tokenPrices, setTokenPrices] = useState({})
  const [totalLiquidationValue, setTotalLiquidationValue] = useState(0)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const backendUrl = getBackendUrl()

  const getTokenInfo = (tokenId) => {
    const tokens = getTokensList()
    return tokens.find(t => t.id === tokenId) || {
      symbol: 'Unknown',
      logoURI: '/tokens/unknown.png',
      decimals: 18
    }
  }

  const fetchTokenPrices = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/market-data`)
      const data = await response.json()
      
      const pricesMap = data.reduce((acc, token) => {
        if (token.assetId && token.priceUSD) {
          acc[token.assetId] = parseFloat(token.priceUSD)
        }
        return acc
      }, {})

      setTokenPrices(pricesMap)
    } catch (error) {
      console.error('Error fetching token prices:', error)
      setTokenPrices({})
    } finally {
      setIsPricesLoading(false)
    }
  }, [backendUrl])

  const fetchAnsProfiles = useCallback(async (addresses) => {
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
  }, [])

  const fetchLoans = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/api/loans`)
      const data = await response.json()
      
      const transformedLoans = data.loans.map(loan => ({
        id: loan.id,
        value: loan.tokenAmount,
        currency: loan.tokenRequested,
        collateralAmount: loan.collateralAmount,
        collateralCurrency: loan.collateralToken,
        term: parseInt(loan.duration),
        interest: loan.interest,
        lender: loan.loanee,
        borrower: loan.creator,
        status: loan.active ? 'active' : 'pending',
        liquidation: loan.liquidation,
        canLiquidate: loan.canLiquidate,
        createdAt: loan.createdAt
      }))

      const riskyLoans = transformedLoans.filter(loan => {
        if (!tokenPrices[loan.currency] || !tokenPrices[loan.collateralCurrency]) return false
        
        const collateralRatio = (
          ((loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralCurrency).decimals)) * tokenPrices[loan.collateralCurrency]) / 
          ((loan.value / Math.pow(10, getTokenInfo(loan.currency).decimals)) * tokenPrices[loan.currency]) * 100
        )
        
        return collateralRatio <= 150
      })

      setLoans(riskyLoans)

      const addresses = new Set()
      riskyLoans.forEach(loan => {
        if (loan.borrower) addresses.add(loan.borrower)
        if (loan.lender) addresses.add(loan.lender)
      })

      await fetchAnsProfiles(Array.from(addresses))
    } catch (error) {
      console.error('Error fetching loans:', error)
      setLoans([])
    } finally {
      setLoading(false)
    }
  }, [backendUrl, fetchAnsProfiles, tokenPrices])

  useEffect(() => {
    fetchTokenPrices()
    const pricesInterval = setInterval(fetchTokenPrices, 60000)
    return () => clearInterval(pricesInterval)
  }, [fetchTokenPrices])

  useEffect(() => {
    fetchLoans()
    const loansInterval = setInterval(fetchLoans, 30000)
    return () => clearInterval(loansInterval)
  }, [fetchLoans])

  const handleOpenModal = (loan) => {
    setSelectedLoan(loan)
    setIsModalOpen(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const stats = [
    { 
      label: 'Loans at Risk', 
      value: loans.length 
    },
    { 
      label: 'Total Value at Risk', 
      value: `$${new Intl.NumberFormat('en-US').format(Math.round(totalLiquidationValue))}` 
    },
    { 
      label: 'Average Collateral Ratio', 
      value: `${loans.length ? Math.round(loans.reduce((acc, loan) => acc + loan.collateralRatio, 0) / loans.length) : 0}%` 
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 flex-grow"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Liquidation Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Monitor loans at risk of liquidation. These loans have a collateral ratio of 150% or less.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-gray-700/50"
            >
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {loans.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-400 text-lg">
                  No loans currently at risk of liquidation
                </div>
              </motion.div>
            ) : (
              loans.map((loan) => (
                <motion.div
                  key={loan.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <LoanCard {...loan} tokenPrices={tokenPrices} isPricesLoading={isPricesLoading} ansProfile={{ borrower: ansProfiles[loan.borrower], lender: ansProfiles[loan.lender] }} onOpenModal={() => handleOpenModal(loan)} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.main>

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => {setIsModalOpen(false), setSelectedLoan(null)}}
        loan={selectedLoan || {}}
        tokenPrices={tokenPrices}
        isPricesLoading={isPricesLoading}
        ansProfile={selectedLoan ? {
          borrower: ansProfiles[selectedLoan.borrower],
          lender: ansProfiles[selectedLoan.lender]
        } : {}}
      />

      <Footer />
    </div>
  )
}