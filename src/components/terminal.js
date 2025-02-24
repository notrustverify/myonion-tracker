import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { getBackendUrl, getTokensList, getDefaultNodeUrl } from '../lib/configs';

const formatNumber = (value) => {
  if (!value || isNaN(value)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value)
}

const Terminal = () => {
  const [stats, setStats] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [hashrate, setHashrate] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const terminalRef = useRef(null);
  
  // Mémoriser les valeurs qui ne devraient pas changer
  const backendUrl = useMemo(() => getBackendUrl(), []);
  const tokensList = useMemo(() => getTokensList(), []);
  const nodeUrl = useMemo(() => getDefaultNodeUrl(), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1
      }
    );

    if (terminalRef.current) {
      observer.observe(terminalRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Fetch node info
    fetch(`${nodeUrl}/blockflow/chain-info/?fromGroup=0&toGroup=0`)
      .then(res => res.json())
      .then(data => setBlockHeight(data.currentHeight))
      .catch(error => console.error('Error fetching block height:', error));

    fetch(`${nodeUrl}/infos/current-hashrate`)
      .then(res => res.json())
      .then(data => setHashrate(data.hashrate))
      .catch(error => console.error('Error fetching hashrate:', error));

    // Fetch loans stats
    fetch(`${backendUrl}/api/loans`)
      .then(res => res.json())
      .then(data => {
        const activeLoans = data.loans.filter(loan => loan.active);
        const totalLoans = data.loans.length;
        
        const avgApr = activeLoans.length > 0
          ? activeLoans.reduce((sum, loan) => sum + (Number(loan.interest) / 10000), 0) / activeLoans.length * 100
          : 0;

        let totalCollateralRatio = 0;
        let tvlUSD = 0;

        // Fetch token prices and update stats progressively
        tokensList.forEach(token => {
          fetch(`${backendUrl}/api/market-data?assetId=${token.id}`)
            .then(res => res.json())
            .then(priceData => {
              activeLoans.forEach(loan => {
                if (loan.tokenRequested === token.id || loan.collateralToken === token.id) {
                  const tokenInfo = tokensList.find(t => t.id === loan.tokenRequested);
                  const collateralInfo = tokensList.find(t => t.id === loan.collateralToken);
                  
                  if (tokenInfo && collateralInfo && priceData.priceUSD) {
                    const collateralValueUSD = (loan.collateralAmount / Math.pow(10, collateralInfo.decimals)) * priceData.priceUSD;
                    const loanValueUSD = (loan.tokenAmount / Math.pow(10, tokenInfo.decimals)) * priceData.priceUSD;
                    
                    if (loanValueUSD > 0) {
                      totalCollateralRatio += (collateralValueUSD / loanValueUSD) * 100;
                    }
                    tvlUSD += collateralValueUSD;

                    setStats({
                      activeLoans: activeLoans.length,
                      totalLoans,
                      avgApr,
                      avgCollateralRatio: activeLoans.length > 0 ? totalCollateralRatio / activeLoans.length : 0,
                      tvlUSD
                    });
                  }
                }
              });
            })
            .catch(error => console.error('Error fetching token price:', error));
        });
      })
      .catch(error => console.error('Error fetching loans:', error));

  }, [isVisible]); // Seule dépendance nécessaire

  const formattedBlockHeight = blockHeight ? new Intl.NumberFormat('fr-FR').format(blockHeight) : '...';
  const formattedHashrate = hashrate ? `${(parseFloat(hashrate) / 1_000_000_000).toFixed(2)} PH/s` : '...';

  const lines = [
    { command: "$ npm run stats", delay: 0 },
    { text: "Initializing AlpacaFi protocol...", delay: 0.2, color: "text-gray-500" },
    { text: `Total Value Locked: $${formatNumber(stats?.tvlUSD)}`, delay: 0.4, color: "text-white" },
    { text: `Active/Total Loans: ${stats?.activeLoans || '...'}/${stats?.totalLoans || '...'}`, delay: 0.6, color: "text-white" },
    { text: `Average APR: ${stats?.avgApr ? formatNumber(stats.avgApr) : '...'}%`, delay: 0.8, color: "text-white" },
    { text: `Average Collateral Ratio: ${stats?.avgCollateralRatio ? formatNumber(stats.avgCollateralRatio) : '...'}%`, delay: 1, color: "text-white" },
    { command: "$ npm run network-info", delay: 1.2 },
    { text: `Block Height: #${formattedBlockHeight}`, delay: 1.4, color: "text-white" },
    { text: `Network Hashrate: ${formattedHashrate}`, delay: 1.6, color: "text-white" },
    { command: "$ npm run health-check", delay: 1.8 },
    { text: "System Status: Operational ✓", delay: 2.0, color: "text-green-400" },
    { text: "Network: Mainnet", delay: 2.2, color: "text-white" },
    { command: "$", delay: 2.4, className: "animate-pulse" }
  ];

  return (
    <div ref={terminalRef} className="bg-gray-900/80 text-white p-4 rounded-xl border border-gray-700/50 font-mono text-sm">
      <div className="flex justify-between items-center mb-2 border-b border-gray-700/50 pb-2">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <p className="text-xs text-gray-500">alpacafi-terminal</p>
      </div>
      
      <div className="space-y-1">
        {lines.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: line.delay,
              duration: 0.2
            }}
            className={`font-mono ${line.color || "text-green-400"} ${line.className || ""} text-xs`}
          >
            {line.command ? (
              <span>{line.command}</span>
            ) : (
              <span className="pl-3">{line.text}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;