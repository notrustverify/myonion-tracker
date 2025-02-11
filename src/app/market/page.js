'use client'

import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import PoolCard from '../../components/PoolCard'
import { useState, useRef, useEffect } from 'react'
import CreatePoolModal from '../../components/CreatePoolModal'
import { motion } from 'framer-motion'
import { getTokensList } from '../../lib/configs'
import PoolBubble from '../../components/PoolBubble'
import { HiViewGrid, HiViewList } from 'react-icons/hi'
import Matter from 'matter-js'

const ALPH_TOKEN = getTokensList()[0]

const MOCK_POOLS = [
  {
    id: 1,
    name: "ALPH Lending Pool",
    tvl: 1500000,
    apr: 12.5,
    token: ALPH_TOKEN.symbol,
    risk: "Low",
    utilizationRate: 76,
    depositors: 145
  },
  {
    id: 2,
    name: "ALPH High Yield",
    tvl: 2800000,
    apr: 24.3,
    token: ALPH_TOKEN.symbol,
    risk: "Medium",
    utilizationRate: 89,
    depositors: 89
  },
  {
    id: 3,
    name: "ALPH Stable Pool",
    tvl: 4200000,
    apr: 8.7,
    token: ALPH_TOKEN.symbol,
    risk: "Low",
    utilizationRate: 65,
    depositors: 234
  },
  {
    id: 4,
    name: "ALPH Yield Pool",
    tvl: 980000,
    apr: 15.8,
    token: ALPH_TOKEN.symbol,
    risk: "Medium",
    utilizationRate: 82,
    depositors: 167
  },
  {
    id: 5,
    name: "ALPH Conservative",
    tvl: 750000,
    apr: 7.2,
    token: ALPH_TOKEN.symbol,
    risk: "Low",
    utilizationRate: 45,
    depositors: 98
  },
  {
    id: 6,
    name: "ALPH Premium Pool",
    tvl: 3100000,
    apr: 28.5,
    token: ALPH_TOKEN.symbol,
    risk: "High",
    utilizationRate: 94,
    depositors: 56
  }
]

export default function MarketPage() {
  const [activeFilter, setActiveFilter] = useState('all pools')
  const [viewMode, setViewMode] = useState('grid')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const containerRef = useRef(null)
  const [engine, setEngine] = useState(null)

  const filterPools = () => {
    switch(activeFilter) {
      case 'high yield':
        return MOCK_POOLS.filter(pool => pool.apr > 20)
      case 'stable':
        return MOCK_POOLS.filter(pool => pool.risk === 'Low')
      case 'new':
        return MOCK_POOLS.slice(0, 3)
      default:
        return MOCK_POOLS
    }
  }

  const filteredPools = filterPools()

  useEffect(() => {
    if (viewMode !== 'bubble') {
      return
    }

    const initEngine = () => {
      if (!containerRef.current) {
        setTimeout(initEngine, 100)
        return

      }

      const engineInstance = Matter.Engine.create({
        gravity: { x: 0, y: 0 },
        enableSleeping: false
      })

      const container = containerRef.current
      const bounds = container.getBoundingClientRect()

      const walls = [
        Matter.Bodies.rectangle(bounds.width / 2, -10, bounds.width, 20, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(bounds.width / 2, bounds.height + 10, bounds.width, 20, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(-10, bounds.height / 2, 20, bounds.height, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(bounds.width + 10, bounds.height / 2, 20, bounds.height, { 
          isStatic: true,
          render: { visible: false }
        })
      ]

      Matter.World.add(engineInstance.world, walls)

      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engineInstance)

      setEngine(engineInstance)

      return () => {
        Matter.Runner.stop(runner)
        Matter.Engine.clear(engineInstance)
        setEngine(null)
      }
    }

    initEngine()

    return () => {
      if (engine) {
        Matter.Engine.clear(engine)
        setEngine(null)
      }
    }
  }, [viewMode, engine])

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
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 flex-grow"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-between items-center"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Lending Pools
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 text-lg"
            >
              Deposit assets and earn yield from lending pools
            </motion.p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-400/10 
            hover:from-green-500/20 hover:via-green-500/30 hover:to-green-400/20 
            border border-green-500/20 hover:border-green-500/30 
            transition-all duration-300 ease-out
            text-green-400 hover:text-green-300 font-medium 
            shadow-lg shadow-green-900/20 hover:shadow-green-900/30
            flex items-center gap-3"
          >
            <span className="relative">
              <span className="block w-2 h-2 rounded-full bg-green-400 group-hover:animate-ping absolute -left-4 top-1/2 -translate-y-1/2"></span>
              <span className="block w-2 h-2 rounded-full bg-green-400 absolute -left-4 top-1/2 -translate-y-1/2"></span>
              Create Pool
            </span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { 
              label: 'Total Value Locked', 
              value: `$${MOCK_POOLS.reduce((acc, curr) => acc + curr.tvl, 0).toLocaleString()}`
            },
            { 
              label: 'Active Pools', 
              value: MOCK_POOLS.length 
            },
            { 
              label: 'Average APR', 
              value: `${(MOCK_POOLS.reduce((acc, curr) => acc + curr.apr, 0) / MOCK_POOLS.length).toFixed(2)}%`
            },
          ].map((stat, index) => (
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

        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            {['All Pools', 'High Yield', 'Stable', 'New'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${activeFilter === filter.toLowerCase()
                    ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-gray-600/50'
                  }`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>

          <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiViewGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('bubble')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'bubble' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiViewList className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPools.map((pool) => (
              <motion.div key={pool.id} variants={itemVariants}>
                <PoolCard {...pool} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div 
            ref={containerRef}
            className="relative h-[600px] w-full rounded-xl bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
          >
            {engine && containerRef.current && filteredPools.map((pool) => {
              return (
                <PoolBubble 
                  key={pool.id} 
                  {...pool} 
                  containerRef={containerRef}
                  engine={engine}
                />
              )
            })}
          </div>
        )}

        <CreatePoolModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </motion.main>

      <Footer />
    </div>
  )
}
