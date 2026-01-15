import { ReactNode, useEffect } from 'react';
import { LazorkitProvider, useWallet as useLazorkitWallet } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '../utils/constants';

// Props for LazorKitAppProvider component
interface LazorKitAppProviderProps {
  // Child components to be wrapped with wallet functionality 
  children: ReactNode;
}

/**
 * LazorKitAppProvider Module
 * 
 * This module provides app-level configuration and session management for LazorKit.
 * It wraps the entire application to enable:
 * 
 * 1. Passkey-based wallet authentication
 * 2. Gasless transaction support via paymaster
 * 3. Automatic session restoration across page reloads
 * 4. Persistent wallet connections
 */

export function LazorKitAppProvider({ children }: LazorKitAppProviderProps) {
  return (

    /**
     * LazorkitProvider - Core SDK Configuration
     * 
     * This is LazorKit's main provider that configures:
     * 
     * rpcUrl:
     * - Solana RPC endpoint for blockchain interactions
     * - Default: https://api.devnet.solana.com (devnet)
     * - For mainnet: https://api.mainnet-beta.solana.com
     * 
     * portalUrl:
     * - LazorKit portal URL for passkey authentication
     * - Handles WebAuthn credential creation/retrieval
     * - Default: https://portal.lazor.sh
     * 
     * paymasterConfig:
     * - Configuration for gasless transaction sponsorship
     * - paymasterUrl: Endpoint that sponsors transaction fees
     * - Default: https://kora.devnet.lazorkit.com (devnet paymaster)
     * 
     * These URLs come from LAZORKIT_CONFIG which reads from .env
     */
    <LazorkitProvider
      rpcUrl={LAZORKIT_CONFIG.rpcUrl}
      portalUrl={LAZORKIT_CONFIG.portalUrl}
      paymasterConfig={{
        paymasterUrl: LAZORKIT_CONFIG.paymasterUrl,
      }}
    >
      {/**
       * AutoConnectWrapper - Session Persistence Layer
       * 
       * Wraps children with automatic reconnection logic.
       * Tries to restore wallet session on app load.
       */}
      <AutoConnectWrapper>
        {children}
      </AutoConnectWrapper>
    </LazorkitProvider>
  );
}

/** AutoConnectWrapper Component
 * 
 * Handles automatic wallet reconnection on page load.
 * 
 * This component:
 * 1. Checks localStorage for previous connection flag
 * 2. If found, attempts to reconnect wallet automatically
 * 3. Tracks connection state changes
 * 4. Updates localStorage accordingly
 * 
 * Security Note:
 * - localStorage only stores a boolean flag ("was connected")
 * - No private keys, seeds, or credentials are stored
 * - Actual reconnection uses passkey authentication
 * - If reconnection fails, flag is cleared
 */
  
  
function AutoConnectWrapper({ children }: { children: ReactNode }) {

  /**
   * LazorKit wallet hook provides:
   * - connect(): Function to initiate passkey authentication
   * - isConnected: Boolean indicating connection status
   * - wallet: Full wallet object (or null if not connected)
   */
  const { connect, isConnected, wallet } = useLazorkitWallet();

  // Try to restore wallet session on component mount
  useEffect(() => {
    const restoreSession = async () => {

      /**
       * Check for session flag in localStorage
       * This flag is set when user successfully connects
       * (see tracking effect below)
       */
      const hasSession = localStorage.getItem('lazorkit_connected');
      
      // only attempt restoration if Session flag exists (user was previously connected)
      if (hasSession && !isConnected && !wallet) {
        console.log('🔄 Attempting to restore wallet session...');
        try {
          // Attempt to reconnect with paymaster mode, this triggers passkey authentication
          await connect({ feeMode: 'paymaster' });
          console.log('✅ Session restored');
        } catch (error) {
          // Restoration failed and clear session so we don't keep attempting to restore on every load
          console.log('❌ Session restore failed:', error);
          localStorage.removeItem('lazorkit_connected');
        }
      }
    };

    // Execute restoration attempt
    restoreSession();
  }, [connect, isConnected, wallet]);

  useEffect(() => {
    // Track connection state in local storage
    if (isConnected && wallet) {
      localStorage.setItem('lazorkit_connected', 'true');
    } else {
      localStorage.removeItem('lazorkit_connected');
    }
  }, [isConnected, wallet]);

  return <>{children}</>;
}

// Re-export the useWallet hook from LazorKit
export { useLazorkitWallet as useWallet };