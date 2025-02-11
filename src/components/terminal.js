import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getBackendUrl, getTokensList } from '../lib/configs';

const formatNumber = (value) => {
  if (!value || isNaN(value)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value)
}

const Terminal = () => {
  const [stats, setStats] = useState(null);
  const backendUrl = getBackendUrl();
  const tokensList = getTokensList();

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const prices = {};
        for (const token of tokensList) {
          const response = await fetch(`${backendUrl}/api/market-data?assetId=${token.id}`);
          const data = await response.json();
          prices[token.id] = data.priceUSD;
        }
        return prices;
      } catch (error) {
        console.error('Error fetching token prices:', error);
        return {};
      }
    };

    const fetchStats = async (prices) => {
      try {
        const response = await fetch(`${backendUrl}/api/loans`);
        const data = await response.json();
        
        const activeLoans = data.loans.filter(loan => loan.active);
        const totalLoans = data.loans.length;
        
        const avgApr = activeLoans.length > 0
          ? activeLoans.reduce((sum, loan) => sum + Number(loan.interest), 0) / activeLoans.length
          : 0;

        let totalCollateralRatio = 0;
        let tvlUSD = 0;

        activeLoans.forEach(loan => {
          const tokenInfo = tokensList.find(t => t.id === loan.tokenRequested);
          const collateralInfo = tokensList.find(t => t.id === loan.collateralToken);
          
          if (tokenInfo && collateralInfo && prices[loan.tokenRequested] && prices[loan.collateralToken]) {
            const collateralValueUSD = (loan.collateralAmount / Math.pow(10, collateralInfo.decimals)) * prices[loan.collateralToken];
            const loanValueUSD = (loan.tokenAmount / Math.pow(10, tokenInfo.decimals)) * prices[loan.tokenRequested];
            
            if (loanValueUSD > 0) {
              totalCollateralRatio += (collateralValueUSD / loanValueUSD) * 100;
            }
            tvlUSD += collateralValueUSD;
          }
        });

        const avgCollateralRatio = activeLoans.length > 0 ? totalCollateralRatio / activeLoans.length : 0;

        setStats({
          activeLoans: activeLoans.length,
          totalLoans,
          avgApr,
          avgCollateralRatio,
          tvlUSD
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    const initializeData = async () => {
      const prices = await fetchTokenPrices();
      await fetchStats(prices);
    };
    initializeData();
  }, [backendUrl, tokensList]);

  const lines = [
    { command: "$ npm run stats", delay: 0 },
    { text: "Initializing AlpacaFi protocol...", delay: 0.5, color: "text-gray-500" },
    { text: `Total Value Locked: $${formatNumber(stats?.tvlUSD)}`, delay: 1, color: "text-white" },
    { text: `Total Loans: ${stats?.totalLoans || '...'}`, delay: 1.5, color: "text-white" },
    { text: `Active Loans: ${stats?.activeLoans || '...'}`, delay: 2, color: "text-white" },
    { text: `Average Interest: ${stats?.avgApr ? formatNumber(stats.avgApr) : '...'}%`, delay: 2.5, color: "text-white" },
    { text: `Average Collateral: ${stats?.avgCollateralRatio ? formatNumber(stats.avgCollateralRatio) : '...'}%`, delay: 3, color: "text-white" },
    { command: "$", delay: 3.5, className: "animate-pulse" }
  ];

  return (
    <div className="bg-gray-900/80 text-white p-4 rounded-xl border border-gray-700/50 font-mono text-sm h-full">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <p className="text-xs text-gray-500">alpacafi-terminal</p>
      </div>
      
      <div className="space-y-2">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: line.delay,
              duration: 0.2
            }}
            className={`font-mono ${line.color || "text-green-400"} ${line.className || ""}`}
          >
            {line.command ? (
              <span>{line.command}</span>
            ) : (
              <span className="pl-4">{line.text}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;