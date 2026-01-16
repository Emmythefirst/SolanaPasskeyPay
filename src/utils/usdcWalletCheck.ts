/**
 * usdcWalletCheck.ts
 * =============================================================================
 * This file is responsible for checking whether a wallet is "USDC-ready".
 *
 * IMPORTANT:
 * - This file does NOT fund wallets
 * - This file does NOT sponsor transactions
 * - This file does NOT airdrop tokens
 *
 * What it DOES:
 * - Checks if a wallet has a USDC Associated Token Account (ATA)
 * - Reads the wallet's current USDC balance
 * - Determines whether the wallet should visit a faucet
 * - Prevents repeated checks using localStorage
 *
 * Why this exists:
 * In a gasless UX, users never need SOL.
 * They only need USDC — so this file ensures the wallet
 * is prepared before attempting a payment.
 *
 * No hidden funding logic
 */

import {
  Connection,
  PublicKey,
} from '@solana/web3.js'
import {
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { LAZORKIT_CONFIG } from './constants'

/**
 * Official USDC mint on Solana Devnet
 * Used to derive USDC Associated Token Accounts (ATAs)
 */
export const USDC_MINT_DEVNET = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
)

/**
 * Minimum amount of USDC considered "ready" for payments.
 * Below this threshold, the UI will suggest visiting a faucet.
 */
const MIN_USDC_THRESHOLD = 0.1

/**
 * LocalStorage key used to remember wallets that have
 * already been checked, to avoid repeating RPC calls.
 */
const CHECKED_WALLETS_KEY = 'lazorkit_usdc_sponsored_wallets'

/* =============================================================================
 * LOCAL STORAGE HELPERS
 * =============================================================================
 * These helpers are purely client-side optimizations.
 * They prevent re-checking the same wallet multiple times
 * during a session or across reloads.
 */

/**
 * Returns a Set of wallet addresses that have already been checked.
 */

function getCheckedWallets(): Set<string> {
  try {
    const stored = localStorage.getItem(CHECKED_WALLETS_KEY)
    return stored ? new Set(JSON.parse(stored)) : new Set()
  } catch {
    return new Set()
  }
}

// Marks a wallet as "checked" so we don't repeat the same logic
function markWalletAsChecked(wallet: string) {
  try {
    const sponsored = getCheckedWallets()
    sponsored.add(wallet)
    localStorage.setItem(CHECKED_WALLETS_KEY, JSON.stringify([...sponsored]))
  } catch (err) {
    console.error('Failed to mark wallet as sponsored:', err)
  }
}

// Returns true if this wallet was already checked before
function wasWalletAlreadyChecked(wallet: string): boolean {
  return getCheckedWallets().has(wallet)
}

/* =============================================================================
 * BALANCE & ACCOUNT HELPERS
 * =============================================================================
 */

/**
 * Fetches the wallet's USDC balance.
 *
 * - If the USDC ATA does not exist, returns 0
 * - If any RPC error occurs, safely returns 0
 *
 * This function is intentionally defensive to avoid UI crashes.
 */

