'use client'

import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import LoanCard from '../../components/LoanCard'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getBackendUrl, getTokensList } from '../../lib/configs'

export default function LiquidationPage() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [tokenPrices, setTokenPrices] = useState({})
  const [totalLiquidationValue, setTotalLiquidationValue] = useState(0)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const backendUrl = getBackendUrl()

  const fetchTokenPrices = useCallback(async () => {
    try {
      const tokensList = getTokensList()
      console.log('TokensList:', tokensList)
      const prices = {}
      
      for (const token of tokensList) {
        const response = await fetch(`${backendUrl}/api/market-data?assetId=${token.id}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        console.log(`Price for ${token.symbol}:`, data.priceUSD)
        prices[token.id] = data.priceUSD
      }
      
      console.log('All token prices:', prices)
      setTokenPrices(prices)
    } catch (error) {
      console.error('Error fetching token prices:', error)
    }
  }, [backendUrl])

  useEffect(() => {
    fetchTokenPrices()
    const interval = setInterval(fetchTokenPrices, 60000)
    return () => clearInterval(interval)
  }, [fetchTokenPrices])

  const fetchLoans = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const limit = 12
      const skip = (page - 1) * limit

      console.log('Fetching liquidation loans')
      const response = await fetch(`${backendUrl}/api/loans?limit=${limit}&skip=${skip}`)
      const data = await response.json()
      console.log('Raw loans data:', data)
      
      if (Object.keys(tokenPrices).length === 0) {
        console.log('Token prices not yet available')
        setLoans([])
        return
      }

      const transformedLoans = data.loans
        .map(loan => {
          const collateralAmount = Number(loan.collateralAmount)
          const tokenAmount = Number(loan.tokenAmount)
          
          const collateralValueUSD = tokenPrices[loan.collateralToken] ? 
            (collateralAmount / Math.pow(10, 18)) * tokenPrices[loan.collateralToken] : 0
          const loanValueUSD = tokenPrices[loan.tokenRequested] ? 
            (tokenAmount / Math.pow(10, 18)) * tokenPrices[loan.tokenRequested] : 0
          
          const collateralRatio = loanValueUSD > 0 ? (collateralValueUSD / loanValueUSD) * 100 : 0

          console.log('Processing loan:', {
            id: loan.id,
            collateralValueUSD,
            loanValueUSD,
            collateralRatio,
            status: loan.active ? 'active' : 'pending',
            canLiquidate: loan.canLiquidate
          })

          return {
            value: tokenAmount,
            currency: loan.tokenRequested,
            collateralAmount: collateralAmount,
            collateralCurrency: loan.collateralToken,
            term: Number(loan.duration) / (30 * 24 * 60 * 60 * 1000),
            interest: Number(loan.interest),
            lender: loan.creator,
            borrower: loan.loanee,
            status: loan.active ? 'active' : 'pending',
            id: loan.id,
            liquidation: loan.liquidation,
            canLiquidate: loan.canLiquidate,
            collateralRatio: collateralRatio,
            collateralValueUSD,
            loanValueUSD
          }
        })
        .filter(loan => {
          console.log(`Filtering loan ${loan.id}: ratio=${loan.collateralRatio}, status=${loan.status}, canLiquidate=${loan.canLiquidate}`)
          return loan.collateralRatio <= 150 && loan.canLiquidate === true && loan.collateralRatio > 0
        })
        .sort((a, b) => a.collateralRatio - b.collateralRatio)

      console.log('Final liquidation loans:', transformedLoans)
      setLoans(transformedLoans)
      setTotalLiquidationValue(transformedLoans.reduce((acc, loan) => acc + loan.collateralValueUSD, 0))
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(data.total / limit),
        total: data.total
      })
    } catch (error) {
      console.error('Error fetching loans:', error)
    } finally {
      setLoading(false)
    }
  }, [tokenPrices, backendUrl])

  useEffect(() => {
    fetchLoans(1)
    const interval = setInterval(() => fetchLoans(pagination.currentPage), 30000)
    return () => clearInterval(interval)
  }, [fetchLoans, pagination.currentPage])

  useEffect(() => {
    console.log('TokenPrices updated:', tokenPrices)
  }, [tokenPrices])

  useEffect(() => {
    console.log('Loans updated:', loans)
  }, [loans])

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow container mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Liquidation Dashboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Monitor loans at risk of liquidation. These loans have a collateral ratio of 150% or less.
            Refresh every 30 seconds to stay updated with the latest market conditions.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { 
              label: 'Loans at Risk', 
              value: loans.length,
              color: 'red'
            },
            { 
              label: 'Total Value at Risk', 
              value: `$${new Intl.NumberFormat('en-US').format(Math.round(totalLiquidationValue))}`,
              color: 'yellow'
            },
            { 
              label: 'Average Collateral Ratio', 
              value: `${loans.length ? Math.round(loans.reduce((acc, loan) => acc + loan.collateralRatio, 0) / loans.length) : 0}%`,
              color: 'orange'
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`bg-${stat.color}-500/10 rounded-xl p-6 text-center backdrop-blur-sm border border-${stat.color}-500/20`}
            >
              <div className={`text-2xl font-bold text-${stat.color}-400 mb-2`}>{stat.value}</div>
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
                  <LoanCard {...loan} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </motion.main>

      <Footer />
    </div>
  )
}