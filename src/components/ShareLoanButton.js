'use client'

import { useState, useRef, useEffect } from 'react'
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'

const ShareLoanButton = ({ 
  loanId, 
  loanData, 
  requestedTokenInfo, 
  collateralTokenInfo, 
  displayLoanAmount, 
  displayCollateralAmount, 
  loanValueUSD, 
  collateralValueUSD, 
  collateralRatio, 
  riskLevel, 
  formatDuration, 
  shortenAddress,
  ansProfile
}) => {
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareImage, setShareImage] = useState(null)
  const [generatingImage, setGeneratingImage] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareCardRef = useRef(null)

  const generateShareImage = async () => {
    if (!shareCardRef.current) return
    
    setGeneratingImage(true)
    try {
      const images = shareCardRef.current.querySelectorAll('img');
      await Promise.all([...images].map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
      
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#111827',
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setShareImage(imageUrl);
    } catch (err) {
      console.error('Error generating share image:', err);
    } finally {
      setGeneratingImage(false);
    }
  }
  
  const copyLinkToClipboard = () => {
    const shareUrl = `https://alpacafi.app/loan/${loanId}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
      })
  }
  
  useEffect(() => {
    if (showShareModal && !shareImage) {
      generateShareImage()
    }
  }, [showShareModal, shareImage])

  return (
    <>
      <button 
        onClick={() => setShowShareModal(true)}
        className="p-3 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:bg-blue-500/30 transition-colors"
        title="Share loan"
      >
        <FiShare2 className="w-5 h-5" />
      </button>

      <AnimatePresence mode="wait">
        {showShareModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center overflow-y-auto" onClick={(e) => {
            if (e.target === e.currentTarget) setShowShareModal(false);
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2 }}
              className="relative my-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50"
            >
              <div className="border-b border-gray-700/50 p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-white">Share Loan</h3>
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30 p-2"
                  >
                    <IoMdClose className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Share Link
                  </label>
                  <div className="flex">
                    <input 
                      type="text" 
                      readOnly 
                      value={`https://alpacafi.app/loan/${loanId}`}
                      className="flex-1 bg-gray-900/50 border border-gray-700 rounded-l-xl px-4 py-3 text-white text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                    />
                    <button
                      onClick={copyLinkToClipboard}
                      className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-500/90 hover:to-blue-600/90
                      text-white px-4 py-3 rounded-r-xl flex items-center justify-center transition-colors
                      border border-blue-500/50 hover:border-blue-500/70"
                    >
                      {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-gray-700/50 pt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-4">Share Image</h4>
                  
                  {generatingImage ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-3">
                      <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                      <p className="text-gray-400 text-sm">Generating shareable image...</p>
                    </div>
                  ) : shareImage ? (
                    <div className="space-y-4">
                      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700/70">
                        <img src={shareImage} alt="Shareable loan card" className="w-full" />
                      </div>
                      
                      <button 
                        onClick={() => {
                          const link = document.createElement('a')
                          link.href = shareImage
                          link.download = 'alpacafi-loan.png'
                          link.click()
                        }}
                        className="w-full group px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 via-blue-500/30 to-blue-400/20 
                        hover:from-blue-500/30 hover:via-blue-500/40 hover:to-blue-400/30
                        border border-blue-500/20 hover:border-blue-500/30 
                        transition-all duration-300 ease-out
                        text-blue-400 hover:text-blue-300 font-medium 
                        shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30
                        flex items-center justify-center gap-2"
                      >
                        <span>Download Image</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" 
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="p-3 rounded-full bg-red-500/10 text-red-400">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-center">Failed to generate image</p>
                      <button 
                        onClick={generateShareImage}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-400/20 
                        hover:from-blue-500/30 hover:to-blue-400/30
                        border border-blue-500/20 hover:border-blue-500/30 
                        text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="fixed left-[-9999px] top-[-9999px]">
        <div 
          ref={shareCardRef} 
          className="w-[1200px] h-[900px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Alpacafi.app</h2>
              <p className="text-gray-400">ID: {loanId.substring(0, 16)}...</p>
            </div>
            {loanData.active ? (
              <div className="bg-green-500/20 border border-green-500/20 rounded-full px-4 py-4 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-green-400"></div>
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/20 rounded-full px-4 py-4 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            {loanData.borrower && loanData.borrower !== 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq' && (
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="text-lg text-gray-400 block mb-4">Borrower</span>
                <div className="flex items-center gap-4">
                  {ansProfile?.borrower?.imgUri ? (
                    <img 
                      src={ansProfile.borrower.imgUri} 
                      className="w-16 h-16 rounded-full border-2 border-gray-700/50 shadow-lg" 
                      alt=""
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-2xl text-white">
                      {ansProfile?.borrower?.name || shortenAddress(loanData.borrower)}
                    </span>
                    {ansProfile?.borrower?.name && (
                      <span className="text-base text-gray-400 block">
                        {shortenAddress(loanData.borrower)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {loanData.lender && loanData.lender !== 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq' && (
              <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <span className="text-lg text-gray-400 block mb-4">Lender</span>
                <div className="flex items-center gap-4">
                  {ansProfile?.lender?.imgUri ? (
                    <img 
                      src={ansProfile.lender.imgUri} 
                      className="w-16 h-16 rounded-full border-2 border-gray-700/50 shadow-lg" 
                      alt=""
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-2xl text-white">
                      {ansProfile?.lender?.name || shortenAddress(loanData.lender)}
                    </span>
                    {ansProfile?.lender?.name && (
                      <span className="text-base text-gray-400 block">
                        {shortenAddress(loanData.lender)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-lg text-gray-400 block mb-4">Loan Amount</span>
              <div className="flex items-center gap-4">
                <img 
                  src={requestedTokenInfo.logoURI}
                  alt={requestedTokenInfo.symbol}
                  className="w-16 h-16 rounded-full"
                  crossOrigin="anonymous"
                />
                <div>
                  <span className="font-medium text-3xl text-white">{displayLoanAmount}</span>
                  <span className="text-gray-400 ml-2 text-xl">{requestedTokenInfo.symbol}</span>
                  <span className="text-lg text-gray-500 block">(${loanValueUSD})</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-lg text-gray-400 block mb-4">Collateral</span>
              <div className="flex items-center gap-4">
                <img 
                  src={collateralTokenInfo.logoURI}
                  alt={collateralTokenInfo.symbol}
                  className="w-16 h-16 rounded-full"
                  crossOrigin="anonymous"
                />
                <div>
                  <span className="font-medium text-3xl text-white">{displayCollateralAmount}</span>
                  <span className="text-gray-400 ml-2 text-xl">{collateralTokenInfo.symbol}</span>
                  <span className="text-lg text-gray-500 block">(${collateralValueUSD})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl text-gray-400">Collateral Ratio</span>
              <span className={`text-3xl font-medium ${
                riskLevel === 'conservative' ? 'text-green-500' :
                riskLevel === 'moderate' ? 'text-yellow-500' :
                riskLevel === 'aggressive' ? 'text-orange-500' :
                riskLevel === 'high' ? 'text-red-500' :
                'text-red-600'
              }`}>
                {collateralRatio.toFixed(2)}%
              </span>
            </div>
            
            <div className="relative mb-2">
              <div className="absolute inset-0 flex">
                <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                <div className="w-[34%] h-full"></div>
              </div>

              <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${(() => {
                      const ratio = parseFloat(collateralRatio);
                      if (ratio <= 150) return 0;
                      if (ratio <= 200) return ((ratio - 150) / 50) * 33;
                      if (ratio <= 300) return 33 + ((ratio - 200) / 100) * 33;
                      if (ratio <= 400) return 66 + ((ratio - 300) / 100) * 34;
                      return 100;
                    })()}%`
                  }}
                  className={`h-full transition-all duration-300 ${
                    riskLevel === 'conservative' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    riskLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    riskLevel === 'aggressive' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                    riskLevel === 'high' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                    'bg-gradient-to-r from-red-700 to-red-600'
                  }`}
                />
              </div>

              <div className="flex justify-between text-base mt-2 px-1">
                <span className="text-red-500">150%</span>
                <span className="text-orange-500">200%</span>
                <span className="text-yellow-500">300%</span>
                <span className="text-green-500">400%+</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-lg text-gray-400 block mb-3">Interest Rate</span>
              <span className="font-medium text-3xl text-green-400">{(loanData.interest / 100).toFixed(2)}%</span>
            </div>
            
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-lg text-gray-400 block mb-3">{loanData.active ? "End Date" : "Duration"}</span>
              <span className="font-medium text-3xl text-white">
                {loanData.active 
                  ? new Date(loanData.endDate).toLocaleDateString() 
                  : formatDuration(parseInt(loanData.duration))}
              </span>
            </div>
            
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <span className="text-lg text-gray-400 block mb-3">Created</span>
              <span className="font-medium text-3xl text-white">{new Date(loanData.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShareLoanButton 