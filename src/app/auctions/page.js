'use client'

import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getBackendUrl, getTokensList, getAlephiumLoanConfig } from '../../lib/configs'
import { ANS } from '@alph-name-service/ans-sdk'
import AuctionCard from '../../components/AuctionCard'

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [ansProfiles, setAnsProfiles] = useState({})
  const [isPricesLoading, setIsPricesLoading] = useState(true)
  const [tokenPrices, setTokenPrices] = useState({})
  const [totalAuctionsValue, setTotalAuctionsValue] = useState(0)
  const backendUrl = getBackendUrl()

  const DEFAULT_ADDRESS = "tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq"

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

  const fetchAuctions = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${backendUrl}/api/auctions`)
      const data = await response.json()
      
      const transformedAuctions = data.map(auction => ({
        id: auction.id,
        bidAmount: auction.bidAmount,
        bidToken: auction.bidToken,
        collateralAmount: auction.collateralAmount,
        collateralToken: auction.collateralToken,
        term: parseInt(auction.duration),
        highestBidder: auction.highestBidder,
        loaner: auction.loaner,
        status: auction.active ? 'active' : 'pending',
        createdAt: auction.createdAt,
        timeToEnd: auction.timeToEnd,
        endDate: auction.endDate,
        type: auction.type
      }))

      setAuctions(transformedAuctions)

      if (!isPricesLoading) {
        const total = transformedAuctions.reduce((sum, auction) => {
          const tokenPrice = tokenPrices[auction.bidToken] || 0
          const auctionValue = (parseFloat(auction.bidAmount) / 1e18) * tokenPrice
          return sum + auctionValue
        }, 0)
        setTotalAuctionsValue(total)
      }

      const addresses = new Set()
      transformedAuctions.forEach(auction => {
        if (auction.loaner) addresses.add(auction.loaner)
        if (auction.highestBidder) addresses.add(auction.highestBidder)
      })

      await fetchAnsProfiles(Array.from(addresses))
    } catch (error) {
      console.error('Error fetching auctions:', error)
      setAuctions([])
    } finally {
      setLoading(false)
    }
  }, [backendUrl, fetchAnsProfiles, isPricesLoading, tokenPrices])

  useEffect(() => {
    fetchTokenPrices()
    const pricesInterval = setInterval(fetchTokenPrices, 60000)
    return () => clearInterval(pricesInterval)
  }, [fetchTokenPrices])

  useEffect(() => {
    fetchAuctions()
    const auctionsInterval = setInterval(fetchAuctions, 30000)
    return () => clearInterval(auctionsInterval)
  }, [fetchAuctions])

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
      label: 'Auctions', 
      value: auctions.length 
    },
    { 
      label: 'Total Collateral Value', 
      value: `$${totalAuctionsValue < 1 
        ? totalAuctionsValue.toFixed(2)
        : new Intl.NumberFormat('en-US').format(Math.round(totalAuctionsValue))}` 
    },
    { 
      label: 'Average Collateral Ratio', 
      value: `${auctions.length ? Math.round(auctions.reduce((acc, auction) => {
        const tokenPrice = tokenPrices[auction.bidToken] || 0
        const collateralPrice = tokenPrices[auction.collateralToken] || 0
        
        const auctionValue = (parseFloat(auction.bidAmount) / 1e18) * tokenPrice
        const collateralValue = (parseFloat(auction.collateralAmount) / 1e18) * collateralPrice
        
        const ratio = auctionValue > 0 ? (collateralValue / auctionValue) * 100 : 0
        return acc + ratio
      }, 0) / auctions.length) : 0}%` 
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
            Auctions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-lg"
          >
            Browse all auctions and bid on them to get collateral with a discount.
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
            {auctions.length === 0 ? (
              <motion.div 
                variants={itemVariants}
                className="col-span-full text-center py-12"
              >
                <div className="text-gray-400 text-lg">
                  No auctions currently available
                </div>
              </motion.div>
            ) : (
              auctions.map((auction) => (
                <motion.div
                  key={auction.id}
                  variants={itemVariants}
                  className="relative"
                >
                  <AuctionCard 
                    {...auction} 
                    tokenPrices={tokenPrices} 
                    isPricesLoading={isPricesLoading} 
                    ansProfile={{ 
                      loaner: ansProfiles[auction.loaner], 
                      highestBidder: ansProfiles[auction.highestBidder] 
                    }} 
                  />
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