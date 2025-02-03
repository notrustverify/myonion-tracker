"use client"

import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[70vh] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-9xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-8"
        >
          404
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg mb-8 max-w-md"
        >
          Oops! The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/"
            className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-400/10 
              hover:from-green-500/20 hover:via-green-500/30 hover:to-green-400/20 
              border border-green-500/20 hover:border-green-500/30 
              transition-all duration-300 ease-out
              text-green-400 hover:text-green-300 font-medium 
              shadow-lg shadow-green-900/20 hover:shadow-green-900/30
              flex items-center gap-3"
          >
            <span>Return Home</span>
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
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </Link>
        </motion.div>
      </motion.main>

      <Footer />
    </div>
  );
}