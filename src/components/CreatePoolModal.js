'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTokensList } from '../lib/configs'
import { useWallet } from '@alephium/web3-react'

const CustomTokenSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const tokensList = getTokensList()
  const selectedToken = tokensList.find(t => t.symbol === value)

  return (
    <div className="relative min-w-[140px]">
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

const CreatePoolModal = ({ isOpen, onClose }) => {
  const tokensList = getTokensList()
  const [token, setToken] = useState(tokensList[0].symbol)
  const { signer } = useWallet()
  const [name, setName] = useState('')
  const [targetSize, setTargetSize] = useState('')
  const [minDeposit, setMinDeposit] = useState('')
  const [maxDeposit, setMaxDeposit] = useState('')
  const [apr, setApr] = useState('')
  const [risk, setRisk] = useState('low')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  const tokens = tokensList.map(token => token.symbol)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement pool creation logic
      console.log('Creating pool:', {
        name,
        token,
        targetSize,
        minDeposit,
        maxDeposit,
        apr,
        risk
      })
      onClose()
    } catch (error) {
      console.error('Error creating pool:', error)
    } finally {
      setIsSubmitting(false)
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
                <h3 className="text-2xl font-semibold text-white">Create New Pool</h3>
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
                    Pool Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                    focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                    placeholder-gray-500 transition-all duration-200"
                    placeholder="e.g. USDC Stable Pool"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Asset
                  </label>
                  <CustomTokenSelect 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    options={tokens}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Size
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetSize}
                        onChange={(e) => setTargetSize(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      APR (%)
                    </label>
                    <input
                      type="number"
                      value={apr}
                      onChange={(e) => setApr(e.target.value)}
                      className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                      focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                      placeholder-gray-500 transition-all duration-200
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="5"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Min Deposit
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={minDeposit}
                        onChange={(e) => setMinDeposit(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Deposit
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={maxDeposit}
                        onChange={(e) => setMaxDeposit(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white 
                        focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50
                        placeholder-gray-500 transition-all duration-200
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0.00"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setRisk(level.toLowerCase())}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${risk === level.toLowerCase()
                            ? level === 'Low' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                              : level === 'Medium'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                                : 'bg-red-500/20 text-red-400 border border-red-500/20'
                            : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-gray-600/50'
                          }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
                    hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
                    border border-green-500/20 hover:border-green-500/30 
                    transition-all duration-300 ease-out
                    text-green-400 hover:text-green-300 font-medium 
                    shadow-lg shadow-green-900/20 hover:shadow-green-900/30
                    flex items-center justify-center gap-2
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? 'Creating...' : 'Create Pool'}</span>
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

export default CreatePoolModal 