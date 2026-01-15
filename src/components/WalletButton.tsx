/**
 * WalletButton.tsx - Wallet Connection & Passkey authentication, Ato-Check For USDC
 * 
 * Handles wallet connection UI and faucet guide for wallets without USDC
 * Shows different states: connecting, connected, error, default
 */

import { useWallet } from '@lazorkit/wallet';
import { Loader, AlertCircle, X, ExternalLink, Copy } from 'lucide-react';
import { createPortal } from 'react-dom';
import { WalletPortfolio } from './WalletPortfolio';
import { useEffect, useState, useRef } from 'react';
import { checkUSDCReadiness, getManualFundingInstructions } from '../utils/usdcWalletCheck';

export function WalletButton() {
  const { connect, isConnected, isConnecting, smartWalletPubkey } = useWallet();
  const [connectionError, setConnectionError] = useState(false);
  const [showFaucetGuide, setShowFaucetGuide] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  
  // Use ref to track if we've already checked
  const hasCheckedUSDC = useRef(false);

  useEffect(() => {
    if (isConnected && !smartWalletPubkey) {
      console.warn('⚠️ Connected but no smartWalletPubkey');
      setConnectionError(true);
    } else {
      setConnectionError(false);
    }
  }, [isConnected, smartWalletPubkey]);

  // Check USDC only ONCE when wallet connects
  useEffect(() => {
    const checkUSDC = async () => {
      if (isConnected && smartWalletPubkey && !hasCheckedUSDC.current) {
        hasCheckedUSDC.current = true; // Mark as checked
        
        console.log('💵 Checking USDC (one-time)...');
        
        try {
          const result = await checkUSDCReadiness(smartWalletPubkey.toString());
          console.log('💵 Result:', result);
          
          // Show faucet guide if needed
          if (result.error === 'USDC_ACCOUNT_NOT_FOUND' || result.error === 'NEEDS_FAUCET_VISIT') {
            setShowFaucetGuide(true);
          }
          
        } catch (error) {
          console.error('USDC check failed:', error);
        }
      }
    };

    checkUSDC();
  }, [isConnected, smartWalletPubkey]);

  // Reset check flag when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      hasCheckedUSDC.current = false;
    }
  }, [isConnected]);

  // Initiate wallet connection with passkey authentication
  const handleConnect = async () => {
    try {
      setConnectionError(false);
      await connect({ feeMode: 'paymaster' });
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionError(true);
    }
  };

  // copy address
  const copyWalletAddress = () => {
    if (smartWalletPubkey) {
      navigator.clipboard.writeText(smartWalletPubkey.toString());
      setWalletCopied(true);
      setTimeout(() => setWalletCopied(false), 2000);
    }
  };

  // Loading state - wallet is connecting
  if (isConnecting) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 bg-opacity-60 text-white rounded-lg cursor-not-allowed"
      >
        <Loader className="animate-spin" size={16} />
        Connecting...
      </button>
    );
  }

  // Error state - connection failed
  if (connectionError) {
    return (
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 bg-opacity-60 text-white rounded-lg hover:bg-opacity-80"
      >
        <AlertCircle size={16} />
        Reconnect
      </button>
    );
  }

  // Connected state - show faucet guide modal and wallet portfolio
  if (isConnected && smartWalletPubkey) {
    const instructions = getManualFundingInstructions(smartWalletPubkey.toString());

    return (
      <>
        <WalletPortfolio />

        {/* Faucet Guide Modal */}
        {showFaucetGuide && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-[100000]"
            onClick={() => setShowFaucetGuide(false)}
          >
            <div 
              className="bg-[#1a1a1a] rounded-2xl border border-purple-400 border-opacity-30 max-w-lg w-full p-6 relative animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFaucetGuide(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <X size={20} />
              </button>

              <h3 className="text-white font-bold text-xl mb-4">{instructions.title}</h3>
              
              <p className="text-gray-300 text-sm mb-4">
                Get free devnet USDC to test payments (takes 30 seconds):
              </p>

              <div className="space-y-2 mb-6">
                {instructions.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-gray-300">
                    <span className="text-purple-400 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-gray-400 text-xs mb-2">YOUR WALLET</p>
                <div className="bg-black bg-opacity-50 rounded-lg p-3 flex items-center justify-between gap-2">
                  <span className="text-white font-mono text-xs break-all">
                    {instructions.wallet}
                  </span>
                  <button
                    onClick={copyWalletAddress}
                    className="text-gray-400 hover:text-white transition flex-shrink-0"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {walletCopied && <p className="text-green-400 text-xs mt-1">✓ Copied!</p>}
              </div>

              <div className="space-y-2">
                {/* Faucet link */}
                {instructions.links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-purple-600 bg-opacity-20 border border-purple-400 border-opacity-30 text-purple-400 rounded-lg hover:bg-opacity-30 transition"
                  >
                    <ExternalLink size={16} />
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  // Default state - show connect button
  return (
    <button
      onClick={handleConnect}
      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
    >
      Connect Wallet
    </button>
  );
}