"use client"

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/footer';
import { motion } from 'framer-motion';
import { PiHandCoins } from "react-icons/pi";
import { FaChartLine, FaHistory } from 'react-icons/fa';
import LoanCard from '../../components/LoanCard';
import { useWallet, useBalance } from '@alephium/web3-react';
import CreateLoanModal from '../../components/CreateLoanModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('active');
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const wallet = useWallet();
  const { balance } = useBalance();

  const fetchUserLoans = useCallback(async () => {
    if (!wallet?.account?.address) return;
    
    setLoading(true);
    try {
      // Récupérer à la fois les prêts créés et empruntés
      const [createdResponse, borrowedResponse] = await Promise.all([
        fetch(`https://backend.alpacafi.app/api/loans/creator/${wallet.account.address}${activeTab !== 'all' ? `?type=${activeTab}` : ''}`),
        fetch(`https://backend.alpacafi.app/api/loans/loanee/${wallet.account.address}${activeTab !== 'all' ? `?type=${activeTab}` : ''}`)
      ]);

      const [createdData, borrowedData] = await Promise.all([
        createdResponse.json(),
        borrowedResponse.json()
      ]);
      
      const transformLoan = loan => ({
        value: Number(loan.tokenAmount),
        currency: loan.tokenRequested,
        collateralAmount: Number(loan.collateralAmount),
        collateralCurrency: loan.collateralToken,
        term: Number(loan.duration) / (30 * 24 * 60 * 60 * 1000),
        interest: Number(loan.interest),
        lender: loan.creator,
        borrower: loan.loanee,
        status: loan.active ? 'active' : 'pending',
        id: loan.id,
        type: loan.creator === wallet.account.address ? 'created' : 'borrowed'
      });

      const allLoans = [
        ...createdData.loans.map(loan => transformLoan({ ...loan, type: 'created' })),
        ...borrowedData.loans.map(loan => transformLoan({ ...loan, type: 'borrowed' }))
      ];

      setLoans(allLoans);
    } catch (error) {
      console.error('Error fetching user loans:', error);
    } finally {
      setLoading(false);
    }
  }, [wallet?.account?.address, activeTab]);

  useEffect(() => {
    fetchUserLoans();
  }, [fetchUserLoans]);

  // Calculer les statistiques basées sur les prêts de l'utilisateur
  const stats = [
    {
      title: "Total Value",
      value: `${loans.reduce((acc, loan) => acc + loan.value, 0).toLocaleString()} ALPH`,
      change: "+12.5%",
      isPositive: true,
      icon: <PiHandCoins className="w-6 h-6" />
    },
    {
      title: "Collateral Locked",
      value: `${loans.reduce((acc, loan) => acc + loan.collateralAmount, 0).toLocaleString()} ALPH`,
      change: "+8.2%",
      isPositive: true,
      icon: <FaChartLine className="w-6 h-6" />
    },
    {
      title: "Active Loans",
      value: loans.filter(loan => loan.status === 'active').length.toString(),
      change: `${loans.filter(loan => loan.status === 'pending').length} pending`,
      isPositive: true,
      icon: <FaHistory className="w-6 h-6" />
    }
  ];

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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
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
                <span className={`text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
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
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex space-x-4">
              {['active', 'pending', 'completed'].map((tab) => (
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
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : loans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.map((loan) => (
                  <LoanCard key={loan.id} {...loan} />
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
      />
    </div>
  );
}
