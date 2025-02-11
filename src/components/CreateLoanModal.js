'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreateLoanService } from '../services/loan.services'
import { getAlephiumLoanConfig, getBackendUrl, getTokensList } from '../lib/configs'
import { useWallet } from '@alephium/web3-react'
import { alphBalanceOf, balanceOf } from '../lib/utils'

const formatNumber = (number) => {
  if (number === undefined || number === null) return '0'
  
  if (number < 0.01 && number > 0) {
    return '< 0.01'
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number)
}

const CustomTokenSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const tokensList = getTokensList()
  const selectedToken = tokensList.find(t => t.symbol === value)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative min-w-[140px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 bg-gray-900/50 border border-gray-700 rounded-xl 
        px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50"
      >
        <img 
          src={selectedToken?.logoURI}
          alt={value}
          className="w-6 h-6 rounded-full"
        />
        <span>{value}</span>
        <svg 
          className="w-5 h-5 text-gray-400 ml-auto" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
          <div className="max-h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
            {options.map(symbol => {
              const token = tokensList.find(t => t.symbol === symbol)
              return (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => {
                    onChange({ target: { value: symbol } })
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 text-white text-left"
                >
                  <img 
                    src={token?.logoURI}
                    alt={symbol}
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span>{symbol}</span>
                    <span className="text-xs text-gray-400">{token?.name}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const CreateLoanModal = ({ isOpen, onClose }) => {
  const tokensList = getTokensList()
  const [loanToken, setLoanToken] = useState(tokensList[0].symbol)
  const [collateralToken, setCollateralToken] = useState(tokensList[0].symbol)
  const { account, signer } = useWallet()
  const [loanAmount, setLoanAmount] = useState('')
  const [collateralAmount, setCollateralAmount] = useState('')
  const [enableLiquidation, setEnableLiquidation] = useState(true)
  const [term, setTerm] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const config = getAlephiumLoanConfig()
  const [tokenPrices, setTokenPrices] = useState({})
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [loanTokenBalance, setLoanTokenBalance] = useState(0)
  const [collateralTokenBalance, setCollateralTokenBalance] = useState(0)
  const tokens = tokensList.map(token => token.symbol)
  const backendUrl = getBackendUrl()

  useEffect(() => {
    const fetchBalances = async () => {
      if (account?.address) {
        const loanTokenInfo = tokensList.find(t => t.symbol === loanToken)
        const collateralTokenInfo = tokensList.find(t => t.symbol === collateralToken)

        const getLoanBalance = loanTokenInfo.id === '0000000000000000000000000000000000000000000000000000000000000000'
          ? await alphBalanceOf(account.address)
          : await balanceOf(loanTokenInfo.id, account.address)
        
        const getCollateralBalance = collateralTokenInfo.id === '0000000000000000000000000000000000000000000000000000000000000000'
          ? await alphBalanceOf(account.address)
          : await balanceOf(collateralTokenInfo.id, account.address)

        setLoanTokenBalance(Number(getLoanBalance) / Math.pow(10, loanTokenInfo.decimals))
        setCollateralTokenBalance(Number(getCollateralBalance) / Math.pow(10, collateralTokenInfo.decimals))
      }
    }

    fetchBalances()
  }, [account?.address, loanToken, collateralToken])

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const tokens = [loanToken, collateralToken]
        const prices = {}
        
        for (const token of tokens) {
          const tokenInfo = tokensList.find(t => t.symbol === token)
          const response = await fetch(`${backendUrl}/api/market-data?assetId=${tokenInfo.id}`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          prices[token] = data.priceUSD
        }
        
        setTokenPrices(prices)
        setIsLoadingPrices(false)
      } catch (error) {
        console.error('Error fetching token prices:', error)
        setIsLoadingPrices(false)
      }
    }

    if (loanToken && collateralToken) {
      fetchTokenPrices()
    }
  }, [loanToken, collateralToken])
  
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const calculateUSDValue = (amount, token) => {
    if (!amount || !tokenPrices[token]) return 0
    return parseFloat(amount) * tokenPrices[token]
  }

  const calculateRiskRatio = () => {
    if (!loanAmount || !collateralAmount) return 0
    const loanUSDValue = calculateUSDValue(loanAmount, loanToken)
    const collateralUSDValue = calculateUSDValue(collateralAmount, collateralToken)
    return loanUSDValue ? (collateralUSDValue / loanUSDValue) * 100 : 0
  }

  const getRiskLevel = (ratio) => {
    if (ratio === 0) return 'none'
    if (ratio < 150) return 'liquidation'
    if (ratio < 200) return 'high'
    if (ratio < 300) return 'aggressive'
    if (ratio < 400) return 'moderate'
    return 'conservative'
  }

  const riskRatio = calculateRiskRatio()
  const riskLevel = getRiskLevel(riskRatio)

  const adjustAmountWithDecimals = (amount, decimals) => {
    return amount * Math.pow(10, decimals)
  }

  const handleSetMaxLoanAmount = () => {
    setLoanAmount(loanTokenBalance.toString())
  }

  const handleSetMaxCollateralAmount = () => {
    setCollateralAmount(collateralTokenBalance.toString())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const loanTokenInfo = tokensList.find(t => t.symbol === loanToken)
      const collateralTokenInfo = tokensList.find(t => t.symbol === collateralToken)
      
      const adjustedLoanAmount = adjustAmountWithDecimals(parseFloat(loanAmount), loanTokenInfo?.decimals)
      const adjustedCollateralAmount = adjustAmountWithDecimals(parseFloat(collateralAmount), collateralTokenInfo?.decimals)
      
      const createLoanResponse = await CreateLoanService(
        signer,
        config.loanFactoryContractId,
        loanTokenInfo?.id,
        adjustedLoanAmount,
        collateralTokenInfo?.id,
        adjustedCollateralAmount,
        parseFloat(interestRate),
        parseInt(term) * 60 * 1000,
        enableLiquidation,
        collateralTokenInfo?.isOracle,
        loanTokenInfo?.isOracle
      )
      window.addTransactionToast('New Loan Request', createLoanResponse.txId)
      onClose()

    } catch (error) {
      console.error('Error creating loan:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCollateralRatioValid = () => {
    const ratio = calculateRiskRatio()
    return ratio >= 150
  }

  const isFormValid = () => {
    return (
      loanAmount && 
      collateralAmount && 
      term && 
      interestRate && 
      isCollateralRatioValid()
    )
  }

  const getSubmitButtonText = () => {
    if (isSubmitting) return 'Creating...'
    if (!loanAmount || !collateralAmount) return 'Enter amounts'
    if (!term) return 'Enter loan term'
    if (!interestRate) return 'Enter interest rate'
    if (!isCollateralRatioValid()) return 'Collateral ratio must be at least 150%'
    return 'Create Loan Request'
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
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
                <h3 className="text-2xl font-semibold text-white">Create New Loan</h3>
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

            <div className="p-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Loan Amount
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                          onClick={handleSetMaxLoanAmount}
                          className="px-2 py-1 text-xs font-medium text-green-400 hover:text-green-300 
                            bg-green-500/10 hover:bg-green-500/20 
                            border border-green-500/20 hover:border-green-500/30 
                            rounded-lg transition-colors duration-200"
                        >
                          MAX
                        </button>
                        {!isLoadingPrices && loanAmount && (
                          <span className="text-sm text-gray-400">
                            ≈ ${formatNumber(calculateUSDValue(loanAmount, loanToken))}
                          </span>
                        )}
                      </div>
                    </div>
                    <CustomTokenSelect 
                      value={loanToken}
                      onChange={(e) => setLoanToken(e.target.value)}
                      options={tokens}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Available balance: {formatNumber(loanTokenBalance)} {loanToken}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Collateral
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                          onClick={handleSetMaxCollateralAmount}
                          className="px-2 py-1 text-xs font-medium text-green-400 hover:text-green-300 
                            bg-green-500/10 hover:bg-green-500/20 
                            border border-green-500/20 hover:border-green-500/30 
                            rounded-lg transition-colors duration-200"
                        >
                          MAX
                        </button>
                        {!isLoadingPrices && collateralAmount && (
                          <span className="text-sm text-gray-400">
                            ≈ ${formatNumber(calculateUSDValue(collateralAmount, collateralToken))}
                          </span>
                        )}
                      </div>
                    </div>
                    <CustomTokenSelect 
                      value={collateralToken}
                      onChange={(e) => setCollateralToken(e.target.value)}
                      options={tokens}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Available balance: {formatNumber(collateralTokenBalance)} {collateralToken}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Term (minutes)
                    </label>
                    <input
                      type="number"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                      placeholder-gray-500 transition-all duration-200
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="60"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                      placeholder-gray-500 transition-all duration-200
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="enableLiquidation"
                      checked={enableLiquidation}
                      onChange={(e) => setEnableLiquidation(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-800 border border-gray-700 rounded-full peer 
                      peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                      after:bg-gray-400 after:border after:rounded-full after:h-5 after:w-5 
                      after:transition-all peer-checked:bg-green-500/20 peer-checked:border-green-500/50
                      peer-checked:after:bg-green-500"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-300">
                      Enable Liquidation
                    </span>
                  </label>

                  <AnimatePresence mode="wait">
                    {enableLiquidation && (
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
                          <div className="flex items-center gap-2">
                            <motion.span className={`font-medium ${
                              riskLevel === 'conservative' ? 'text-green-500' :
                              riskLevel === 'moderate' ? 'text-yellow-500' :
                              riskLevel === 'aggressive' ? 'text-orange-500' :
                              riskLevel === 'high' ? 'text-red-500' :
                              riskLevel === 'liquidation' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                            </motion.span>
                            <span className="text-gray-500">
                              ({formatNumber(riskRatio)}%)
                            </span>
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
                                  const ratio = riskRatio;
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
                                riskLevel === 'liquidation' ? 'bg-gradient-to-r from-red-700 to-red-600' : 'bg-gray-600'
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
                    hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
                    border border-green-500/20 hover:border-green-500/30 
                    transition-all duration-300 ease-out
                    text-green-400 hover:text-green-300 font-medium 
                    shadow-lg shadow-green-900/20 hover:shadow-green-900/30
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                    disabled:hover:from-green-500/20 disabled:hover:via-green-500/30 disabled:hover:to-green-400/20
                    disabled:hover:border-green-500/20 disabled:hover:text-green-400"
                  >
                    <span>{getSubmitButtonText()}</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CreateLoanModal