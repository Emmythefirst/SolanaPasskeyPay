# Tutorial 3: Session Persistence & Auto-Reconnect

This tutorial explains how LazorKit enables persistent passkey-based wallet sessions, allowing users to refresh the page or return later without reconnecting manually.

---

## What You'll Learn

- Why wallet sessions usually break on refresh
- How LazorKit restores wallets automatically
- How passkeys enable silent re-authentication
- Where session persistence logic lives
- Best practices for production apps

---

## What "Session Persistence" Means in LazorKit

Session persistence does **not** mean:
- "Private keys are stored"

It means:
- The user's wallet connection can be restored automatically

Instead:
- The wallet is reconnected using a passkey
- No seed phrases or extensions are involved
- The smart wallet address remains consistent
- The UX feels seamless and Web2-like

---

## Where the Session Logic Lives

All session persistence and auto-reconnect logic in this project is implemented in:

> `src/contexts/LazorKitAppContext.tsx`

This file:
• Configures LazorKit globally
• Restores sessions on app load
• initializes Paymaster and session restoration, not UI

---

## Why Session Persistence Matters

Without persistence:

• Reloading the page disconnects the wallet
• UX feels broken
• Users must re-authenticate
• Gasless mode must be re-initialized

With persistence:

• Wallet restores automatically
• No repeated FaceID prompts
• Paymaster mode is preserved

**Flow:**
```
User opens app
    ↓
LazorKit detects an existing session
    ↓
Passkey re-authenticates securely
    ↓
Smart wallet is restored
    ↓
App continues without interruption
```

---

## How Session Persistence Works in LazorKit

Session persistence is implemented using three core ideas:

1. App-level LazorKit configuration
2. Automatic reconnect on app load
3. Minimal session state tracking

All logic runs outside UI components.

---

## App-Level LazorKit Configuration

LazorKit is configured once using `LazorkitProvider`.

```typescript
<LazorkitProvider
  rpcUrl={LAZORKIT_CONFIG.rpcUrl}
  portalUrl={LAZORKIT_CONFIG.portalUrl}
  paymasterConfig={{
    paymasterUrl: LAZORKIT_CONFIG.paymasterUrl,
  }}
>
  <AutoConnectWrapper>
    {children}
  </AutoConnectWrapper>
</LazorkitProvider>
```
**NOTE:**
Solana RPC, LazorKit SDK configurations, and environment values are centralized in:
 `src/utils/constants.ts`

**What this configuration guarantee**
• One global LazorKit instance
• Consistent Paymaster configuration
• Passkey-based smart wallet
• Gasless routing explained in Tutorial 2
• Consistent wallet behaviour

---

## Automatic Session Restoration

Session restoration happens inside a small wrapper component.

```typescript
useEffect(() => {
  const restoreSession = async () => {
    const hasSession = localStorage.getItem('lazorkit_connected');

    if (hasSession && !isConnected && !wallet) {
      await connect({ feeMode: 'paymaster' });
    }
  };

  restoreSession();
}, [connect, isConnected, wallet]);
```

**What's happening here:**

| Field | Purpose |
|-------|---------|
| `hasSession` | Detects a previous connection |
| `connect({ feeMode: 'paymaster' })` | Restores wallet in gasless mode |
| Passkey | Handles authentication silently |

### Important clarification (now explicit)

✅ Sessions are always restored in Paymaster mode
✅ Gasless behavior is preserved across refreshes
✅ No extra configuration is needed after reconnect


---


## Re-Authentication Behavior (Very Important)

Passkeys allow conditional re-authentication.

**What usually happens**
• Same device
• Same browser
• Same passkey

➡️ No prompt shown
➡️ Wallet restores silently

**When re-authentication is required**
• Browser security policy
• OS update
• Device restart
• User explicitly logged out

➡️ User may see a FaceID / passkey prompt
➡️ Still no wallet extensions or seed phrases

