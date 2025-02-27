"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertTriangle, CheckCircle, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';
import { waitTxConfirmed } from '../lib/utils'
import { getNodeProvider, getBackendUrl } from '../lib/configs'

const Toast = ({ id, title, description, type, onClose, txId }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [copyIcon, setCopyIcon] = useState('copy');

  useEffect(() => {
    let timer;
    if (type === 'waiting') {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          return oldProgress + 1;
        });
      }, 320);
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, 5000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [id, onClose, type]);

  const baseClasses = "relative p-4 rounded-xl shadow-xl transition-all duration-300 flex items-center space-x-3 max-w-md overflow-hidden backdrop-blur-sm border";
  const typeClasses = {
    waiting: "bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse-subtle",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    success: "bg-green-500/10 text-green-400 border-green-500/20"
  };

  const icons = {
    waiting: (
      <div className="relative">
        <Loader2 size={20} className="animate-spin" />
        <div className="absolute inset-0 animate-pulse-ring rounded-full"></div>
      </div>
    ),
    error: <AlertTriangle size={20} />,
    success: <CheckCircle size={20} />
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txId);
    setCopyIcon('check');
    setTimeout(() => setCopyIcon('copy'), 3000);
  };

  const shortenHash = (address, charsAmount = 6) => {
    const firstPart = address.substring(0, charsAmount);
    const lastPart = address.substring(address.length - charsAmount, address.length);
    return `${firstPart}...${lastPart}`;
  };

  const redirectToExternalPage = () => {
    window.open(`https://explorer.alephium.org/transactions/${txId}`, '_blank');
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} 
        hover:bg-opacity-100 group hover:scale-[1.02] transition-all duration-300`}
    >
      {type === 'waiting' && (
        <>
          <div className="absolute bottom-0 left-0 h-0.5 bg-blue-400/20 w-full">
            <div 
              className="h-full bg-blue-400/40 rounded-full" 
              style={{ 
                width: `${progress}%`, 
                transition: 'width 0.3s linear',
                boxShadow: '0 0 10px rgba(96, 165, 250, 0.3)' 
              }} 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.05] to-blue-500/0 animate-gradient-x"></div>
        </>
      )}
      <div className="relative">{icons[type]}</div>
      <div className="flex-grow">
        <div className="font-medium text-[15px]">{title}</div>
        <div className="text-sm opacity-80">{description}</div>
        {txId && (
          <div className="text-xs opacity-75 mt-1.5 flex items-center space-x-2">
            <span className="font-mono bg-black/20 px-2 py-0.5 rounded-md">{shortenHash(txId)}</span>
            <button 
              onClick={copyToClipboard} 
              className="hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-md"
            >
              {copyIcon === 'copy' ? <Copy size={12} /> : <Check size={12} />}
            </button>
            <button 
              onClick={redirectToExternalPage} 
              className="hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-md"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        )}
      </div>
      {type !== 'waiting' && (
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }} 
          className="text-current opacity-60 hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/10 rounded-md"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, description, txId) => {
    const id = Date.now();
    setToasts(prevToasts => [{ id, title, description, type: 'waiting', txId }, ...prevToasts]);
    return id;
  }, []);

  const updateToast = useCallback((id, updates) => {
    setToasts(prevToasts =>
      prevToasts.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addTransactionToast = useCallback(async (title, txId) => {
    const toastId = addToast(title, 'Transaction submitted', txId);
    
    if (title === "New Loan Request") {
      try {
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            txId, 
            type: 'loan_created' 
          }),
        });
        
        const result = await response.text();
        if (result === 'confirmed') {
          updateToast(toastId, { type: 'success', description: 'Transaction confirmed' });
        } else {
          updateToast(toastId, { type: 'error', description: 'Transaction failed' });
        }
      } catch (error) {
        updateToast(toastId, { type: 'error', description: 'Transaction failed' });
      }
    } else {
      try {
        const nodeProvider = getNodeProvider();
        await waitTxConfirmed(nodeProvider, txId);
        updateToast(toastId, { type: 'success', description: 'Transaction confirmed' });
      } catch (error) {
        updateToast(toastId, { type: 'error', description: 'Transaction failed' });
      }
    }
  }, [addToast, updateToast]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.body.classList.add(
      "font-montserrat",
      "text-white",
      "bg-slate-900"
    );
    window.addTransactionToast = addTransactionToast;
    return () => {
      delete window.addTransactionToast;
    };
  }, [addTransactionToast]);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 flex flex-col-reverse z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transition-all duration-300 ease-in-out"
          style={{
            transform: `translateY(${-index * 4}px)`,
            zIndex: toasts.length - index
          }}
        >
          <Toast
            id={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            txId={toast.txId}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;