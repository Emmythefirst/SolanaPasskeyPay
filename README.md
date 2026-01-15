# Solana Passkey Pay Starter 🚀

> **Superteam Vietnam Bounty Submission** - Starter template Solana payment integration with Lazorkit passkey authentication and gasless transactions


## 🌐 Live Demo

The demo application is live and deployed on Vercel:

🔗 https://solana-passkey-pay-starter.vercel.app

Network: Solana Devnet  
Deployment: Vercel (Vite + React)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Final Notes](#final-notes)
- [Security Consideration](#security-consideration)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)

---

## 🎯 Overview

This demo demonstrates how to build a **passwordless Solana payment system** using **LazorKit SDK** with **WebAuthn passkeys**. It eliminates the need for:

- ❌ Browser wallet extensions
- ❌ Seed phrase management
- ❌ Manual gas fee payments
- ❌ Complex onboarding flows

Instead, users authenticate with **FaceID /TouchID / Windows Hello** and transact instantly with **zero gas fees**.

### What Makes This Different?

| Traditional Solana Apps | This Implementation |
|------------------------|---------------------|
| Install Phantom/Solflare | No extensions needed |
| Manages seed phrases | Passkeys (hardware-backed) |
| Users handle gas | Gasless abstracted from UX |
| Complex UX | Seamless experience |

---


## 🧠 What You’ll Learn

By exploring this repository, developers will learn how to:

- Implement passkey-based Solana wallets using LazorKit
- Abstract gas fees using a Paymaster architecture
- Build USDC payment flows without browser wallets
- Persist sessions across reloads and devices
- Design a production-aligned Web3 UX


---


## 🧭 Learning Path

### For Beginners
1. Start with **Tutorial 1: Wallet Setup** 
2. Understand passkey authentication and smart wallets
3. Explore the demo store payment flow
4. Review DocsView for high-level architecture

### For Experienced Developers
1. Review `LazorKitAppContext.tsx` for global configuration
2. Study `PayWithUSDC` for transaction orchestration
3. Inspect `usdcWalletCheck.ts` for readiness gating
4. Adapt the architecture for mainnet deployment



---


## ✨ Features

### 🔐 **Passkey Authentication**
- Hardware-bound WebAuthn credentials
- FaceID / TouchID / Windows Hello support
- No seed phrases or private key exposure
- Phishing-resistant authentication

### ⚡ **Gasless / Gas Abstracted Transactions**
- Paymaster-style transaction routing
- Users do not manage or hold gas fee
- Gas is settled in SOL behind the scenes
- Production-aligned architecture

### 🎨 **Production-Ready UI**
- Drop-in `<PayWithSolana />` component
- Responsive dark theme
- Loading states and error handling
- Transaction history and analytics
- Explorer links

### 🔄 **Session Persistence**
- Auto-reconnect on page reload
- Seamless passkey experience
- No manual reconnection needed
- Session-safe wallet restoration

### 📊 **Demo Dashboard**
- Transaction history tracking
- Basic analytics
- Balance display
- Explorer integration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm**, **yarn**, or **pnpm**
- A Solana wallet address (merchant)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/solana-passkey-pay-starter.git
cd solana-passkey-pay-starter

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your merchant wallet address to .env
# VITE_MERCHANT_WALLET=your_solana_address_here

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app!

### First Transaction

1. Click **"Try Demo Store"**
2. Select any product
3. Click **"Pay with USDC"**
4. Authenticate with a passkey
5. ✅ Transaction completes with gas abstracted from the user(gasless!)

---

## 📁 Project Structure

```
solana-passkey-pay-starter/
│
├── 📁 docs/                        # 📚 Complete documentation
│   └── tutorials/
│       ├── TUTORIAL_1_WALLET_SETUP.md
│       ├── TUTORIAL_2_GASLESS_TRANSACTIONS.md
│       ├── TUTORIAL_3_SESSION_PERSISTENCE_&_AUTO_RECONNECT.md
│       └── TUTORIAL_4_PAYMENT_FLOW.md
│
└── 📁 public/                     # Static assets
|
├── 📁 src/                        # 💻 Source code
│   ├── 📁 components/             # Reusable React components
│   │   ├── PayWithUSDC/        # Main payment component
│   │   │   ├── index.tsx         # Component logic
│   │   │   ├── PaymentButton.tsx # Button subcomponent
│   │   │   └── PaymentStatus.tsx # Status display
│   │   ├── WalletButton.tsx      # Wallet connect button
│   │   ├── WalletPortfolio.tsx   # Wallet details modal
│   │   ├── Navigation.tsx        # Top navigation bar
│   │   ├── TransactionHistory.tsx # Transaction list
│   │   ├── AnalyticsDashboard.tsx # Analytics charts
│   │   └── LazorKitIcon.tsx      # Brand icon
│   │
│   ├── 📁 contexts/               # React contexts
│   │   └── LazorKitAppContext.tsx # Wallet state provider
│   │
│   ├── 📁 hooks/                  # Custom React hooks
│   │   ├── useTransactions.ts    # Transaction management
│   │
│   ├── 📁 types/                  # TypeScript definitions
│   │   └── index.ts              # All type exports
│   │
│   ├── 📁 utils/                  # Helper functions
│   │   ├── constants.ts          # Configuration
|   |   |── formatters.ts         # Data formatting 
│   │   └── usdcWalletCheck.ts         # Paymaster-style transaction readiness checks
│   │
│   ├── 📁 views/                 # Page components
│   │   ├── HomeView.tsx          # Landing page
│   │   ├── DemoStoreView.tsx     # Demo store
│   │   ├── HistoryView.tsx       # Transaction history
│   │   ├── AnalyticsView.tsx     # Analytics page
│   │   ├── DocsView.tsx          # Documentation page
│   │   └── Footer.tsx            # Footer component
│   │
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point (React bootstrap + polyfills)
│   └── index.css                 # Global styles
│
└── <> index.html                # Entry HTML                                
│
├── 📄 README.md                    # This file
├── 📄 package.json                 # Dependencies
├── 📄 tailwind.config.js          # Styling configuration
│── 📄 postcss.config.js          # PostCSS configuration for Tailwind CSS and browser compatibility
|── 📄 vite.config.ts             # Build configuration
```

---

## 🏗️ Architecture Overview

This Demo project follows a clean separation of concerns with three primary layers:

### 🧠 Core Logic Files

**These files contain the essential logic for wallet connection, gasless transactions, and session management.**

#### 1. **Wallet & Session Management**

**`src/contexts/LazorKitAppContext.tsx`** 🔑
- **Purpose:** App-level wallet configuration and session restoration
- **Key Features:**
  - Configures LazorKit SDK globally (RPC, Paymaster, Portal)
  - Implements automatic session restoration on page load
  - Manages wallet connection state across the entire app
  - Handles localStorage-based session tracking
  - Paymaster routing configuration
- **Used In:** `App.tsx`(Wraps the entire app at root level)
- **Tutorial Reference:** [Tutorial 1](./docs/tutorials/TUTORIAL_1_WALLET_SETUP.md), [Tutorial 3](./docs/tutorials/TUTORIAL_3_SESSION_PERSISTENCE_&_AUTO_RECONNECT.md)

**`src/components/WalletButton.tsx`** 🔌
- **Purpose:** User-initiated wallet connection and disconnection
- **Key Features:**
  - Handles `connect()` calls with passkey authentication
  - Monitors connection health and error states
  - Provides UI for connect/disconnect actions
  - Displays wallet status indicators
- **Used In:** Navigation bar
- **Tutorial Reference:** [Tutorial 1](./docs/tutorials/TUTORIAL_1_WALLET_SETUP.md)

#### 2. **Payment & gasless Transaction Logic**

**`src/components/PayWithUSDC/index.tsx`** 💳
- **Purpose:** Core payment execution component
- **Key Features:**
  - Creates USDC/Solana transfer instructions
  - Handles wallet connection flow
  - Executes gasless transactions via Paymaster
  - Manages payment states (idle, connecting, authenticating, success, error)
  - Provides success/error callbacks
- **Used In:** DemoStoreView.tsx (product cards)
- **Tutorial Reference:** [Tutorial 2](./docs/tutorials/TUTORIAL_2_GASLESS_TRANSACTIONS.md), [Tutorial 4](./docs/tutorials/TUTORIAL_4_PAYMENT_FLOW.md)


**`src/utils/usdcWalletCheck.ts`** 🧾

- **Purpose:**
Simulates Paymaster-style transaction readiness checks before a payment is attempted.
- **Key Features:**
- Verifies the smart wallet can perform a USDC payment
- Checks that the USDC associated token account (ATA) exists
- Confirms sufficient USDC balance
- Guides users to faucet when funding is required
- Prevents failed transactions before signing
- **What It Explicitly Does NOT Do:**
❌ Does not sponsor gas
❌ Does not send funds
❌ Does not convert USDC → SOL
❌ Does not interact with backend services

-**Used In:** PayWithUSDC/index.tsx (pre-payment validation)
Payment flow gating before transaction creation
**Tutorial Reference:** [Tutorial 4](./docs/tutorials/TUTORIAL_4_PAYMENT_FLOW.md), [Tutorial 2](./docs/tutorials/TUTORIAL_2_GASLESS_TRANSACTIONS.md)


**`src/hooks/useTransactions.ts`** 📊
- **Purpose:** Transaction state management
- **Key Features:**
  - Maintains transaction history
  - Adds new transactions to state
  - Calculates metrics (total volume, averages)
  - Provides transaction lookup by ID
- **Used In:** `App.tsx`

---

### 🎨 UI & View Layer

**These files handle presentation, layout, and user interaction without containing core business logic.**

#### 1. **View Components (Pages)**

**`src/views/HomeView.tsx`** 🏠
- **Purpose:** Landing page with features overview
- **Responsibilities:**
  - Displays hero section and value proposition
  - Shows feature cards and statistics
  - Provides installation instructions
  - Navigation to demo and docs
- **No Core Logic:** Pure presentation

**`src/views/DemoStoreView.tsx`** 🛍️
- **Purpose:** Product showcase and checkout demo
- **Responsibilities:**
  - Renders product grid
  - Displays product details and pricing
  - Integrates `PayWithSolana` component
  - Handles transaction success callbacks
- **Core Logic Delegation:** Payment logic handled by `PayWithUSDC`
- **Tutorial Reference:** [Tutorial 4](./docs/tutorials/TUTORIAL_4_PAYMENT_FLOW.md)

**`src/views/HistoryView.tsx`** 📜
- **Purpose:** Transaction history display
- **Responsibilities:**
  - Renders page layout
  - Passes transaction data to `TransactionHistory` component
- **No Core Logic:** Pure wrapper

**`src/views/AnalyticsView.tsx`** 📈
- **Purpose:** Analytics dashboard display
- **Responsibilities:**
  - Renders page layout
  - Passes transaction data to `AnalyticsDashboard` component
- **No Core Logic:** Pure wrapper

**`src/views/DocsView.tsx`** 📚
- **Purpose:** Documentation overview
- **Responsibilities:**
  - Displays developer guides
  - Shows integration flow
  - Links to detailed tutorials
- **No Core Logic:** Static content

**`src/views/Footer.tsx`** 🦶
- **Purpose:** Footer component
- **Responsibilities:**
  - Displays app branding and credits
- **No Core Logic:** Pure presentation

#### 2. **UI Components**

**`src/components/PayWithUSDC/PaymentButton.tsx`** 🔘
- **Purpose:** Payment button with state-aware UI
- **Responsibilities:**
  - Displays appropriate button text/icon based on state
  - Handles loading, success, and error states
  - Provides visual feedback during payment flow
- **No Core Logic:** Receives state as props

**`src/components/PayWithUSDC/PaymentStatus.tsx`** ✅
- **Purpose:** Payment status and feedback display
- **Responsibilities:**
  - Shows transaction confirmation
  - Displays explorer links
  - Renders error messages
  - Shows gasless badge
- **No Core Logic:** Pure presentation

**`src/components/TransactionHistory.tsx`** 📋
- **Purpose:** Transaction list with details
- **Responsibilities:**
  - Renders transaction cards
  - Displays status indicators
  - Shows transaction details
  - Provides explorer links
- **No Core Logic:** Receives data as props

**`src/components/AnalyticsDashboard.tsx`** 📊
- **Purpose:** Analytics metrics display
- **Responsibilities:**
  - Calculates metrics from transaction data
  - Renders stat cards
  - Shows transaction breakdown by status
- **Minor Logic:** Calculations for display purposes only

**`src/components/WalletPortfolio.tsx`** 💼
- **Purpose:** Wallet details modal
- **Responsibilities:**
  - Displays wallet address and balance
  - Shows disconnect option
  - Links to explorer
  - Fetches balance for display
- **Minor Logic:** Balance fetching for UI only

**`src/components/Navigation.tsx`** 🧭
- **Purpose:** Top navigation bar
- **Responsibilities:**
  - Renders navigation links
  - Handles view switching
  - Displays wallet button
- **No Core Logic:** Pure layout

**`src/components/LazorKitIcon.tsx`** 🎨
- **Purpose:** Brand icon component
- **Responsibilities:**
  - Renders LazorKit logo
- **No Core Logic:** Pure visual element

---

### 🛠️ Utilities

**These files provide reusable helper functions and configuration.**

**`src/utils/constants.ts`** ⚙️
- **Purpose:** Centralized configuration
- **Contains:**
  - Solana network RPC URLs
  - LazorKit SDK configuration (Portal, Paymaster)
  - App metadata
  - Merchant wallet address
  - Explorer URL templates
- **Usage:** Imported throughout the app for consistent configuration
- **Tutorial Reference:** All tutorials reference these constants

**`src/utils/formatters.ts`** 🔧
- **Purpose:** Data formatting utilities
- **Functions:**
  - `formatAddress()` - Shortens wallet addresses
  - `formatAmount()` - Formats numbers with decimals
  - `formatDate()` - Converts dates to readable strings
  - `formatCurrency()` - Formats amounts with currency
  - `getExplorerUrl()` - Generates Solana Explorer links
- **Usage:** Used in components for consistent data display

**`src/types/index.ts`** 📝
- **Purpose:** TypeScript type definitions
- **Defines:**
  - `Transaction` - Transaction object structure
  - `WalletInfo` - Wallet data structure
  - `Product` - Product/subscription data
  - `AnalyticsData` - Analytics metrics
- **Usage:** Ensures type safety across the app

---

### 🔄 Data Flow Summary

```
User Action (View)
    ↓
UI Component
    ↓
LazorKit SDK
    ↓
Paymaster Pipeline
    ↓
Solana Network (SOL gas settlement)
    ↓
State Update
    ↓
UI Feedback    
```

**Key Principles:**
- ✅ Views never call Solana APIs directly
- ✅ Components delegate core logic to hooks and contexts
- ✅ Utilities provide pure functions without side effects
- ✅ Configuration is centralized in constants

---

## 📚 Documentation

### Step-by-Step Tutorials

1. **[Tutorial 1: Wallet Setup](./docs/tutorials/TUTORIAL_1_WALLET_SETUP.md)**

2. **[Tutorial 2: Gasless Transactions](./docs/tutorials/TUTORIAL_2_GASLESS_TRANSACTIONS.md)**

3. **[Tutorial 3: Session Persistence & Auto Reconnect](./docs/tutorials/TUTORIAL_3_SESSION_PERSISTENCE_&_AUTO_RECONNECT.md)**

4. **[Tutorial 4: Payment Flow](./docs/tutorials/TUTORIAL_4_PAYMENT_FLOW.md)**

**Each tutorial explains:**
- What happens
- Why it exists
- How it maps to real production systems


---

## 🛠️ Tech Stack

### Core Technologies
- **[React 19](https://react.dev/)** - UI framework
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling

### Blockchain
- **[@lazorkit/wallet](https://docs.lazorkit.com)** - Passkey wallet SDK
- **[@solana/web3.js](https://solana-labs.github.io/solana-web3.js/)** - Solana blockchain interaction

### UI Components
- **[lucide-react](https://lucide.dev/)** - Icon library
- **React Portal** - Modal management

---

## ⚙️ Environment Setup

### NOTE
This project uses Vite and includes Node.js polyfills to ensure compatibility
with Solana and LazorKit SDKs in the browser.

Some Web3 dependencies expect Node globals such as `Buffer`, `process`, and
`global`, which are not available in browsers by default.

These are handled automatically via:
- `vite.config.ts` (build-time polyfills)
- `main.tsx` (runtime safety polyfills)

No additional setup is required — this is already configured.


Create a `.env` file in the project root:

```env
# Solana Configuration (Devnet)
VITE_SOLANA_NETWORK=devnet
VITE_RPC_URL=https://api.devnet.solana.com

# LazorKit Configuration
VITE_PORTAL_URL=https://portal.lazor.sh
VITE_PAYMASTER_URL=https://kora.devnet.lazorkit.com

# Merchant Wallet (Replace with your actual wallet)
VITE_MERCHANT_WALLET=your_wallet_address
```

---

## 💻 Development

### Available Scripts

```bash
# Start development server (hot reload enabled)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

### Development Workflow

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Make changes to source files** - Vite will auto-reload

3. **Test your changes** in the browser

4. **Check for type errors:**
   ```bash
   npm run type-check
   ```

5. **Lint your code:**
   ```bash
   npm run lint
   ```

---

## 🧪 Testing

### Manual Testing Checklist:

#### Passkey Wallet Creation

### Session Auto-Restore

### Transaction Submission

#### Explorer verification

#### UX Feedback Correctness

### Testing on Different Browsers

| Browser | Passkey Support | Status |
|---------|----------------|--------|
| Chrome 108+ | ✅ Full support | Recommended |
| Safari 16+ | ✅ Full support | Recommended |
| Firefox 119+ | ✅ Full support | Supported |
| Edge 108+ | ✅ Full support | Supported |

### Device Testing

- **macOS**: TouchID authentication
- **iOS**: FaceID authentication
- **Windows**: Windows Hello
- **Android**: Fingerprint/Face unlock

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel:**
   ```bash
   # Or use Vercel CLI
   npm i -g vercel
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - `VITE_MERCHANT_WALLET`
   - (Optional) Other environment variables

4. **Deploy!** Your app will be live at `your-project.vercel.app`


### Production Notes

⚠️ **Important:** When deploying to production:

1. Update RPC `mainnet`
2. Use a real Paymaster treasury
3. Users still hold zero SOL
4. Fees are settled via sponsor treasury

---

## 🔐 Security Considerations

• Passkeys are hardware-backed
• Private keys never leave the device
• No custom Solana programs
• Fees are settled via sponsor treasury

### Best Practices
- Always validate merchant wallet addresses
- Never store private keys or seeds
- Use HTTPS in production
- Implement rate limiting on backend
- Monitor transaction patterns

---

## Final Notes

This repository is intentionally: 
• Well-commented
• Beginner-readable
• Production-aligned
• Honest about protocol realities

Gas abstraction is demonstrated correctly, not magically.

Designed to be forked, learned from, and shipped.

---


## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

Open an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device information

### Suggesting Features

Open an issue with:
- Feature description
- Use case / problem it solves
- Proposed implementation (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests (if applicable)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add JSDoc comments to new functions
- Update documentation for new features
- Test on multiple browsers
- Keep commits focused and exclusive


---


## 💬 FAQ

### Q: Do users need SOL?

**No.**
Users do not manage or hold SOL.
Gas is abstracted via Paymaster architecture.

### Q: Is gas paid in USDC?

**No.**
Solana always charges gas in SOL.
USDC is used only as a payment asset, not a gas token.

### Q: Why do some wallets show small SOL on devnet?

Devnet wallets may receive small SOL amounts from faucet behavior.
This is not relied upon and not representative of mainnet economics.

### Q: Can this run on mainnet?

**Yes** 
With a real sponsor treasury and mainnet Paymaster configuration.

### Q: Do users need SOL to make payments?

**No!** 
With gasless mode enabled (default), the paymaster sponsors all transaction fees. Users only need the amount they're paying (e.g., 0.1 USDC for a 0.1 USDC purchase).

### Q: Are passkeys secure?

**Yes!** 
Passkeys use public-key cryptography with private keys stored in hardware (Secure Enclave). They're more secure than passwords and resistant to phishing.


### Q: How do I get testnet/devnet USDC?

Visit [Faucet Circle](https://faucet.circle.com/) and request devnet SOL using your smart wallet address.

### Q: What happens if a user loses their device?

Passkeys can be synced across devices using iCloud Keychain (Apple) or Google Password Manager (Android). Users can also set up account recovery mechanisms.



---


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.


---


## 🙏 Acknowledgments

- **LazorKit Team** - For the amazing passkey SDK
- **Superteam Vietnam** - For organizing the bounty
- **Solana Foundation** - For passkey support in validators
- **WebAuthn Community** - For the authentication standard

---


## 📞 Support & Resources

### Documentation
- **LazorKit Docs**: [https://docs.lazorkit.com](https://docs.lazorkit.com)
- **Solana Docs**: [https://docs.solana.com](https://docs.solana.com)
- **WebAuthn Guide**: [https://webauthn.guide](https://webauthn.guide)

### Community
- **Telegram**: [https://t.me/lazorkit](https://t.me/lazorkit)
- **Discord**: [Solana Discord](https://discord.gg/solana)
- **Twitter**: [@lazorkit](https://twitter.com/lazorkit)

### Issues & Feedback
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/repo/issues)


---

**Built with ❤️ for Superteam Vietnam Bounty by Emmy**

*Questions? Open an issue or reach out on [Telegram](https://t.me/lazorkit)!*