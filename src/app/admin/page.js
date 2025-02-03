'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '../../components/navbar'
import { web3, NodeProvider } from '@alephium/web3'
import { useWallet } from '@alephium/web3-react'
import LoanCard from '../../components/LoanCard'

const StatsModule = ({ title, value, description, icon }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50 
    hover:border-gray-600/50 transition-all hover:shadow-xl hover:shadow-gray-900/20">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-800 rounded-lg">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
      <div className="text-2xl font-bold text-green-400 mb-2">{value}</div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
}

const LoansList = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [loans, setLoans] = useState([
    {
      value: 1000,
      currency: 'ALPH',
      collateralAmount: 2000,
      collateralCurrency: 'USDT',
      term: 3,
      interest: 8.5,
      lender: 'EXAMPLE',
      borrower: 'EXAMPLE',
      status: 'active'
    },
    {
      value: 5000,
      currency: 'ALPH',
      collateralAmount: 8500,
      collateralCurrency: 'USDT',
      term: 6,
      interest: 9.2,
      lender: 'EXAMPLE',
      borrower: 'EXAMPLE',
      status: 'active'
    },
    {
      value: 2500,
      currency: 'ALPH',
      collateralAmount: 3750,
      collateralCurrency: 'USDT',
      term: 4,
      interest: 7.8,
      lender: 'EXAMPLE',
      borrower: 'EXAMPLE',
      status: 'pending'
    },
    {
      value: 7500,
      currency: 'ALPH',
      collateralAmount: 15000,
      collateralCurrency: 'USDT',
      term: 12,
      interest: 10.5,
      lender: 'EXAMPLE',
      borrower: 'EXAMPLE',
      status: 'active'
    },
    {
      value: 3000,
      currency: 'ALPH',
      collateralAmount: 4500,
      collateralCurrency: 'USDT',
      term: 5,
      interest: 8.0,
      lender: 'EXAMPLE',
      borrower: 'EXAMPLE',
      status: 'pending'
    }
  ])

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Active Loans</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-700/30 text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-700/30 text-gray-400'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'flex flex-col gap-4'
      }>
        {loans.map((loan, index) => (
          <LoanCard key={index} {...loan} />
        ))}
      </div>
    </div>
  )
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      type: 'loan_created',
      message: 'New loan created',
      amount: '7500 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T10:30:00Z'
    },
    {
      id: 2,
      type: 'loan_repaid',
      message: 'Loan repaid',
      amount: '500 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T09:15:00Z'
    },
    {
      id: 3,
      type: 'loan_created',
      message: 'New loan created',
      amount: '3000 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T08:45:00Z'
    },
    {
      id: 4,
      type: 'loan_funded',
      message: 'Loan funded',
      amount: '2500 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T07:30:00Z'
    },
    {
      id: 5,
      type: 'collateral_added',
      message: 'Collateral added',
      amount: '8500 USDT',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T06:20:00Z'
    },
    {
      id: 6,
      type: 'loan_repaid',
      message: 'Loan repaid',
      amount: '1000 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T05:45:00Z'
    },
    {
      id: 7,
      type: 'loan_created',
      message: 'New loan created',
      amount: '5000 ALPH',
      user: 'EXAMPLE',
      timestamp: '2024-03-20T04:30:00Z'
    }
  ])

  const getLogIcon = (type) => {
    switch(type) {
      case 'loan_created':
        return (
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'loan_repaid':
        return (
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'loan_funded':
        return (
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'collateral_added':
        return (
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="p-2 bg-gray-500/20 rounded-lg">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 border border-gray-700/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg">
            {getLogIcon(log.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">{log.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">{log.amount}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{log.user}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatDate(log.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalVolume: 0,
    totalFees: 0,
    activeLoans: 0,
    defaultRate: 0,
    avgInterestRate: 0
  })

  useEffect(() => {
    const initializeContracts = async () => {
      try {
        const nodeProvider = new NodeProvider('https://node.alphaga.app/')
        web3.setCurrentNodeProvider(nodeProvider)

        setStats({
          totalLoans: 156,
          totalVolume: '1,234,567 ALPH',
          totalFees: '12,345 ALPH',
          activeLoans: 45,
          defaultRate: '2.3%',
          avgInterestRate: '8.5%'
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize:', error)
      }
    }

    initializeContracts()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Platform statistics and metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsModule 
            title="Total Loans"
            value={stats.totalLoans}
            description="Total number of loans created"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsModule 
            title="Total Volume"
            value={stats.totalVolume}
            description="Total value of all loans"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <StatsModule 
            title="Total Fees"
            value={stats.totalFees}
            description="Total fees collected"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <StatsModule 
            title="Active Loans"
            value={stats.activeLoans}
            description="Number of currently active loans"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsModule 
            title="Default Rate"
            value={stats.defaultRate}
            description="Percentage of defaulted loans"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsModule 
            title="Avg Interest Rate"
            value={stats.avgInterestRate}
            description="Average interest rate across all loans"
            icon={
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LoansList />
          </div>
          <div className="lg:col-span-1">
            <ActivityLogs />
          </div>
        </div>
      </main>
    </div>
  )
}
