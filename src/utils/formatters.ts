/**
 * Utility functions for formatting  various data types throughout the application
 */



/**
 * Format a Solana wallet address to a shortened display format
 * @example
 * formatAddress("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM", 4)
 * // Returns: "9WzD...AWWM"
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// Formats a numerical amount with specified decimal places (default: 4)
export function formatAmount(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}

/**
 * Formats a Date object into a human-readable string
 * 
 * Uses Intl.DateTimeFormat for internationalization support
 * Format: "Jan 15, 2026, 3:45 PM"
 */ 
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Generates a Solana Explorer URL for a transaction signature
export function getExplorerUrl(signature: string, network: string = 'devnet'): string {
  const baseUrl = network === 'mainnet' 
    ? 'https://explorer.solana.com/tx/'
    : `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
  return baseUrl;
}

// Formats an amount with its currency symbol
export function formatCurrency(amount: number, currency: string = 'SOL'): string {
  return `${formatAmount(amount)} ${currency}`;
}