export async function getUSDCBalance(walletAddress: string): Promise<number> {
  try {
    const connection = new Connection(LAZORKIT_CONFIG.rpcUrl)
    const owner = new PublicKey(walletAddress)
    const ata = await getAssociatedTokenAddress(
      USDC_MINT_DEVNET,
      owner,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    const balance = await connection.getTokenAccountBalance(ata)
    return balance.value.uiAmount ?? 0
  } catch (err) {
    console.log('USDC account not found or error:', err)
    return 0
  }
}

/**
 * Checks whether the wallet has a USDC Associated Token Account (ATA).
 *
 * This is important because:
 * - A wallet can exist without ever holding USDC
 * - Without an ATA, transfers will fail
 */
async function hasUSDCAccount(
  connection: Connection,
  wallet: PublicKey
): Promise<boolean> {
  try {
    const ata = await getAssociatedTokenAddress(
      USDC_MINT_DEVNET,
      wallet,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
    await getAccount(connection, ata)
    return true
  } catch {
    return false
  }
}

// ============================================================================
// Main Check
// ============================================================================

/**
 * Checks whether a wallet is ready to make USDC payments.
 *
 * Returns:
 * - Whether the wallet already has enough USDC
 * - Whether it needs to visit a faucet
 * - Clear messages suitable for UI display
 *
 * NOTE:
 * Even though the return object contains "sponsored",
 * it is ALWAYS false — no funding happens here.
 * 
 * This function is intentionally called once per wallet connection
 * from WalletButton.tsx.
 *
 * UI-level guards (useRef) prevent repeated calls,
 * so no separate "pre-check" helper is required.
 */

export async function checkUSDCReadiness(
  walletAddress: string
): Promise<{
  sponsored: boolean
  alreadyFunded?: boolean
  balance?: number
  message?: string
  error?: string
}> {
  try {
    console.log('💵 Checking USDC balance for:', walletAddress)

    // If already checked - return current balance without repeating the full validation flow
    if (wasWalletAlreadyChecked(walletAddress)) {
      const balance = await getUSDCBalance(walletAddress)
      console.log('   Already checked, balance:', balance)
      return {
        sponsored: false,
        alreadyFunded: balance >= MIN_USDC_THRESHOLD,
        balance,
        message: balance >= MIN_USDC_THRESHOLD 
          ? 'Wallet funded with USDC' 
          : 'Low USDC - visit faucet'
      }
    }

    const connection = new Connection(LAZORKIT_CONFIG.rpcUrl)
    const wallet = new PublicKey(walletAddress)

    // Step 1: Check if USDC ATA exists
    const hasATA = await hasUSDCAccount(connection, wallet)
    console.log('   USDC ATA exists?', hasATA)

    if (!hasATA) {
      console.log('   ⚠️ No USDC account - needs faucet')
      markWalletAsChecked(walletAddress)
      
      return {
        sponsored: false,
        balance: 0,
        message: 'Get USDC from faucet',
        error: 'USDC_ACCOUNT_NOT_FOUND'
      }
    }

    // Step 2: Check balance
    const currentBalance = await getUSDCBalance(walletAddress)
    console.log('   Current USDC balance:', currentBalance)

    markWalletAsChecked(walletAddress)

    if (currentBalance >= MIN_USDC_THRESHOLD) {
      return {
        sponsored: false,
        alreadyFunded: true,
        balance: currentBalance,
        message: `Wallet has ${currentBalance.toFixed(2)} USDC`
      }
    }

    return {
      sponsored: false,
      balance: currentBalance,
      message: 'Visit faucet for USDC',
      error: 'NEEDS_FAUCET_VISIT'
    }

  } catch (error: any) {
    console.error('❌ USDC check failed:', error)

    return {
      sponsored: false,
      error: error.message || 'Unknown error',
      message: 'Failed to check USDC'
    }
  }
}


/* =============================================================================
 * UI HELPERS
 * =============================================================================
 */

// Converts a readiness result into a clean UI message.

export function getUSDCStatusMessage(result: {
  sponsored: boolean
  alreadyFunded?: boolean
  balance?: number
  message?: string
  error?: string
}): string {
  if (result.alreadyFunded) {
    return result.message || 'Wallet funded'
  }

  if (result.error === 'USDC_ACCOUNT_NOT_FOUND') {
    return 'Get USDC from faucet'
  }

  if (result.error === 'NEEDS_FAUCET_VISIT') {
    return result.message || 'Visit USDC faucet'
  }

  return result.message || 'Checking USDC...'
}

/**
 * Returns human-readable instructions for manually
 * funding a wallet with USDC on Devnet.
 *
 * This is intentionally separated from logic so it can
 * be reused in modals, tooltips, or onboarding flows.
 */

export function getManualFundingInstructions(walletAddress: string) {
  return {
    title: 'Get Free USDC (Devnet)',
    steps: [
      '1. Visit Circle USDC Faucet',
      '2. Select Solana devnet',
      '3. Paste your wallet address',
      '4. Request USDC (free)',
      '5. Wait ~10 seconds',
      '6. Refresh and start paying!'
    ],
    wallet: walletAddress,
    links: [
      {
        text: '🔗 Circle USDC Faucet',
        url: 'https://faucet.circle.com/'
      }
    ]
  }
}