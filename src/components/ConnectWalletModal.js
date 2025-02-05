"use client";
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDownload, FaDesktop, FaQrcode, FaChevronDown } from 'react-icons/fa';
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { useConnect, useConnectSettingContext } from '@alephium/web3-react';

export default function ConnectWalletModal({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const [connectClicked, setConnectClicked] = useState(false);
    const [isWalletInfoOpen, setIsWalletInfoOpen] = useState(false);
    const context = useConnectSettingContext();
    const { connect } = useConnect();

    const onConnect = useCallback((id) => {
        setIsLoading(true);
        context.setConnectorId(id);
        setConnectClicked(true);
    }, [context]);

    useEffect(() => {
        if (connectClicked && isOpen) {
            setConnectClicked(false);
            connect().then(() => {
                onClose();
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [connectClicked, isOpen, connect, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div 
                className="relative w-full max-w-md"
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
            >
                <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                    <div className="p-6 border-b border-gray-700/50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Connect Wallet</h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent"></div>
                                <p className="mt-4 text-lg font-medium text-white">Connecting...</p>
                                <p className="mt-2 text-sm text-gray-400">Check your wallet for connection request</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-3">New to Alephium?</h3>
                                    <a 
                                        href="https://alephium.org/#wallets" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-400/10 text-green-400">
                                                <FaDownload size={20} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">Get a Wallet</p>
                                                <p className="text-sm text-gray-400">Download and setup your first wallet</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-400 mb-3">Connect with</h3>
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => onConnect('injected')}
                                            className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl flex items-center justify-between border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-400/10 text-green-400">
                                                    <IoExtensionPuzzleOutline size={20} />
                                                </div>
                                                <span className="font-medium text-white">Browser Extension</span>
                                            </div>
                                            <span className="text-sm text-green-400">Popular</span>
                                        </button>

                                        <button 
                                            onClick={() => onConnect('desktopWallet')}
                                            className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl flex items-center justify-between border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-400/10 text-green-400">
                                                    <FaDesktop size={20} />
                                                </div>
                                                <span className="font-medium text-white">Desktop Wallet</span>
                                            </div>
                                        </button>

                                        <button 
                                            onClick={() => onConnect('walletConnect')}
                                            className="w-full p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl flex items-center justify-between border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-400/10 text-green-400">
                                                    <FaQrcode size={20} />
                                                </div>
                                                <span className="font-medium text-white">WalletConnect</span>
                                            </div>
                                            <span className="text-sm text-green-400">Mobile</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        onClick={() => setIsWalletInfoOpen(!isWalletInfoOpen)}
                                        className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        <span>What is a wallet?</span>
                                        <FaChevronDown className={`transform transition-transform duration-200 ${isWalletInfoOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isWalletInfoOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                                    <p className="text-green-400 font-medium mb-2">A Home for your Digital Assets</p>
                                                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                                                        A wallet is your gateway to Web3. It allows you to send, receive, and store digital assets like ALPH and NFTs. Think of it as your blockchain identity and digital wallet combined.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <a href="https://alephium.org/#wallets" 
                                                           target="_blank" 
                                                           rel="noopener noreferrer"
                                                           className="py-2 px-4 bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
                                                             hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30 
                                                             rounded-full font-medium text-green-400 hover:text-green-300 
                                                             transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                                                        >
                                                            Get a Wallet
                                                        </a>
                                                        <a href="https://docs.alephium.org/wallet" 
                                                           target="_blank" 
                                                           rel="noopener noreferrer"
                                                           className="py-2 px-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-full font-medium transition-colors"
                                                        >
                                                            Learn More
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
} 