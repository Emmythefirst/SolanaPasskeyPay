# Tutorial 2: Implementing Gasless Transactions

This tutorial explains how LazorKit enables **gasless Solana transactions** using a Paymaster model, allowing users to transact without holding SOL for gas.

---

## What You'll Learn

- How "gasless" actually means on Solana
- What a Paymaster is and why it matters
- How LazorKit abstracts gas from users
- The core pattern for sending gasless transactions
- what feeMode: 'paymaster' and feeToken really do
- How this project models production gasless architecture on devnet

---

## What "Gasless" Means In This Demo

A gasless transaction means:

✅ Users does not need SOL
✅ Users never manages gas
✅ Users signs with a passkey only — no wallet extension, no seed phrase

It does not mean:

• ❌ Fees do not exist
• ❌ Gas is paid in USDC at the protocol level
• ❌ Transactions are off-chain

Solana always charges fees in SOL.
Gasless UX is about who pays, not about what token Solana uses.

---


## Traditional Solana Fee Model (Baseline)

Normally:

• User wallet holds SOL
• User pays fees directly
• Transactions fail if SOL runs out

This creates major UX friction:

• Users must buy SOL
• Users must understand gas
• First-time users often fail before paying

---

## LazorKit’s Gasless / Gas Abstraction Model

LazorKit introduces fee abstraction via a Paymaster-style flow.

Instead of:

```sql
User → Pays SOL → Pays fees → Network
```

We get:

```sql
User → Signs → Paymaster handles fees → Network
```

• Fees are abstracted from the user
• Gas is still settled in SOL
• The Paymaster architecture decides how fees are covered 

---

## Where This Logic Lives 

| File                      | Role                                  |
| ------------------------- | ------------------------------------- |
| `PayWithUSDC/index.tsx` | Builds and sends payment transactions |
| `usdcWalletCheck.ts`        | Models sponsorship rules and intent   |
| `PaymentButton.tsx`       | User interaction                      |
| `PaymentStatus.tsx`       | UX feedback                           |
| LazorKit SDK              | Smart wallet + paymaster interface    |


**NOTE:**
• Explorer links are centralized in `src/utils/constants.ts`
• `src/utils/usdcWalletCheck.ts` does not fund gas. It prepares the wallet exactly as a real Paymaster would require by mirroring real backend sponsor logic without exposing private keys or funding. Go to → TUTORIAL_4_PAYMENT-FLOW.md to understand the logic better


---


## USDC Is the Payment Asset

This project uses USDC as the primary payment token.

• USDC (SPL Token)
• Devnet mint
• Associated Token Accounts (ATA)
• SOL as gas asset.


### ATA Creation (Critical Step)

Before transferring USDC:

• Sender ATA must exist
• Recipient ATA must exist

The app correctly:

• Checks merchant ATA
• Creates it if missing
• Then transfers USDC

This logic lives in:
`components/PayWithUSDC/index.tsx`

### Important Devnet Reality

There is no automatic USDC faucet on-chain.

Users must:

• Request devnet USDC from Circle faucet
• Hold enough USDC to pay the merchant


---


## How Gasless Transactions Work in LazorKit

Gasless behavior in LazorKit is enabled through the `transactionOptions.feeToken` field.

When a fee token is specified, LazorKit routes the transaction through a Paymaster that sponsors the network fees.

```typescript
await signAndSendTransaction({
  instructions,
  transactionOptions: {
    feeToken: 'USDC',
    computeUnitLimit: 300_000
  }
});
```

---

## Core Gasless Transaction Pattern

Below is the **only function you need to understand** to implement gasless transactions.

```typescript
async function sendGaslessTransfer({
  instructions,
  signAndSendTransaction,
  recipient
}) {
  let instruction; // Normal SOL or USDC instruction

  return await signAndSendTransaction({
    instructions: [instruction], // USDC ATA creation + USDC transfer
    transactionOptions: {
      feeToken: 'USDC',          // Paymaster sponsors fees
      computeUnitLimit: 300_000  // Max amount of compute(safe for ATA creation + transfer)
    }
  });
}
```

