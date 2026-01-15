/**
 * WalletPortfolio.tsx - USDC-focused wallet display
 * 
 * Shows USDC as primary balance with explanation that SOL = 0 is intentional(not needed for gas).
 * Demonstrates fully gasless wallet where users never need SOL.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWallet } from '@lazorkit/wallet';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { X, Copy, ExternalLink, Wallet as WalletIcon, RefreshCw, Info, Sparkles } from 'lucide-react';
import { formatAddress } from '../utils/formatters';
import { LAZORKIT_CONFIG } from '../utils/constants';
import { getUSDCBalance } from '../utils/usdcWalletCheck';

export function WalletPortfolio() {
  const { wallet, disconnect } = useWallet();
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [usdcBalance, setUsdcBalance] = useState<number>(0);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const [showGaslessInfo, setShowGaslessInfo] = useState(false);

  /**
   * Fetch both SOL and USDC balances
   * @param showLoading - Whether to show loading state
   */
  const fetchBalances = async (showLoading: boolean = false) => {
    if (!wallet) return;
    
    if (showLoading) {
      setIsManualRefreshing(true);
    }
    
    try {
      const connection = new Connection(LAZORKIT_CONFIG.rpcUrl);
      const publicKey = new PublicKey(wallet.smartWallet);
      
      // Fetch SOL balance
      const solLamports = await connection.getBalance(publicKey);
      const solAmount = solLamports / LAMPORTS_PER_SOL;
      setSolBalance(solAmount);
      
      // Fetch USDC balance
      const usdcAmount = await getUSDCBalance(wallet.smartWallet);
      setUsdcBalance(usdcAmount);
      
      console.log('💰 Balances updated:');
      console.log('   SOL:', solAmount.toFixed(4));
      console.log('   USDC:', usdcAmount.toFixed(2));
    } catch (error) {
      console.error('Failed to fetch balances:', error);
    } finally {
      if (showLoading) {
        setIsManualRefreshing(false);
      }
    }
  };

  /**
   * Auto-refresh balances every 5 seconds
   */
  useEffect(() => {
    if (wallet) {
      fetchBalances(false);
      
      const interval = setInterval(() => {
        fetchBalances(false);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [wallet]);

  if (!wallet) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.smartWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualRefresh = async () => {
    await fetchBalances(true);
  };

  // Check if this is a gasless wallet (SOL = 0 but has USDC)
  const isGaslessWallet = solBalance === 0 && usdcBalance > 0;

  const modalContent = showPortfolio ? (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={() => setShowPortfolio(false)}
    >
      <div 
        className="bg-[#1a1a1a] rounded-2xl border border-white border-opacity-10 max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setShowPortfolio(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center">
            <WalletIcon className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              Smart Wallet
              {isGaslessWallet && <Sparkles size={16} className="text-purple-400" />}
            </h3>
            <p className="text-gray-400 text-xs">Devnet • Fully Gasless</p>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <p className="text-gray-400 text-xs mb-2">SMART WALLET ADDRESS</p>
          <div className="bg-black bg-opacity-50 rounded-lg p-3 flex items-center justify-between gap-2">
            <span className="text-white font-mono text-sm break-all">
              {wallet.smartWallet}
            </span>
            <button
              onClick={copyAddress}
              className="text-gray-400 hover:text-white transition flex-shrink-0"
              title="Copy address"
            >
              <Copy size={16} />
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-xs mt-1">✓ Address copied!</p>
          )}
        </div>

        {/* Balances Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-xs">BALANCES</p>
              {isGaslessWallet && (
                <button
                  onClick={() => setShowGaslessInfo(!showGaslessInfo)}
                  className="text-purple-400 hover:text-purple-300 transition"
                  title="Why zero SOL?"
                >
                  <Info size={14} />
                </button>
              )}
            </div>
            <button
              onClick={handleManualRefresh}
              disabled={isManualRefreshing}
              className="text-gray-400 hover:text-white transition disabled:opacity-50 flex items-center gap-1 text-xs"
              title="Refresh balances"
            >
              <RefreshCw size={14} className={isManualRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Gasless Wallet Info */}
        {isGaslessWallet && showGaslessInfo && (
          <div className="mb-4 bg-purple-600 bg-opacity-10 border border-purple-400 border-opacity-30 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-purple-300">
                <p className="font-semibold mb-1">Fully Glassless Wallet</p>
                <p className="text-purple-400">
                  This wallet holds USDC only. You don't need SOL because the Paymaster 
                  sponsors all transaction fees. This is the ultimate Web3 UX - pay with 
                  what you want, never worry about gas!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* USDC - Primary */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-400 border-opacity-30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              <span className="text-white text-sm font-semibold">USDC</span>
              <Sparkles size={12} className="text-purple-400" />
            </div>
            <p className="text-white text-2xl font-bold">
              {usdcBalance.toFixed(2)}
            </p>
            <p className="text-gray-400 text-xs">Primary Balance</p>
          </div>
          
          {/* SOL - Zero (intentional) */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
              <span className="text-gray-400 text-sm">
                SOL Balance
              </span>
            </div>
            <p className="text-gray-500 text-2xl font-bold">
              {solBalance.toFixed(4)}
            </p>
            {isGaslessWallet && (
              <div className="absolute top-2 right-2">
                <span className="text-green-400 text-xs">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* SOL Gas Abstraction */}
        <p className="text-gray-500 text-xs text-center mb-4">
          No SOL needed for gas fee
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <a
            href={`https://explorer.solana.com/address/${wallet.smartWallet}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 bg-opacity-20 border border-purple-400 border-opacity-30 text-purple-400 rounded-lg hover:bg-opacity-30 transition"
          >
            <ExternalLink size={16} />
            View on Explorer
          </a>
          <button
            onClick={() => {
              disconnect();
              setShowPortfolio(false);
            }}
            className="w-full px-4 py-3 bg-red-600 bg-opacity-20 border border-red-400 border-opacity-30 text-red-400 rounded-lg hover:bg-opacity-30 transition"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Wallet Button - Show USDC as primary balance */}
      <button
        onClick={() => setShowPortfolio(true)}
        className="flex items-center gap-2 bg-purple-500 bg-opacity-20 px-3 py-2 rounded-lg border border-purple-400 border-opacity-30 hover:bg-opacity-30 transition cursor-pointer"
      >
        <WalletIcon size={16} className="text-purple-400" />
        <div className="text-left">
          <span className="text-purple-400 text-xs font-mono block">
            {formatAddress(wallet.smartWallet)}
          </span>
          <span className="text-gray-400 text-xs block">
            {usdcBalance.toFixed(2)} USDC {isGaslessWallet && '✨'}
          </span>
        </div>
      </button>

      {modalContent && createPortal(modalContent, document.body)}
    </>
  );
}