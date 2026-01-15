/**
 * Application Constants
 * 
 * Centralized configuration values for the entire application.
 */


// ==============================================================================
// SOLANA NETWORK RPC ENDPOINTS
// ==============================================================================

/* Usage:
 * ```tsx
 * const connection = new Connection(SOLANA_NETWORKS.devnet);
 * ``
 */ 
export const SOLANA_NETWORKS = {
  // Devnet RPC endpoint - for development and testing
  devnet: 'https://api.devnet.solana.com',

  // Testnet RPC endpoint - legacy test network
  testnet: 'https://api.testnet.solana.com',

  // Mainnet RPC endpoint - production network
  mainnet: 'https://api.mainnet-beta.solana.com',
} as const;


// ==============================================================================
// LAZORKIT SDK CONFIGURATION
// ==============================================================================

export const LAZORKIT_CONFIG = {
  // LazorKit Portal URL
  portalUrl: import.meta.env.VITE_PORTAL_URL || 'https://portal.lazor.sh',

  // Paymaster URL
  paymasterUrl: import.meta.env.VITE_PAYMASTER_URL || 'https://kora.devnet.lazorkit.com',

  // Solana RPC URL
  rpcUrl: import.meta.env.VITE_RPC_URL || SOLANA_NETWORKS.devnet,
};


// ==============================================================================
// APPLICATION CONFIGURATION
// ==============================================================================

export const APP_CONFIG = {
  // Application Name
  name: 'LazorKit Pay',

  // Application Version
  version: '1.0.0',

  // Application Solana Version
  network: import.meta.env.VITE_SOLANA_NETWORK || 'devnet',

  // Merchant Wallet Address - CRITICAL: This is where payments are sent!
  merchantWallet: import.meta.env.VITE_MERCHANT_WALLET,
};


// ==============================================================================
// SOLANA EXPLORER URL TEMPLATES
// ==============================================================================

// URL patterns for linking to Solana Explorer.
export const EXPLORER_URLS = {
  // Devnet Explorer URL Template
  devnet: 'https://explorer.solana.com/tx/{{signature}}?cluster=devnet',

  // Testnet Explorer URL Template
  testnet: 'https://explorer.solana.com/tx/{{signature}}?cluster=testnet',

  // Mainnet Explorer URL Template
  mainnet: 'https://explorer.solana.com/tx/{{signature}}',
} as const;



/**
 * Type Safety for Constants
 * 
 * Using `as const` makes objects deeply readonly and
 * preserves literal types. This prevents accidental
 * modifications and provides better TypeScript inference.
 */