'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWallet } from '@alephium/web3-react'
import { getTokensList, getAlephiumLoanConfig } from '../../lib/configs'
import { RemoveCollateralService } from '../../services/loan.services'

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList()
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const adjustAmountWithDecimals = (amount, decimals) => {
  const amountStr = amount.toString()
  return amount * Math.pow(10, decimals)
}

const RemoveCollateralModal = ({ isOpen, onClose, loan }) => {
  const { signer } = useWallet()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const config = getAlephiumLoanConfig()

  const handleRemoveCollateral = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await RemoveCollateralService(
        signer, 
        config.loanFactoryContractId, 
        loan.id, 
        adjustAmountWithDecimals(amount, getTokenInfo(loan.collateralToken).decimals)
      )
      window.addTransactionToast('Remove Collateral', result.txId)
      onClose()
    } catch (err) {
      console.error('Error removing collateral:', err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-lg mx-4 overflow-hidden border border-gray-700/50"
          >
            <div className="border-b border-gray-700/50 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white">Remove Collateral</h3>
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount to Remove
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <img
                      src={getTokenInfo(loan.collateralToken).logoURI}
                      alt={getTokenInfo(loan.collateralToken).symbol}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-gray-400">
                      {getTokenInfo(loan.collateralToken).symbol}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleRemoveCollateral}
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
                    <span>Remove Collateral</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20 12H4" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RemoveCollateralModal 