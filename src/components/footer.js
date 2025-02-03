import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa';

const LegalModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = type === 'privacy' ? {
    title: 'Privacy Policy',
    text: `Last updated: ${new Date().toLocaleDateString()}

1. Information We Collect
We collect information you provide directly to us when using AlpacaFi, including wallet addresses and transaction data.

2. How We Use Your Information
- To provide, maintain, and improve our services
- To process your transactions
- To send you technical notices and support messages
- To detect and prevent fraud

3. Data Security
We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.

4. Blockchain Data
Please note that blockchain transactions are public by nature. Your transaction history will be publicly visible on the Alephium blockchain.

5. Changes to This Policy
We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.`
  } : {
    title: 'Terms of Service',
    text: `Last updated: ${new Date().toLocaleDateString()}

1. Acceptance of Terms
By accessing and using Alpacafi, you agree to be bound by these Terms of Service.

2. Description of Service
Alpacafi provides decentralized finance services on the Alephium blockchain, including but not limited to token creation and management.

3. User Responsibilities
- You are responsible for maintaining the security of your wallet
- You agree to provide accurate information
- You will not use the service for any illegal purposes

4. Risks
- Cryptocurrency trading carries inherent risks
- Smart contract risks exist
- Market volatility can affect asset values

5. Limitation of Liability
Alpacafi is not responsible for any losses incurred while using our services.

6. Modifications to Service
We reserve the right to modify or discontinue the service at any time.`
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700/50"
        >
          <div className="border-b border-gray-700/50 p-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">{content.title}</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
              {content.text}
            </pre>
          </div>

          <div className="border-t border-gray-700/50 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 
                text-white transition-all duration-300 flex items-center justify-center
                border border-gray-600/30 hover:border-gray-500/30"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Loan', path: '/loan' },
  ];

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  return (
    <>
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-gray-900 to-black border-t border-gray-800/50"
      >
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 mb-4"
              >
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  AlpacaFi
                </Link>
              </motion.div>
              <p className="text-gray-400 mb-6">
                Empowering DeFi on Alephium with innovative lending solutions and seamless token management.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((item, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                  >
                    <Link href={item.path}>{item.name}</Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://twitter.com/alphpacas"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="w-6 h-6" />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://github.com/larkben/alpacafi"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-6 h-6" />
                </motion.a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AlpacaFi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <motion.button
                whileHover={{ x: 3 }}
                onClick={() => openModal('privacy')}
                className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </motion.button>
              <motion.button
                whileHover={{ x: 3 }}
                onClick={() => openModal('terms')}
                className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200"
              >
                Terms of Service
              </motion.button>
            </div>
          </div>
        </div>
      </motion.footer>

      <LegalModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
      />
    </>
  );
} 