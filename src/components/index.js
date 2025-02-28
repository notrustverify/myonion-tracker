"use client"

import Link from "next/link"
import React from "react"
import Terminal from "./terminal"
import { motion } from "framer-motion"
import { FaGamepad } from 'react-icons/fa'
import { PiHandCoins } from "react-icons/pi";
import { LayoutDashboard } from "lucide-react"


export function Hero() {
  const features = [
    {
      title: "Loan",
      description: "Get instant loans by providing token collateral.",
      icon: <PiHandCoins className="h-8 w-8 text-white" />,
      href: "/loan",
      color: "from-violet-500/20 to-purple-500/20",
      hoverColor: "hover:from-violet-500/30 hover:to-purple-500/30",
      buttonColor: "bg-gradient-to-r from-violet-400 to-purple-500 text-gray-900 hover:shadow-lg hover:shadow-violet-400/20"
    },
    {
      title: "Dashboard",
      description: "View and manage your loan positions.",
      icon: <LayoutDashboard className="h-8 w-8 text-white" />,
      href: "/dashboard",
      color: "from-emerald-500/20 to-green-500/20",
      hoverColor: "hover:from-emerald-500/30 hover:to-green-500/30",
      buttonColor: "bg-gradient-to-r from-emerald-400 to-green-500 text-gray-900 hover:shadow-lg hover:shadow-emerald-400/20"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 pb-32"
      >
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
            >
              Welcome to AlpacaFi
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-gray-300"
            >
              A decentralized lending protocol built and developed on Alephium.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <Link
                href="https://alphpacas.gitbook.io/alphpacas/alpacafi/what-is-alpacafi"
                className="px-8 py-3 rounded-xl font-semibold bg-gray-700/50 hover:bg-gray-700 text-white border border-gray-700/50 hover:border-violet-400/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Documentation
              </Link>
            </motion.div>
          </motion.div>
        </section>

        <section className="py-12">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Get Started with AlpacaFi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br ${feature.color} 
                  backdrop-blur-xl border border-gray-700/50 transition-all duration-300 
                  ${feature.hoverColor} hover:shadow-2xl hover:-translate-y-1`}
              >
                <div className="p-8">
                  <div className="flex justify-center items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center mb-6">
                    {feature.description}
                  </p>
                  <div className="flex justify-center">
                    <Link
                      href={feature.href}
                      className={`px-8 py-3 rounded-xl font-semibold 
                        ${feature.buttonColor} transition-all duration-300
                        transform hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      {feature.title === "On-Chain Gaming" || feature.title === "AlpacaFi" 
                        ? "Coming Soon!" 
                        : "Get Started"}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm mb-8">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              A little about AlpacaFi Loans ...
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="col-span-1"
              >
                <div className="bg-gray-900/50 rounded-xl p-6 h-full border border-gray-700/50">
                  <Terminal key="static-terminal" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="col-span-1 md:col-span-2"
              >
                <div className="bg-gray-900/50 rounded-xl p-6 h-full border border-gray-700/50">
                  <h3 className="text-2xl font-bold mb-4 text-green-400">What is AlpacaFi Loans?</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    AlpacaFi Loans is a decentralized peer-to-peer lending protocol built on Alephium. 
                    Create loan requests by specifying your desired token amount and providing other tokens as collateral.
                  </p>
                  
                  <h4 className="text-xl font-semibold text-green-400 mt-6 mb-3">How it Works</h4>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">1.</span>
                      Create a loan request by specifying the token amount you need and the tokens you'll provide as collateral.
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">2.</span>
                      Other users can review and fund your loan request. Once funded, you'll receive your tokens instantly.
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">3.</span>
                      Maintain a collateral ratio above 150% to keep your position healthy.
                    </li>
                  </ul>

                  <h4 className="text-xl font-semibold text-green-400 mt-6 mb-3">Liquidation Process</h4>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      If your collateral ratio falls below 150%, your position becomes eligible for liquidation.
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Liquidators can trigger the liquidation process through the liquidation page.
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-2">•</span>
                      Once liquidated, your collateral enters a 3-hour auction where users can bid to acquire it.
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  )
}