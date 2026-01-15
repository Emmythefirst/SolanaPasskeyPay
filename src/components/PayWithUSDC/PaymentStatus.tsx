/**
 * PaymentStatus.tsx - UI responsible for displaying the current payment state
 * 
 * Displays payment status with visual countdown for auto-reset states.
 * Supports USDC payments with explorer links and gasless transactions via paymaster
 */

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { getExplorerUrl } from '../../utils/formatters';
import { PaymentState } from './PaymentButton';

interface PaymentStatusProps {
  status: PaymentState;
  signature?: string;
  error?: string;
  gasless?: boolean;
  currency?: 'SOL' | 'USDC';
  network?: 'mainnet' | 'devnet' | 'testnet';
}

export function PaymentStatus({
  status,
  signature,
  error,
  gasless,
  currency = 'USDC',
  network = 'devnet'
}: PaymentStatusProps) {

  // Countdown value used to auto-reset UI (success/error)
  const [countdown, setCountdown] = useState(5);

  // Countdown timer for auto-dismiss states (success/error)
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setCountdown(5);
      
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  // Idle state - show informational messages omly
  if (status === 'idle') {
    if (gasless && currency === 'USDC') {
      return (
        <div className="space-y-1">
          <div className="text-xs text-green-400 text-center">
            ● Paymaster sponsors all fees
          </div>
        </div>
      );
    }
    
    if (gasless) {
      return (
        <div className="text-xs text-green-400 text-center">
          ● Gas fees sponsored
        </div>
      );
    }
    
    return null;
  }

  // Success state - shown when payment is confirmed with countdown
  if (status === 'success' && signature) {
    return (
      <div className="space-y-2 text-center animate-fade-in">
        <div className="flex justify-center items-center gap-2 text-green-400">
          <CheckCircle size={16} />
          <span>{currency} payment confirmed</span>
        </div>
        
        {currency === 'USDC' && gasless && (
          <p className="text-xs text-purple-400">
            ✨ Zero SOL used - Fully gasless!
          </p>
        )}

        {/* Solana Explorer link */}
        <a
          href={getExplorerUrl(signature, network)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
        >
          <ExternalLink size={12} />
          View on Explorer
        </a>

        {countdown > 0 && (
          <p className="text-xs text-gray-500">
            Resetting in {countdown}s...
          </p>
        )}
      </div>
    );
  }

  // Error state - displays error message with auto-dismiss timer
  if (status === 'error' && error) {
    return (
      <div className="space-y-2 animate-fade-in">
        <div className="flex items-center gap-2 text-red-400 text-sm justify-center">
          <XCircle size={16} />
          {error}
        </div>
        
        {countdown > 0 && (
          <p className="text-xs text-gray-500 text-center">
            Dismissing in {countdown}s...
          </p>
        )}
      </div>
    );
  }

  return null;
}