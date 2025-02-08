'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@alephium/web3-react'
import { getTokensList } from '../lib/configs'

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value)
}

const getTokenInfo = (tokenSymbol) => {
  const tokens = getTokensList()
  return tokens.find(t => t.symbol === tokenSymbol) || {
    symbol: tokenSymbol,
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const PoolModal = ({ isOpen, onClose, pool }) => {
  const { signer } = useWallet()
  const [activeTab, setActiveTab] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getRiskLevel = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'conservative'
      case 'medium':
        return 'moderate'
      case 'high':
        return 'aggressive'
      default:
        return 'unknown'
    }
  }

  const riskLevel = getRiskLevel(pool.risk)

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleDeposit = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement deposit logic
      console.log('Depositing:', amount)
      onClose()
    } catch (err) {
      console.error("Error depositing:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorrow = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement borrow logic
      console.log('Borrowing:', amount, 'with collateral:', collateralAmount)
      onClose()
    } catch (err) {
      console.error("Error borrowing:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Pool Details</h3>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30 p-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-4">
                {['deposit', 'borrow'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-all
                      ${activeTab === tab
                        ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                        : 'text-gray-400 hover:text-gray-300'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="block text-sm text-gray-400 mb-3">Pool Info</span>
                  <div className="flex items-center gap-3">
                    <img 
                      src={getTokenInfo(pool.token).logoURI}
                      alt={pool.token}
                      className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg"
                    />
                    <div>
                      <h4 className="font-medium text-[15px] text-white">{pool.name}</h4>
                      <p className="text-xs text-gray-400">{pool.depositors} Depositors</p>
                    </div>
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: 1,
                    height: 'auto',
                    transition: {
                      height: {
                        duration: 0.3
                      },
                      opacity: {
                        duration: 0.2,
                        delay: 0.1
                      }
                    }
                  }}
                  exit={{ 
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: {
                        duration: 0.2
                      },
                      opacity: {
                        duration: 0.1
                      }
                    }
                  }}
                  className="space-y-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Risk Level</span>
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`font-medium ${
                        riskLevel === 'conservative' ? 'text-green-500' :
                        riskLevel === 'moderate' ? 'text-yellow-500' :
                        riskLevel === 'aggressive' ? 'text-red-500' :
                        'text-gray-500'
                      }`}
                    >
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                    </motion.span>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex">
                      <div className="w-[30%] h-full border-r border-gray-700/50"></div>
                      <div className="w-[20%] h-full border-r border-gray-700/50"></div>
                      <div className="w-[20%] h-full border-r border-gray-700/50"></div>
                      <div className="w-[30%] h-full"></div>
                    </div>

                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${
                            riskLevel === 'conservative' ? '100%' :
                            riskLevel === 'moderate' ? '66%' :
                            riskLevel === 'aggressive' ? '33%' : '0%'
                          }`,
                          transition: { duration: 0.5, ease: "easeOut" }
                        }}
                        className={`h-full transition-all duration-300 ${
                          riskLevel === 'conservative' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                          riskLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                          riskLevel === 'aggressive' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                          'bg-gray-600'
                        }`}
                      />
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex justify-between text-xs mt-1 px-1"
                    >
                      <span className="text-red-500">High</span>
                      <span className="text-yellow-500">Medium</span>
                      <span className="text-green-500">Low</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">TVL</span>
                  <span className="text-xl font-semibold text-white">${formatNumber(pool.tvl)}</span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">APR</span>
                  <span className="text-xl font-semibold text-green-400">{pool.apr}%</span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Utilization</span>
                  <span className="text-xl font-semibold text-white">{pool.utilizationRate}%</span>
                </div>
              </div>

              {activeTab === 'deposit' ? (
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="block text-sm font-medium text-gray-300 mb-3">Deposit Amount</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '')
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          setAmount(value)
                        }
                      }}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                      placeholder-gray-500 transition-all duration-200"
                      placeholder={`Enter amount in ${pool.token}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <span className="block text-sm font-medium text-gray-300 mb-3">Borrow Amount</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '')
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setAmount(value)
                          }
                        }}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200"
                        placeholder={`Enter amount to borrow in ${pool.token}`}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <span className="block text-sm font-medium text-gray-300 mb-3">Collateral Amount</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={collateralAmount}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '')
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setCollateralAmount(value)
                          }
                        }}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200"
                        placeholder={`Enter collateral amount in ${pool.token}`}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                <button 
                  onClick={activeTab === 'deposit' ? handleDeposit : handleBorrow}
                  disabled={isLoading || !amount || (activeTab === 'borrow' && !collateralAmount)}
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
                      <span>{activeTab === 'deposit' ? 'Deposit' : 'Borrow'}</span>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PoolModal 