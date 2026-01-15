# Tutorial 1: Wallet Setup & Passkey Authentication

In this tutorial, we explain how this app connects a user using LazorKit passkeys and automatically initializes a smart wallet.

**Important:** There is no manual wallet creation step. The wallet is created implicitly when the user connects for the first time.

This tutorial references actual implementation files in this repository.

---

## What This Tutorial Covers

This tutorial focuses on:

- Passkey-based wallet connection
- Automatic smart wallet initialization
- Gasless-ready wallet sessions

---


## What Is a LazorKit Smart Wallet?

A LazorKit smart wallet is:

• 🔐 Controlled by a passkey (WebAuthn)
• 🧠 Backed by device hardware (Secure Enclave / TPM)
• 🚫 No seed phrase
• 🚫 No browser wallet extension

Authentication uses:

• FaceID / TouchID (Apple)
• Windows Hello
• Android biometrics


---


## Where the Wallet Logic Lives

The wallet connection and initialization logic is implemented in:

> `src/components/WalletButton.tsx`  → User-initiated connect / disconnect
> `src/contexts/LazorKitAppContext.tsx`  → App-level configuration + session restore
> `src/utils/constants.ts` → RPC, Paymaster and app configuration

Additional wallet state usage and UI appears in:

> `src/components/WalletPortfolio.tsx`

**Note:** 
• The useWallet() hook is responsible for LazorKit SDK interface
• There is no separate wallet creation file — wallet creation is handled internally by LazorKit during connection.

---

## Step 1: Importing the LazorKit Wallet Hook

The wallet system is accessed using LazorKit's `useWallet` hook:

```typescript
import { useWallet } from '@lazorkit/wallet';
```

This hook provides all wallet-related state and actions used throughout the app.

---

## Step 2: Initializing Wallet State

Inside the wallet button component, the hook is initialized:

```typescript
const {
  connect,
  disconnect,
  isConnected,
  isConnecting,
  wallet,
  smartWalletPubkey,
} = useWallet();
```

At this stage:
- No passkey has been created yet
- No smart wallet exists yet
- The user is not connected

Everything begins when `connect()` is called.

---

## Step 3: Connecting With Passkeys (Wallet Creation Happens Here)

Wallet creation happens implicitly through this call:

```typescript
await connect({
  feeMode: 'paymaster',
});
```

This single call is responsible for:
- Triggering passkey authentication
- Creating or restoring a smart wallet
- Establishing a session
- Preparing the wallet for gasless transactions

### What Happens Under the Hood

**On first connection**, LazorKit:
1. Prompts the user to create or approve a passkey
2. Generates WebAuthn credentials
3. Initializes a smart wallet
4. Links the passkey to that wallet
5. Stores the wallet for future sessions

**On subsequent connections**:
1. The existing passkey is reused
2. The same smart wallet is restored
3. No new wallet is created

This mirrors the user experience described in Tutorial 3 (Session Persistence).

---

## Step 4: Enabling Gasless Transactions by Default

The connection uses:

```typescript
feeMode: 'paymaster'
```

This ensures:
- Transaction fees are sponsored
- Users do not need SOL to interact
- The wallet is immediately usable for gasless transfers

This setup ensures the wallet is compatible with Paymaster-based fee abstraction in Tutorial 2.

---

## Step 5: Connection State Management

Connection state is driven by LazorKit flags:

```typescript
isConnecting  // Boolean: Connection in progress?
isConnected   // Boolean: Wallet connected?
```

These are used to:
- Disable actions while connecting
- Prevent duplicate wallet creation
- Control UI loading states

This ensures the wallet is fully ready before transactions are initiated.

### Example Usage

```typescript
if (isConnecting) {
  return Connecting...;
}

if (isConnected) {
  return Disconnect;
}

return <button onClick={() => connect({ feeMode: 'paymaster' })}>
  Connect Wallet
  </button>
;
```

---

## Step 6: Smart Wallet Address Usage

Once connected, the app uses:

```typescript
smartWalletPubkey
```

This value represents the actual smart wallet address.

It is used later in Tutorial 2 as:
- `fromPubkey` in transactions
- The sender for gasless payments
- The wallet identity for signing

### ⚠️ Important

`wallet.publicKey` is not used for transactions in this app. Always use `smartWalletPubkey` instead.

### Example

```typescript
  SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,  // ✅ Correct
  toPubkey: recipientAddress,
  lamports: amount
});
```

---


## Step 8: Disconnecting the Wallet

Wallet disconnection is handled via:

```typescript
await disconnect();
```

**Disconnecting:**
- Ends the active session
- Does not remove the passkey
- Does not destroy the smart wallet

Reconnecting later restores the same wallet automatically.

### Complete Disconnect Example

```typescript
const handleDisconnect = async () => {
  try {
    await disconnect();
    localStorage.removeItem('lazorkit_connected');
    console.log('Wallet disconnected');
  } catch (error) {
    console.error('Disconnect failed:', error);
  }
};
```

---

## How This Enables Tutorial 2

By the end of this tutorial:

- ✅ The user has a passkey-backed smart wallet
- ✅ The wallet supports gasless transactions
- ✅ The wallet address is accessible via `smartWalletPubkey`
- ✅ The wallet can sign and send transactions

This setup is directly used in Tutorial 2 to perform gasless SOL and USDC transfers..


---

## Testing the Wallet Setup

### Test Scenario 1: First-Time Connection

1. Click "Connect Wallet"
2. Browser shows passkey creation prompt
3. Authenticate with FaceID/TouchID
4. **Expected:** Wallet connects, address displays
5. **Result:** Smart wallet created and ready

### Test Scenario 2: Returning User

1. Refresh the page
2. **Expected:** Wallet auto-reconnects (see Tutorial 3)
3. **Result:** Same wallet address appears

### Test Scenario 3: Manual Reconnect

1. Click "Disconnect"
2. Click "Connect Wallet" again
3. Authenticate with existing passkey
4. **Expected:** Same wallet address restored
5. **Result:** No new wallet created

### Test Scenario 4: Different Device

1. Connect wallet on Device A
2. Try to connect on Device B
3. **Expected:** New passkey required
4. **Result:** Different wallet address (passkeys are device-specific)

---

## Troubleshooting

### Issue: Passkey Creation Fails

**Causes:**
- Not using HTTPS (required for WebAuthn)
- Browser doesn't support passkeys
- User cancelled prompt

**Solutions:**
- Use HTTPS or localhost
- Try Chrome/Safari (best support)
- Guide user through prompt

### Issue: Wallet Not Persisting

**Cause:** Session restoration not working

**Solution:** Check [Tutorial 3: Session Persistence & Auto Reconnect](./TUTORIAL_4_SESSION_PERSISTENCE_&_AUTO_RECONNECT.md)

### Issue: Wrong Wallet Address

**Cause:** Using `wallet.publicKey` instead of `smartWalletPubkey`

**Solution:** Always use `smartWalletPubkey` for transactions

---

## Summary

This tutorial explained how:

- ✅ Wallet connection and creation happen in one step
- ✅ Passkeys replace seed phrases
- ✅ Smart wallets are created automatically
- ✅ Gasless transactions are enabled at connection time
- ✅ Wallet state is shared across the app

With this foundation in place, the app can safely perform gasless payments.

---

## Next Steps

- **[Tutorial 2: Gasless Transactions](./TUTORIAL_2_GASLESS_TRANSACTIONS.md)** - Implement fee sponsorship


---

**Questions?** Open an issue or ask in [Telegram](https://t.me/lazorkit)