**NOTE** 
• USDC is the payment asset in this demo so we use SPL instructions → createUSDCInstructions(...)
• If SOL was the primary asset, we use standard Solana instruction → SystemProgram.transfer(...)

---

## Minimal Gasless Transaction Example

### Step 1: Access LazorKit Wallet APIs

```typescript
import { useWallet } from '@lazorkit/wallet';
```

Inside the component:

```typescript
const { connect, smartWalletPubkey, signAndSendTransaction } = useWallet();
```

**Key points:**
- LazorKit uses a hook-first API
- There is no WalletProvider wrapper needed
- `smartWalletPubkey` represents the user's smart wallet address

---

### Step 2: Connect with Paymaster Mode

```typescript
await connect({ feeMode: 'paymaster' });
```

This is critical.

By setting `feeMode: 'paymaster'`:
- The wallet is initialized in gasless mode
- LazorKit knows fees should be sponsored

---

### Step 3: Create a SOL Transfer Instruction

Gasless transactions work with normal Solana instructions.
The instruction can be any valid transfer (USDC, SOL, or others).

In this project, the primary demo uses USDC (SPL token transfers).

```typescript
const instruction = createUSDCTransferInstruction({
  from: smartWalletPubkey,
  to: merchantPubkey,
  amount: usdcAmount
});
```

**Key points:**

• This is a standard SPL Token instruction
• Nothing here is “gasless” yet
• No fees are paid at this stage
• Gas abstraction happens only at send time

The exact instruction implementation lives in
`src/components/PayWithUSDC/index.tsx`

**Important clarification:**
Although this demo uses USDC, the same gasless pattern applies to native SOL transfers as well.

---

### Step 4: Send a Gasless Transaction

This is the most important part:

```typescript
const sig = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: 'USDC',
    computeUnitLimit: 300_000
  }
});
```

**What's happening here:**

| Field | Purpose |
|-------|---------|
| `instructions` | Activates Solana/SPL Token instructions(SPL in this demo) |
| `feeToken: 'USDC'` | Enables Paymaster-style fee abstraction |
| `computeUnitLimit` | Ensure reliable execution for Paymaster flows |

Because `feeToken` is set:
- The user does not need SOL
- Transaction Fees are paid using USDC
- LazorKit handles sponsorship(modeled on devnet in this project)

### ⚠️ Important devnet clarification

• Solana network fees are still settled in SOL
• On devnet, this demo models Paymaster behavior
• Minimal SOL may be pre-funded automatically for wallet viability(ATA) → (See TUTORIAL 4 for full explanation)
• The architecture is identical to a real mainnet Paymaster setup

---

## SOL vs USDC — Important Clarification

This is intentional and correct.

| Role | Asset |
|------|-------|
| Asset being sent | USDC |
| Asset used for gas | SOL |
| Who pays gas | LazorKit Paymaster(modeled on devnet) |

**Gasless refers to fee payment, not the transferred token.**

---


## Key Clarification: Sponsorship vs Simulation

This project uses Paymaster-modeled architecture, meaning:

| Aspect                      | Behavior                     |
| --------------------------- | ---------------------------- |
| Wallet type                 | Smart wallet (passkey-based) |
| Fee abstraction             | USDC specified               |
| Paymaster path              | Enabled                      |
| Actual gas funding (devnet) | Simulated / fallback         |


---




## Summary

You have now seen how this repository implements true gasless transactions using LazorKit:

- Passkey-based smart wallets
- Paymaster integration + routing
- USDC transfers without SOL gas
- Clean, hook-based integration

This demo models a production-grade Paymaster architecture.
On devnet: 
Users fund USDC via faucets.
USDC is used for payment, while SOL gas is abstracted and handled automatically via LazorKit’s Paymaster architecture.
In production, a backend sponsor wallet would cover fees.


---

## Next Steps

- Review [Tutorial 1:Passkey Wallet Setup](./TUTORIAL_1_PASSKEY_WALLET_SETUP.md) to understand wallet connection
- Explore [Tutorial 3: Session Persistence And Auto Reconnect](./TUTORIAL_3_SESSION_PERSISTENCE_AND_AUTO_RECONNECT.md) to understand how to persist sessions

---

**Questions?** Open an issue or ask in [Telegram](https://t.me/lazorkit)