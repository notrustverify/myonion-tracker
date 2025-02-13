"use client"

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { motion } from 'framer-motion';
import { PiHandCoins } from "react-icons/pi";
import { FaChartLine, FaHistory } from 'react-icons/fa';
import { useWallet } from '@alephium/web3-react';
import CreateLoanModal from '../../components/CreateLoanModal';
import axios from 'axios';
import { getTokensList, getBackendUrl, calculateLoanRepayment, getNodeProvider, getAlephiumLoanConfig } from '../../lib/configs';
import DashboardLoanCard from '../../components/dashboard/DashboardLoanCard';
import { ANS } from '@alph-name-service/ans-sdk';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loanDebts, setLoanDebts] = useState({});
  const [tokenPrices, setTokenPrices] = useState({});
  const [isPricesLoading, setIsPricesLoading] = useState(true);
  const [ansProfiles, setAnsProfiles] = useState({});
  
  const wallet = useWallet();
  const backendUrl = getBackendUrl();
  const nodeProvider = useMemo(() => getNodeProvider(), []);
  const config = getAlephiumLoanConfig();

  const tokensList = getTokensList();

  const getTokenDecimals = (tokenId) => {
    const token = tokensList.find(t => t.id === tokenId);
    return token?.decimals || 18;
  };

  const fetchTokenPrices = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/market-data`);
      const data = await response.json();
      
      const pricesMap = data.reduce((acc, token) => {
        if (token.assetId && token.priceUSD) {
          acc[token.assetId] = token.priceUSD;
        }
        return acc;
      }, {});

      setTokenPrices(pricesMap);
    } catch (error) {
      console.error('Error fetching token prices:', error);
      setTokenPrices({});
    } finally {
      setIsPricesLoading(false);
    }
  }, [backendUrl]);

  const fetchAnsProfiles = useCallback(async (addresses) => {
    try {
      const ans = new ANS('mainnet', false, config.defaultNodeUrl, config.defaultExplorerUrl);
      const profiles = {};
      
      for (const address of addresses) {
        if (address && !profiles[address]) {
          const profile = await ans.getProfile(address);
          if (profile) {
            profiles[address] = {
              name: profile.name,
              imgUri: profile.imgUri
            };
          }
        }
      }
      
      setAnsProfiles(prev => ({ ...prev, ...profiles }));
    } catch (error) {
      console.error('Error fetching ANS profiles:', error);
    }
  }, [config.defaultNodeUrl, config.defaultExplorerUrl]);

  const fetchUserLoans = useCallback(async () => {
    if (!wallet?.account?.address) return;
    
    setLoading(true);
    try {
      const [createdResponse, borrowedResponse] = await Promise.all([
        axios.get(`${backendUrl}/api/loans/creator/${wallet.account.address}`),
        axios.get(`${backendUrl}/api/loans/loanee/${wallet.account.address}`)
      ]);

      const createdData = createdResponse.data;
      const borrowedData = borrowedResponse.data;
      
      const debts = {};
      if(createdResponse.data.length > 0) {
        for (const loan of createdResponse.data) {
          if (loan.active) {
            try {
              const { totalRepayment } = calculateLoanRepayment(
                Number(loan.tokenAmount),
                Number(loan.interest),
                new Date(loan.createdAt)
              );
              debts[loan.id] = totalRepayment;
            } catch (error) {
              console.error('Error calculating loan debt:', error);
            }
          }
        }
        setLoanDebts(debts);
      }

      const transformLoan = loan => ({
        value: loan.tokenAmount,
        currency: loan.tokenRequested,
        collateralAmount: loan.collateralAmount,
        collateralCurrency: loan.collateralToken,
        term: parseFloat(loan.duration),
        duration: loan.duration,
        interest: Number(loan.interest),
        lender: loan.creator,
        borrower: loan.loanee,
        status: loan.active ? 'active' : 'pending',
        id: loan.id,
        type: loan.creator === wallet.account.address ? 'created' : 'borrowed',
        liquidation: loan.liquidation,
        canLiquidate: loan.canLiquidate,
        createdAt: loan.createdAt,
        currentDebt: debts[loan.id] || loan.tokenAmount
      });

      const allLoans = [
        ...createdData.map(loan => transformLoan(loan)),
        ...borrowedData.map(loan => transformLoan(loan))
      ];

      const addresses = new Set();
      allLoans.forEach(loan => {
        if (loan.lender) addresses.add(loan.lender);
        if (loan.borrower) addresses.add(loan.borrower);
      });

      fetchAnsProfiles(Array.from(addresses));

      setLoans(allLoans);
    } catch (error) {
      console.error('Error fetching user loans:', error);
    } finally {
      setLoading(false);
    }
  }, [wallet?.account?.address, nodeProvider, backendUrl, fetchAnsProfiles]);

  useEffect(() => {
    fetchTokenPrices();
    const pricesInterval = setInterval(fetchTokenPrices, 60000);
    
    return () => clearInterval(pricesInterval);
  }, [fetchTokenPrices]);

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  const stats = [
    {
      title: "Total Value Borrowed",
      value: `$${loans.reduce((acc, loan) => {
        if (loan.type === 'created') {
          const tokenDecimals = getTokenDecimals(loan.currency);
          const tokenAmount = Number(loan.value) / Math.pow(10, tokenDecimals);
          const tokenPrice = tokenPrices[loan.currency] || 0;
          return acc + (tokenAmount * tokenPrice);
        }
        return acc;
      }, 0).toLocaleString()}`,
      isPositive: true,
      icon: <PiHandCoins className="w-6 h-6" />
    },
    {
      title: "Total Debt",
      value: `$${loans.reduce((acc, loan) => {
        if (loan.type === 'borrowed' && loan.status === 'active' && loanDebts[loan.id]) {
          const tokenDecimals = getTokenDecimals(loan.currency);
          const debtAmount = Number(loanDebts[loan.id]) / Math.pow(10, tokenDecimals);
          const tokenPrice = tokenPrices[loan.currency] || 0;
          return acc + (debtAmount * tokenPrice);
        }
        return acc;
      }, 0).toLocaleString()}`,
      isPositive: true,
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      title: "Collateral Locked",
      value: `$${loans.reduce((acc, loan) => {
        const collateralDecimals = getTokenDecimals(loan.collateralCurrency);
        const collateralAmount = Number(loan.collateralAmount) / Math.pow(10, collateralDecimals);
        const collateralPrice = tokenPrices[loan.collateralCurrency] || 0;
        return acc + (collateralAmount * collateralPrice);
      }, 0).toLocaleString()}`,
      isPositive: true,
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      title: "Active Loans",
      value: loans.filter(loan => loan.status === 'active').length.toString(),
      isPositive: true,
      icon: <FaHistory className="w-6 h-6" />
    }
  ];

  const filteredLoans = useMemo(() => {
    return loans.filter(loan => {
      const statusMatch = activeTab === 'all' ? true : loan.status === activeTab;
      const typeMatch = loanTypeFilter === 'all' 
        ? true 
        : loanTypeFilter === 'created' 
          ? loan.type === 'created'
          : loan.type === 'borrowed';
      return statusMatch && typeMatch;
    });
  }, [loans, activeTab, loanTypeFilter]);

  if (!wallet?.account?.address) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Please connect your wallet to view your dashboard</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12"
      >
        <div className="mb-12 flex justify-between items-center">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Manage your loans and monitor your positions
            </motion.p>
          </div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-400/10 
              hover:from-green-500/20 hover:via-green-500/30 hover:to-green-400/20 
              border border-green-500/20 hover:border-green-500/30 
              transition-all duration-300 ease-out
              text-green-400 hover:text-green-300
              flex items-center gap-2"
          >
            <PiHandCoins className="w-5 h-5" />
            Create Loan
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-gray-700/50">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex space-x-4">
                {['all', 'active', 'pending'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${activeTab === tab 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4">
                {['all', 'created', 'borrowed'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setLoanTypeFilter(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${loanTypeFilter === type 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' 
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {type === 'all' ? 'All Loans' : 
                     type === 'created' ? 'Created' : 'Borrowed'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : filteredLoans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoans.map((loan) => (
                  <DashboardLoanCard 
                    key={loan.id} 
                    {...loan} 
                    tokenPrices={tokenPrices}
                    isPricesLoading={isPricesLoading}
                    ansProfile={{
                      lender: ansProfiles[loan.lender],
                      borrower: ansProfiles[loan.borrower]
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No loans found</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-400/10 
                    hover:from-green-500/20 hover:via-green-500/30 hover:to-green-400/20 
                    border border-green-500/20 hover:border-green-500/30 
                    transition-all duration-300 ease-out
                    text-green-400 hover:text-green-300"
                >
                  <PiHandCoins className="w-5 h-5" />
                  Create a Loan
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.main>

      <Footer />
      
      <CreateLoanModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        tokenPrices={tokenPrices}
        isPricesLoading={isPricesLoading}
      />
    </div>
  );
}
