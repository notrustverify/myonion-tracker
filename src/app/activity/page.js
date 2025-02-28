"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { motion, AnimatePresence } from 'framer-motion';
import { PiHandCoins, PiWarningCircleBold, PiChartLineUp, PiChartBar, PiCurrencyCircleDollar } from "react-icons/pi";
import { FaHistory, FaGavel, FaPlus, FaMinus, FaHandshake, FaCoins, FaTimes, FaFilter, FaSearch } from 'react-icons/fa';
import { TbGavel } from "react-icons/tb";
import axios from 'axios';
import { getTokensList, getBackendUrl } from '../../lib/configs';
import { formatDistanceToNow } from 'date-fns';

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList();
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  };
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value);
};

const formatTimestamp = (timestamp) => {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Invalid timestamp:', timestamp);
    return 'Unknown time';
  }
};

const shortenAddress = (address) => {
  if (!address) return "Unknown";
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
};

const getLogIcon = (type) => {
  switch (type) {
    case 'loan_created':
      return <PiHandCoins className="text-green-400" />;
    case 'collateral_added':
      return <FaPlus className="text-blue-400" />;
    case 'collateral_removed':
      return <FaMinus className="text-orange-400" />;
    case 'loan_accepted':
      return <FaHandshake className="text-purple-400" />;
    case 'loan_repaid':
      return <FaCoins className="text-yellow-400" />;
    case 'liquidation':
      return <PiWarningCircleBold className="text-red-400" />;
    case 'auction_created':
      return <TbGavel className="text-violet-400" />;
    case 'auction_bid':
      return <FaGavel className="text-indigo-400" />;
    case 'loan_canceled':
      return <FaTimes className="text-red-400" />;
    default:
      return <FaHistory className="text-gray-400" />;
  }
};

