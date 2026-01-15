# Tutorial 4: Implementing a Complete Payment Flow

This tutorial explains how this repository implements a real-world Solana payment flow using LazorKit, from user intent to confirmed on-chain transaction.

The goal is to demonstrate how Web3 payments can feel as simple as Web2 checkout, while remaining fully non-custodial and on-chain.

---

## What You'll Learn

- What a Web3 payment flow looks like in practice
- How LazorKit connects users without wallets or seed phrases
- How payment instructions are created
- How gasless transactions fit into checkout
- How to structure a production-ready payment flow
- This demo devnet behavior

---

## What "Payment Flow" Means in This Project

In this repository, a payment flow is not just a transfer.

It includes:

• User initiates payment
• Wallet session is established
• Wallet readiness/verification for USDC payment
• A transfer instruction is created
• Transaction is signed with a passkey
• Network fees are handled automatically
• The transaction is confirmed
• UI reflects success or failure

This repository implements all of the above.

---

## Where the Payment Flow Lives

The Core Files in the flow:

> `src/utils/usdcWalletCheck.tsx` → Wallet readiness & Sponsorship policy simulation
> `src/components/PayWithUSDC/index.tsx` → Transaction logic
> `src/contexts/LazorKitAppContext.tsx` → Wallet + session
> `src/components/WalletButton.tsx` → Wallet connection
> `src/views/DemoStoreView.tsx` → Product/checkout UI

---

## Views vs Logic In This Demo(Important)

### Views (`src/views`)

- Render pages
- Handle layout
- Pass props

### Logic (`components` / `contexts` / `hooks`)

- Wallet connection
- Transactions
- Session state

### Views never:

- Call Solana APIs directly
- Construct instructions
- Handle Paymaster logic

### Other components handle UI / layout:

> `src/components/AnalyticsDashboard.tsx` → Displays comprehensive analytics and metrics for transaction data

> `src/components/Navigation.tsx` → Provides navigation structure and handles view switching

> `src/components/TransactionHistory.tsx` → Displays a list of all past transactions with detailed information

---

## Why This Architecture Scales

• Easy to swap UI
• Logic stays isolated
• Payments reusable across apps
• Clear mental model for contributors

---

## Why a Dedicated Payment Flow Matters

### Traditional Web3 Payments

In most Web3 apps:

• Users must install a wallet
• Users must manage private keys
• Users must own SOL for gas
• Payments often feels slow or fail 
• This creates friction and abandonment.

### LazorKit Payment Experience

With LazorKit:

• Users authenticate with passkeys
• Wallets are created automatically
• Gas fees are sponsored
• Payments feel instant and familiar


---

## High-Level Payment Flow Overview

Here is the full flow implemented in this project:

```
Click Pay with Solana
    ↓
Authenticate with Passkey/ Face ID / biometrics
    ↓
USDC ATA checks & creation
    ↓
USDC transfer instruction
    ↓ 
Transfer signed with passkey
    ↓ 
Paymaster handles fees (simulated)
    ↓ 
Explorer confirmation                
```

No wallet popups. No seed phrases. No gas errors.


---

## Core Payment Flow Pattern

At the heart of the payment flow is a single transaction submission call.

```typescript
await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: {
    feeToken: 'USDC',
    computeUnitLimit: 200_000
  }
});
```

Everything else in the component exists to support this moment.

---

## Step-by-Step Payment Flow Breakdown

### Step 1 — Access LazorKit Wallet APIs

```typescript
import { useWallet } from '@lazorkit/wallet';

const {
  connect,
  isConnected,
  smartWalletPubkey,
  signAndSendTransaction
} = useWallet();
```

**Key points:**

• LazorKit uses a hook-based API
• No browser wallet extensions are required
• `smartWalletPubkey` represents the user's on-chain wallet

---

### Step 2 — Ensure Wallet Connection

Before initiating payment, the app ensures a wallet session exists:

```typescript
if (!smartWalletPubkey) {
  await connect({ feeMode: 'paymaster' });
}
```

**Why this matters:**

• Automatically initializes a wallet if needed
• Enables gasless mode from the start
• Supports session restoration

The user does not need to think about wallets at all.

---


### Step 3: Wallet Readiness Check (USDC Capability)

Before constructing the payment transaction, the app calls logic from:
`src/utils/usdcWalletCheck.ts`

This step simulates paymaster preparation on devnet.

**What walletSponsor.ts actually does**
The sponsor logic performs pre-flight checks and setup, including:

**Ensuring the user has a USDC Associated Token Account (ATA)**
• Required for USDC-based fee abstraction
• Created if missing

**Ensuring wallet viability for ATA creation and devnet execution edge cases**
• Covers:
    • ATA creation rent
    • Edge-case compute or fallback fees
    • On devnet, this comes from a faucet

**Validating the fee token path**

• Confirms USDC mint and token program
• Prevents invalid Paymaster routing

```typescript
const hasATA = await hasUSDCAccount(connection, wallet)
```

What this line ensures:

