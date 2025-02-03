import React from "react";
import { motion } from "framer-motion";

const Terminal = () => {
  const lines = [
    { command: "$ npm run stats", delay: 0 },
    { text: "Initializing AlpacaFi protocol...", delay: 0.5, color: "text-gray-500" },
    { text: "Total Value Locked: 100K ALPH", delay: 1, color: "text-white" },
    { text: "Active Loans: 50", delay: 1.5, color: "text-white" },
    { text: "Average APR: 5.2%", delay: 2, color: "text-white" },
    { text: "Collateral Ratio: 150%", delay: 2.5, color: "text-white" },
    { command: "$", delay: 3, className: "animate-pulse" }
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