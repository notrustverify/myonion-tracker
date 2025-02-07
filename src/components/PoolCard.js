'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { getTokensList } from '../lib/configs'
import PoolModal from './PoolModal'

const getRiskColor = (risk) => {
  switch (risk.toLowerCase()) {
    case 'low':
      return 'text-green-400'
    case 'medium':
      return 'text-yellow-400'
    case 'high':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
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

const PoolCard = ({ 
  name,
  tvl,
  apr,
  token,
  risk,
  utilizationRate,
  depositors,
  id
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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
              <span className="text-xs text-gray-400 mb-1">Lending Pool</span>
              <div className="flex items-center gap-2">
                <img 
                  src={getTokenInfo(token).logoURI}
                  alt={token}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-2xl font-semibold">{name}</span>
              </div>
            </motion.div>
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(risk)} bg-opacity-20 border border-opacity-20`}
                style={{
                  backgroundColor: `${getRiskColor(risk).replace('text', 'bg')}/20`,
                  borderColor: `${getRiskColor(risk).replace('text', 'border')}/20`
                }}
              >
                {risk} Risk
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mb-6 p-3 bg-gray-800/50 rounded-lg"
            whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Total Value Locked</span>
              <span className="text-xs font-medium text-green-400">
                {depositors} Depositors
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-lg">${formatNumber(tvl)}</span>
              <span className="text-gray-400">{token}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div 
              className="p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-gray-400 block mb-1">APR</span>
              <span className="font-medium text-green-400">{apr}%</span>
            </motion.div>
            <motion.div 
              className="p-3 bg-gray-800/50 rounded-lg"
              whileHover={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs text-gray-400 block mb-1">Utilization</span>
              <span className="font-medium">{utilizationRate}%</span>
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="group/btn px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
            hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
            border border-green-500/20 hover:border-green-500/30 
            transition-all duration-300 ease-out
            text-green-400 hover:text-green-300 font-medium 
            shadow-lg shadow-green-900/20 hover:shadow-green-900/30
            flex items-center justify-center gap-2">
            <span>View Pool</span>
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
          <PoolModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            pool={{
              id,
              name,
              tvl,
              apr,
              token,
              risk,
              utilizationRate,
              depositors
            }}
          />
        </div>,
        document.body
      )}
    </>
  )
}

export default PoolCard 