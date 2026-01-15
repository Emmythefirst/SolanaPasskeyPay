/**
 * PayWithUSDC/index.tsx
 * -----------------------------------------------------------------------------
 * High-level payment orchestration component.
 *
 * Responsibilities:
 * - Handles wallet connection (gasless or user-paid)
 * - Builds SOL or USDC transfer instructions
 * - Sends transactions using LazorKit smart wallet
 * - Manages payment state lifecycle (idle → success/error)
 *
 * Supports:
 * - Gasless USDC payments via Paymaster
 * SOL payments (But USDC is going to be the primary transfer fee in this demo)
 * - Automatic merchant ATA creation
 */

import { useState, useEffect } from 'react'
import { useWallet } from '@lazorkit/wallet'
import {
  SystemProgram,
  PublicKey,
  LAMPORTS_PER_SOL,
  Connection,
} from '@solana/web3.js'
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { PaymentStatus } from './PaymentStatus'
import { PaymentButton, PaymentState } from './PaymentButton'
import { LAZORKIT_CONFIG } from '../../utils/constants'

// Official USDC Devnet mint
const USDC_MINT_DEVNET = new PublicKey(
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
)

const USDC_DECIMALS = 6

export interface PayWithUSDCProps {
  amount: number
  currency?: 'SOL' | 'USDC'
  merchantWallet: string
  gasless?: boolean
  disabled?: boolean
  label?: string
  onSuccess?: (signature: string) => void
  onError?: (error: Error) => void
}

export function PayWithUSDC({
  amount,
  currency = 'USDC',
  merchantWallet,
  gasless = true,
  disabled,
  label,
  onSuccess,
  onError,
}: PayWithUSDCProps) {
  const { connect, smartWalletPubkey, signAndSendTransaction } = useWallet()

  const [status, setStatus] = useState<PaymentState>('idle')
  const [signature, setSignature] = useState<string>()
  const [error, setError] = useState<string>()

  // Automatically reset UI state after success or error
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setStatus('idle')
        setSignature(undefined)
        setError(undefined)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

// Creates a native SOL transfer instruction
  const createSOLTransferInstruction = (
    destination: PublicKey,
    lamports: number
  ) => {
    if (!smartWalletPubkey) throw new Error('Wallet not connected')

    return SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: destination,
      lamports,
    })
  }

  /**
   * Builds USDC transfer instructions:
   * - Ensures merchant ATA exists
   * - Transfers USDC using SPL Token Program
   */
  const createUSDCInstructions = async (
    destination: PublicKey,
    usdcAmount: number
  ) => {
    if (!smartWalletPubkey) throw new Error('Wallet not connected')

    const connection = new Connection(LAZORKIT_CONFIG.rpcUrl)
    const instructions = []

    // Sender ATA
    const fromTokenAccount = await getAssociatedTokenAddress(
      USDC_MINT_DEVNET,
      smartWalletPubkey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    // Merchant's ATA
    const toTokenAccount = await getAssociatedTokenAddress(
      USDC_MINT_DEVNET,
      destination,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    )

    // Check if merchant ATA exists
    let merchantATAExists = true
    try {
      await getAccount(connection, toTokenAccount)
    } catch {
      merchantATAExists = false
    }

    // Create merchant ATA if missing
    if (!merchantATAExists) {
      console.log('🧱 Creating merchant USDC ATA')
      instructions.push(
        createAssociatedTokenAccountInstruction(
          smartWalletPubkey,
          toTokenAccount,
          destination,
          USDC_MINT_DEVNET,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        )
      )
    }

    // Convert to USDC amount to base units (6 decimals)
    const baseUnits = Math.floor(usdcAmount * Math.pow(10, USDC_DECIMALS))

    // Create Transfer Instruction
    instructions.push(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        smartWalletPubkey,
        baseUnits,
        [],
        TOKEN_PROGRAM_ID
      )
    )

    return instructions
  }

  // Primary payment handler
  const handlePayment = async () => {
    try {
      setError(undefined)
      setStatus('connecting')

      if (!smartWalletPubkey) {
        await connect({ feeMode: gasless ? 'paymaster' : 'user' })
      }

      if (!smartWalletPubkey) {
        throw new Error('Wallet connection failed')
      }

      const destination = new PublicKey(merchantWallet)

      // Create appropriate payment instruction based on currency
      let instructions = []

      if (currency === 'USDC') {
        console.log('💵 Preparing USDC payment')
        instructions = await createUSDCInstructions(destination, amount)
      } else {
        console.log('💰 Preparing SOL payment')
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL)
        instructions = [createSOLTransferInstruction(destination, lamports)]
      }

      // Show authenticating state
      setStatus('authenticating')

      console.log('🚀 Sending gasless transaction')

      // Execute gasless transaction
      const sig = await signAndSendTransaction({
        instructions,
        transactionOptions: {
          feeToken: 'USDC',
          computeUnitLimit: 300_000,
        },
      })

      // Update UI with success
      setSignature(sig)
      setStatus('success')
      onSuccess?.(sig)

    } catch (err: any) {
      console.error('❌ Payment failed:', err)
      setStatus('error')

      // Error message
      let message = err.message ?? 'Payment failed'

      if (message.includes('TokenAccountNotFound')) {
        message = 'USDC account not found. Get USDC from faucet first.'
      } else if (message.includes('insufficient')) {
        message = 'Insufficient USDC balance'
      }

      setError(message)
      onError?.(err)
    }
  }

  return (
    <div className="space-y-3">
      <PaymentButton
        status={status}
        amount={amount}
        currency={currency}
        label={label}
        disabled={disabled}
        onClick={handlePayment}
      />

      <PaymentStatus
        status={status}
        signature={signature}
        error={error}
        gasless={gasless}
        currency={currency}
      />
    </div>
  )
}