This behavior is expected and secure.


---


## Tracking Connection State

The app tracks whether a wallet is connected using `localStorage`.

```typescript
useEffect(() => {
  if (isConnected && wallet) {
    localStorage.setItem('lazorkit_connected', 'true');
  } else {
    localStorage.removeItem('lazorkit_connected');
  }
}, [isConnected, wallet]);
```

**Important clarification:**

`localStorage` does **not** store keys or secrets.
It only stores a boolean flag indicating:
> "The user previously connected a wallet"

---


## Relationship to Wallet Readiness / Sponsor Logic

Although no transaction occurs during session restoration:

• The same wallet readiness rules apply
• The same USDC / ATA checks are reused later
• The same Paymaster assumptions are preserved

This means:

• Session restore does not bypass checks
• walletSponsor (renamed to readiness logic) is reused
• Payment flow remains deterministic and safe


---


## Why This Is Secure

This approach is secure because:
- Private keys are never exposed
- Passkeys remain device-bound
- Wallets are smart-contract based
- LazorKit controls session recovery

If session restoration fails:
- The flag is cleared
- The user simply reconnects manually
- No funds are ever at risk


---

## Best Practices

### ✅ Do's

- Use session persistence only at the app level
- Always reconnect using `feeMode: 'paymaster'`
- Keep wallet UI and session logic separate
- Handle reconnection failures gracefully
- Clear session flags on logout

### ❌ Don'ts

- Don't duplicate auto-connect logic in components
- Don't store sensitive data in localStorage
- Don't assume reconnection always succeeds
- Don't block app rendering on reconnection

---

## Testing Session Persistence

### Test Scenario 1: Normal Refresh

1. Connect wallet with passkey
2. Refresh the page (F5)
3. **Expected:** Wallet auto-restore in Paymaster mode

### Test Scenario 2: Close and Reopen Tab

1. Connect wallet
2. Close browser tab
3. Reopen same URL
4. **Expected:** Wallet restores automatically

### Test Scenario 3: Different Browser

1. Connect wallet in Chrome
2. Open app in Firefox
3. **Expected:** Manual connect required (different passkey)

### Test Scenario 4: Failed Reconnection

1. Connect wallet
2. Clear browser data
3. Refresh
4. **Expected:** Auto-reconnect fails gracefully

---

## Debugging Session Issues

### Check Session Flag

```typescript
// In browser console
localStorage.getItem('lazorkit_connected'); // Should return 'true' if connected
```

### Monitor Reconnection Attempts

```typescript
useEffect(() => {
  const restoreSession = async () => {
    console.log('Session restore attempt:', {
      hasSession: localStorage.getItem('lazorkit_connected'),
      isConnected,
      hasWallet: !!wallet
    });
    // ... rest of logic
  };
}, []);
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Reconnect fails silently | Network error | Add error logging |
| Infinite reconnect loop | Missing dependencies | Check useEffect deps |
| Session flag persists after disconnect | Not clearing localStorage | Add cleanup on disconnect |
| Different passkey on return | Device/browser changed | Expected behavior |

---


**Key principle:** Session management is a **global concern**, not a component concern.

---

## Summary

You have now seen how this repository implements persistent wallet sessions using LazorKit:

- App-level LazorKit configuration
- Passkey-based auto-reconnect
- No extensions or seed phrases
- Seamless refresh and return UX

---

## Next Steps

- Review [Tutorial 1: Passkey Wallet Setup](./TUTORIAL_1_PASSKEY_WALLET_SETUP.md) for initial connection flow
- Review [Tutorial 2: Gasless Transactions](./TUTORIAL_2_GASLESS_TRANSACTIONS.md) for fee sponsorship
- Explore [Tutorial 4: Payment Flow](./TUTORIAL_2_PAYMENT_FLOW.md) for end-to-end payment flow

---

**Questions?** Open an issue or ask in [Telegram](https://t.me/lazorkit)