const CustomFilterSelect = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'loan_created', label: 'Loan Created' },
    { value: 'loan_accepted', label: 'Loan Accepted' },
    { value: 'loan_repaid', label: 'Loan Repaid' },
    { value: 'loan_canceled', label: 'Loan Canceled' },
    { value: 'collateral_added', label: 'Collateral Added' },
    { value: 'collateral_removed', label: 'Collateral Removed' },
    { value: 'liquidation', label: 'Liquidation' },
    { value: 'auction_created', label: 'Auction Created' },
    { value: 'auction_bid', label: 'Auction Bid' }
  ]

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
    <div className="relative min-w-[180px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 bg-gray-700/30 border border-gray-600/30 rounded-xl 
        px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
      >
        <FaFilter className="text-gray-400" />
        <span>{filterOptions.find(option => option.value === value)?.label}</span>
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
        <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
          <div className="max-h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
            {filterOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-700 text-white text-left"
              >
                {option.value !== 'all' && getLogIcon(option.value)}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function StatsPage() {
  const [logs, setLogs] = useState([]);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState({
    logs: 0,
    loans: 0,
    combined: 0
  });
  const [tokenPrices, setTokenPrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPricesLoading, setIsPricesLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${backendUrl}/api/logs`);
        setLogs(response.data.logs);
        setLoans(response.data.loans);
        setStats({
          logs: response.data.total.logs,
          loans: response.data.total.loans,
          combined: response.data.total.combined
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setIsPricesLoading(true);
        const response = await fetch(`${backendUrl}/api/market-data`);
        const data = await response.json();
        
        const pricesMap = data.reduce((acc, token) => {
          if (token.assetId && token.priceUSD) {
            acc[token.assetId] = parseFloat(token.priceUSD);
          }
          return acc;
        }, {});

        setTokenPrices(pricesMap);
        console.log("Token prices loaded:", pricesMap);
      } catch (error) {
        console.error('Error fetching token prices:', error);
        setTokenPrices({});
      } finally {
        setIsPricesLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 300000);
    return () => clearInterval(interval);
  }, [backendUrl]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filter !== 'all' && log.type !== filter) {
        return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          (log.from && log.from.toLowerCase().includes(searchLower)) ||
          (log.to && log.to.toLowerCase().includes(searchLower)) ||
          log.type.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [logs, filter, searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    return filteredLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredLogs, currentPage, itemsPerPage]);

  const logTypeStats = useMemo(() => {
    const stats = {};
    logs.forEach(log => {
      stats[log.type] = (stats[log.type] || 0) + 1;
    });
    return stats;
  }, [logs]);

  const calculateTokenStats = useMemo(() => {
    const tokenStats = {};
    
    loans.filter(loan => loan.active).forEach(loan => {
      if (!tokenStats[loan.tokenRequested]) {
        tokenStats[loan.tokenRequested] = {
          requested: 0,
          collateral: 0
        };
      }
      tokenStats[loan.tokenRequested].requested += Number(loan.tokenAmount);
      
      if (!tokenStats[loan.collateralToken]) {
        tokenStats[loan.collateralToken] = {
          requested: 0,
          collateral: 0
        };
      }
      tokenStats[loan.collateralToken].collateral += Number(loan.collateralAmount);
    });
    
    return tokenStats;
  }, [loans]);

  const getUsdValue = (tokenId, amount, decimals) => {
    if (!tokenPrices[tokenId] || !amount) return 0;
    return (amount / Math.pow(10, decimals)) * tokenPrices[tokenId];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex items-center">
            <div className="p-4 rounded-full bg-green-500/20 mr-4">
              <PiHandCoins className="text-green-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Loans</h3>
              <p className="text-3xl font-bold text-white">{stats.loans}</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex items-center">
            <div className="p-4 rounded-full bg-blue-500/20 mr-4">
              <FaHistory className="text-blue-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Total Activities</h3>
              <p className="text-3xl font-bold text-white">{stats.logs}</p>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 flex items-center">
            <div className="p-4 rounded-full bg-purple-500/20 mr-4">
              <PiChartLineUp className="text-purple-400 text-2xl" />
            </div>
            <div>
              <h3 className="text-gray-400 text-sm">Active Loans</h3>
              <p className="text-3xl font-bold text-white">
                {loans.filter(loan => loan.active).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PiChartBar className="text-emerald-400" />
              Activity Distribution
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(logTypeStats).map(([type, count]) => (
                <div key={type} className="bg-gray-700/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getLogIcon(type)}
                    <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                  </div>
                  <span className="text-lg font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <PiCurrencyCircleDollar className="text-emerald-400" />
              Tokens Locked in Active Loans
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(calculateTokenStats).map(([tokenId, stats]) => {
                const token = getTokenInfo(tokenId);
                const requestedAmountInToken = stats.requested / Math.pow(10, token.decimals);
                const collateralAmountInToken = stats.collateral / Math.pow(10, token.decimals);
                const requestedAmountInUsd = getUsdValue(tokenId, stats.requested, token.decimals);
                const collateralAmountInUsd = getUsdValue(tokenId, stats.collateral, token.decimals);
                
                return (
                  <div key={tokenId} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-gray-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-gray-800/50">
                        <img 
                          src={token.logoURI} 
                          alt={token.symbol} 
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-white">{token.symbol}</h4>
                        <p className="text-xs text-gray-400">{token.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          <span className="text-gray-300">Requested</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${stats.requested > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                            {formatNumber(requestedAmountInToken)}
                          </div>
                          {requestedAmountInUsd > 0 && (
                            <div className="text-xs text-gray-400">
                              ${formatNumber(requestedAmountInUsd)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-gray-300">Collateral</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${stats.collateral > 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                            {formatNumber(collateralAmountInToken)}
                          </div>
                          {collateralAmountInUsd > 0 && (
                            <div className="text-xs text-gray-400">
                              ${formatNumber(collateralAmountInUsd)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {Object.keys(calculateTokenStats).length === 0 && (
                <div className="col-span-full text-center bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                  <PiCurrencyCircleDollar className="text-gray-400 text-4xl mx-auto mb-2" />
                  <p className="text-gray-400">No tokens locked in active loans</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 mb-8"
        >
          <div className="p-4 border-b border-gray-700/50">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <FaHistory className="text-emerald-400" />
              Activity Log
            </h3>
          </div>
          
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700/30 border border-gray-600/30 rounded-xl px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              
              <CustomFilterSelect 
                value={filter}
                onChange={(value) => setFilter(value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-emerald-800 hover:[&::-webkit-scrollbar-thumb]:bg-emerald-700">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : paginatedLogs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-700/30 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  <AnimatePresence mode="wait">
                    {paginatedLogs.map((log, index) => {
                      const requestedToken = getTokenInfo(log.tokenRequested);
                      const tokenAmount = log.tokenAmount ? 
                        Number(log.tokenAmount) / Math.pow(10, requestedToken.decimals) : 0;
                      const usdValue = getUsdValue(log.tokenRequested, log.tokenAmount, requestedToken.decimals);
                      
                      return (
                        <motion.tr 
                          key={`${currentPage}-${log._id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.3,
                            delay: index * 0.05 
                          }}
                          className="bg-gray-800/30 hover:bg-gray-700/30"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 rounded-lg bg-gray-700/50">
                                {getLogIcon(log.type)}
                              </span>
                              <span className="capitalize">{log.type.replace(/_/g, ' ')}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-lg bg-gray-700/50 text-xs font-medium">
                              {shortenAddress(log.from)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 rounded-lg bg-gray-700/50 text-xs font-medium">
                              {shortenAddress(log.to)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img 
                                src={requestedToken.logoURI} 
                                alt={requestedToken.symbol} 
                                className="w-5 h-5 rounded-full"
                              />
                              <span>{requestedToken.symbol}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              {formatNumber(tokenAmount)}
                              {usdValue > 0 && (
                                <span className="text-xs text-gray-400 ml-1">
                                  (${formatNumber(usdValue)})
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            {formatTimestamp(log.createdAt)}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No activities found matching your criteria
              </div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-700/50 flex justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg bg-gray-700/30 text-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        currentPage === pageNum
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                          : 'bg-gray-700/30 text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg bg-gray-700/30 text-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}
