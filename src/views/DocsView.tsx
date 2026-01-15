/**
 * DocsView.tsx
 * 
 * Documentation and overview page for developers.
 * Explains what LazorKit is, how it works, and where to find detailed guides.
 * 
 * This is a simplified overview - full docs are in the /docs folder.
 */

import { CheckCircle, ArrowRight, BookOpen, Code2 } from 'lucide-react';

export function DocsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Header */}
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-white">Developer Overview</h1>
        <p className="text-xl text-gray-400">
          A practical walkthrough of LazorKit integration
        </p>

        {/* Note about full documentation location */}
        <p className="text-gray-500 text-sm">
          Full developer documentation available in the <code className="font-mono">/docs</code> folder.
        </p>
      </header>

      {/* What this demo shows */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">What It Covers</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Real integration example */}
          <InfoCard
            icon={<Code2 size={20} />}
            title="Real Integration"
            description="A real-world example of LazorKit passkey wallets and gasless Solana transactions."
          />

          {/* Card 2: Starter template */}
          <InfoCard
            icon={<BookOpen size={20} />}
            title="Starter Reference"
            description="Designed to be forked, studied, and reused as a starter template."
          />
        </div>
      </section>
      
      {/* ==================== HIGH-LEVEL FLOW ==================== */}
      {/* Step-by-step explanation of how the authentication and 
      payment flow works from a technical perspective.
        */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">High-Level Flow</h2>

        <ol className="space-y-4 text-gray-300">
          {/* Step 1: Authentication */}
          <li className="flex gap-3">
            <ArrowRight className="text-orange-400 mt-1" size={18} />
            User authenticates using a WebAuthn passkey (FaceID / TouchID)
          </li>

          {/* Step 2: Wallet derivation */}
          <li className="flex gap-3">
            <ArrowRight className="text-orange-400 mt-1" size={18} />
            LazorKit derives and manages a smart wallet PDA
          </li>

          {/* Step 3: Transaction execution */}
          <li className="flex gap-3">
            <ArrowRight className="text-orange-400 mt-1" size={18} />
            Transactions are signed and sent with optional gas sponsorship
          </li>

          {/* Step 4: User experience */}
          <li className="flex gap-3">
            <ArrowRight className="text-orange-400 mt-1" size={18} />
            Users never install extensions or manage seed phrases
          </li>
        </ol>
      </section>

      {/* ==================== KEY FEATURES ==================== */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Key Features</h2>

        <ul className="space-y-3 text-gray-300">
          {/* Feature 1: Passkey auth */}
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <span>WebAuthn passkey authentication (no seed phrases)</span>
          </li>

          {/* Feature 2: Gasless transactions */}
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <span>Gasless transactions via Paymaster sponsorship</span>
          </li>

          {/* Feature 3: Smart wallets */}
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <span>Smart wallet PDAs with recovery and policy support</span>
          </li>

          {/* Feature 4: UI components */}
          <li className="flex items-start gap-3">
            <CheckCircle className="text-green-400 mt-1" size={20} />
            <span>Drop-in “Pay with Solana” UI component</span>
          </li>
        </ul>
      </section>

      {/* ==================== TUTORIALS ==================== */}
      <section className="space-y-6">
       <h2 className="text-3xl font-bold text-white">Tutorials</h2>

        <p className="text-gray-400 max-w-2xl">
         These step-by-step guides walk through real LazorKit usage,
         from passkey wallet creation to sending USDC without users
         managing keys or gas.
       </p>

      <div className="grid md:grid-cols-2 gap-6">
       <TutorialCard
         title="Passkey Wallet Setup"
         description="Create and authenticate a Solana wallet using WebAuthn passkeys (FaceID / TouchID) with no seed phrases."
         href="https://github.com/YOUR_REPO/docs/passkey-wallet.md"
       />

        <TutorialCard
          title="Gasless Payments"
          description="Send USDC on Solana using LazorKit with gas abstracted away for the end user."
          href="https://github.com/YOUR_REPO/docs/gasless-usdc.md"
        />

        <TutorialCard
          title="Session Pesistence"
          description="See how LazorKit enables persistent passkey-based wallet sessions"
          href="https://github.com/YOUR_REPO/docs/gasless-usdc.md"
        />

        <TutorialCard
          title="Demo Payment Flow"
          description="Real-world Solana payment flow using LazorKit"
          href="https://github.com/YOUR_REPO/docs/gasless-usdc.md"
        />
       </div>
      </section>


      {/* ==================== NEXT STEPS ==================== */}
      {/* 
        Directs developers to additional resources for deeper learning.
        Points to the /docs and /examples folders.
      */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Explore Further</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* External LazorKit docs */}
          <ResourceCard
            title="📘 LazorKit Documentation"
            description="Official LazorKit docs covering APIs, SDKs, and architecture."
            href="https://docs.lazorkit.xyz"
          />
        </div>
      </section>
    </div>
  );
}

/* ---------- HELPER COMPONENTS ---------- */


/**
 * InfoCard Component
 * 
 * Small card highlighting a key point about the demo.
 * Used in the "What It Covers" section.
 */
function InfoCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-elevated rounded-xl p-6 space-y-3">
      {/* Icon with orange accent color */}
      <div className="text-orange-400">{icon}</div>

      {/* Card title */}
      <h3 className="text-white font-semibold text-lg">{title}</h3>

      {/* Card description */}
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}


/**
 * ResourceCard Component
 * 
 * Card pointing to additional documentation resources.
 * Used in the "Explore Further" section.
 */
function ResourceCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="card-elevated rounded-xl p-6 space-y-2 hover:opacity-90 transition"
    >
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </a>
  );
}



/**
 * TutorialCard Component
 *
 * Clickable card linking to a full step-by-step tutorial
 * hosted in the GitHub /docs folder.
 */
function TutorialCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="card-elevated rounded-xl p-6 space-y-3 hover:opacity-90 transition"
    >
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <span className="text-orange-400 text-sm inline-flex items-center gap-1">
        Read tutorial <ArrowRight size={14} />
      </span>
    </a>
  );
}