• USDC ATA exists
• USDC balance is sufficient
• User is guided to faucet if needed

❗ No backend is involved
❗ No gas is required at this step, happens later during transaction submission
❗ No transaction is sent

**Important clarification:**

On devnet, Paymaster sponsorship is simulated, not enforced.
The sponsor logic prepares the wallet exactly as a real Paymaster would require.


---

### Step 4 — Create the Payment Instruction

Payments uses USDC (SPL token).

**Example:**

```typescript
instructions = await createUSDCInstructions(
    destination: PublicKey,
    usdcAmount: number
)
```

### Inside this step:

• Merchant USDC ATA is conditionally created
• USDC transfer instruction is added
• No transaction is sent yet

**Important clarification:**

> Note on SOL payments  
>  
> The app also includes a native SOL transfer helper(
  ```typescript
  createSolTransferInstructions = async (
    destination: PublicKey,
    lamports: number
) =>
return SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: merchantAddress,
  lamports: amountInLamports
});
```
)  
> to support optional SOL-based payments and future extensibility.
>  
> However, the primary demo for this project uses USDC (SPL token transfers),
> which is why USDC instructions and ATA handling are the main execution path.

**NOTE**
This App/project computes both the payer and merchant USDC Associated Token Accounts (ATAs)

```typescript
const fromTokenAccount = await getAssociatedTokenAddress(
  USDC_MINT_DEVNET,
  smartWalletPubkey,
  true,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
)

const toTokenAccount = await getAssociatedTokenAddress(
  USDC_MINT_DEVNET,
  destination,
  true,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
)
```
using deterministic SPL rules. This allows the app to verify balances and prepare token transfers without submitting a transaction.


---

### Step 5 — Submit the Payment Transaction

This is where the actual payment happens:

```typescript
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: 'USDC',
    computeUnitLimit: 300_000
  }
});
```

**What this does:**

| Field | Purpose |
|-------|---------|
| `instructions` | The payment instructions |
| `feeToken` | Enables Paymaster-sponsored fees |
| `computeUnitLimit` | Ensures reliable execution |

Because `feeToken` is set:

• The user does not need SOL
• Gas fees are abstracted from the user and settled in SOL via the Paymaster route
• LazorKit handles sponsorship automatically


• LazorKit routes the transaction through a Paymaster-compatible pipeline
• USDC is specified as the fee abstraction token
• On devnet:
  • Actual sponsorship may fall back to minimal SOL
  • Architecture remains identical to mainnet

⚠️ The presence of feeToken: 'USDC' does not guarantee free gas on devnet
It guarantees correct Paymaster routing

---

## Asset Being Paid vs Asset Used for Gas

This project intentionally separates these concepts:

| Role | Asset |
|------|-------|
| Payment asset | USDC |
| Gas asset | SOL |
| Gas payer | LazorKit Paymaster |

Payments are made in USDC, while transaction fees (SOL) are covered by the LazorKit paymaster. The `feeToken: 'USDC'` setting represents how fees are logically billed within the paymaster system — not the native gas token itself.

This seperation enables a truly gasless payment experience.

---

## Devnet Behavior: Why Wallets Appear with Small SOL Balances

On Solana devnet, newly created smart wallets may appear with a small SOL balance (≈ 0.0009 SOL).

This SOL is not user-funded and not part of this app’s payment model.

**Why this happens:**

• Devnet faucet behavior may pre-fund accounts
• Solana rent-exemption edge cases
• Prevents false-negative transaction failures during testing

**Important clarifications:**

• This SOL is not relied upon
• This SOL is not spent intentionally
• This SOL is not sponsorship logic
• This SOL does not represent real economics

**⚠️ Devnet ≠ Mainnet**

On mainnet:

• Wallets would start with zero SOL
• A real sponsor treasury would explicitly fund fees
• Devnet faucet behavior does not exist

---


### What This Project Does Not Do

To be explicit, this project does not:

• ❌ Convert USDC into SOL
• ❌ Pay gas “in USDC” at the protocol level
• ❌ Hide fees by silently charging users

Instead, it:

• Abstracts fees away from the user
• Models a production Paymaster architecture
• Uses devnet safely and transparently for testing

---

## Summary

You have now seen how this repository implements a full Solana payment flow using LazorKit:

• User-initiated checkout
• Automatic wallet connection
• Passkey-based signing
• Paymaster integration + routing
• Clean UI feedback

---


## Next Steps

- **[Tutorial 1: Wallet Setup](./TUTORIAL_1_WALLET_SETUP.md)** - For initial connection flow
- **[Tutorial 2: Gasless Transactions](./TUTORIAL_2_GASLESS_TRANSACTIONS.md)** - For fee sponsorship
- **[Tutorial 3: Session Persistence & Auto Reconnect](./TUTORIAL_3_SESSION_PERSISTENCE_&_AUTO_RECONNECT.md)** - To understand how to persist sessions

---

**Questions?** Open an issue or ask in [Telegram](https://t.me/lazorkit)