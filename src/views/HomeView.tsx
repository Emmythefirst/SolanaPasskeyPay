/**
 * HomeView.tsx
 * 
 * Landing page component for the LazorKit Pay application.
 * Displays hero section, features, stats, and installation instructions.
 */


import React from 'react';
import { 
  Zap, Fingerprint, Wallet, CheckCircle, 
  Shield, Sparkles 
} from 'lucide-react';

// Props for the HomeView component
interface HomeViewProps {
  setView: (view: 'demo' | 'docs') => void;
}

export function HomeView({ setView }: HomeViewProps) {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-16">
        {/* Passkey Pay Starter Template badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-20 rounded-full text-blue-400 text-sm font-semibold mb-4">
          <Sparkles size={16} />
          Gasless Pay Starter Template
        </div>
        
        {/* Main headline */}
        <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
          Next-Gen
          <span className="block gradient-orange mt-2">
            Solana Payments
          </span>
        </h1>
        
        {/* Subheadline */}
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Production-ready payment component with passkey authentication. No seed phrases, no extensions.
        </p>
        
        {/* Call-to-action buttons */}
        <div className="flex gap-4 justify-center mt-10">
          {/* Primary CTA: Try the demo */}
          <button
            onClick={() => setView('demo')}
            className="px-8 py-4 bg-gradient-to-r from-white-500 to-white-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-200 transform hover:scale-105 hover:-translate-y-1"
          >
            Try Demo Store
          </button>

          {/* Secondary CTA: View documentation */}
          <button
            onClick={() => setView('docs')}
            className="px-8 py-4 bg-white bg-opacity-5 backdrop-blur-md border border-white border-opacity-10 text-white font-semibold rounded-xl hover:bg-opacity-10 transition-all duration-200"
          >
            View Documentation
          </button>
        </div>
      </section>

      {/* Stats Section*/}
      <section className="grid md:grid-cols-4 gap-6">
        <StatCard icon={<Zap className="text-orange-400" />} value="< 2s" label="Transaction Time" />
        <StatCard icon={<Wallet className="text-green-400" />} value="$0" label="Gas Fees" />
        <StatCard icon={<Fingerprint className="text-blue-400" />} value="100%" label="Secure" />
        <StatCard icon={<CheckCircle className="text-purple-400" />} value="10+" label="Features" />
      </section>

      {/* Features Section*/}
      <section className="grid md:grid-cols-3 gap-8">
        {/* Feature 1: Passkey Authentication */}
        <FeatureCard
          icon={<Fingerprint className="text-blue-400" size={28} />}
          title="Passkey Authentication"
          description="Hardware-bound WebAuthn credentials in Secure Enclave"
          features={["FaceID / TouchID", "No seed phrases", "Phishing-resistant"]}
          accentColor="blue"
        />
        {/* Feature 2: Gasless Transactions */}
        <FeatureCard
          icon={<Zap className="text-orange-400" size={28} />}
          title="Gasless Transactions"
          description="Paymaster pays network fees for better UX"
          features={["Pay fees in USDC", "Auto sponsorship", "Higher conversion"]}
          accentColor="orange"
        />
        {/* Feature 3: Smart Wallet PDAs */}
        <FeatureCard
          icon={<Shield className="text-purple-400" size={28} />}
          title="Smart Wallet PDAs"
          description="On-chain PDAs with recovery and policies"
          features={["Account recovery", "Spending limits", "Session keys"]}
          accentColor="purple"
        />
      </section>

      {/* Installation Section - Simplified */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-white">Build passwordless Solana experiences today.</h2>
          <p className="text-gray-400 text-lg">Ship a passkey-controlled smart wallet in minutes.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">

            {/* Left Column: Installation commands */}
            <div className="card-elevated rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Install the SDK</h3>

              {/* Primary installation method (npm) */}
              <div className="bg-[#0d1117] rounded-xl p-4 border border-white border-opacity-5 flex items-center justify-between group">
                <code className="text-sm font-mono">
                  <span className="text-blue-400">npm</span> <span className="text-white">i</span> <span className="text-green-300">@lazorkit/wallet</span>
                </code>
                 {/* Copy button appears on hover */}
                <button
                  onClick={() => navigator.clipboard.writeText('npm i @lazorkit/wallet')}
                  className="px-3 py-1.5 bg-white bg-opacity-5 hover:bg-opacity-10 text-gray-400 text-xs rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  Copy
                </button>
              </div>
              
              {/* Alternative installation methods (pnpm, yarn) */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2">Or with pnpm / yarn</p>
                <div className="space-y-2">
                  {/* pnpm command */}
                  <div className="bg-[#0d1117] rounded-lg p-3 border border-white border-opacity-5 flex items-center justify-between group">
                    <code className="text-xs font-mono">
                      <span className="text-blue-400">pnpm</span> <span className="text-white">add</span> <span className="text-green-300">@lazorkit/wallet</span>
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText('pnpm add @lazorkit/wallet')}
                      className="px-2 py-1 bg-white bg-opacity-5 hover:bg-opacity-10 text-gray-400 text-xs rounded transition opacity-0 group-hover:opacity-100"
                    >
                      Copy
                    </button>
                  </div>

                  {/* yarn command */}
                  <div className="bg-[#0d1117] rounded-lg p-3 border border-white border-opacity-5 flex items-center justify-between group">
                    <code className="text-xs font-mono">
                      <span className="text-blue-400">yarn</span> <span className="text-white">add</span> <span className="text-green-300">@lazorkit/wallet</span>
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText('yarn add @lazorkit/wallet')}
                      className="px-2 py-1 bg-white bg-opacity-5 hover:bg-opacity-10 text-gray-400 text-xs rounded transition opacity-0 group-hover:opacity-100"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: Next steps */}
            <div className="card-elevated rounded-2xl p-6 flex flex-col justify-center space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Get Started</h3>
              <div className="space-y-3">
                {/* Button to navigate to documentation */}
                <button
                  onClick={() => setView('docs')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore Docs</span>
                  {/* Arrow icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <p className="text-center text-sm text-gray-500">
                  Complete integration guide and API reference
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==================== HELPER COMPONENTS ==================== */



/**
 * StatCard Component
 * 
 * Displays a single statistic with an icon, value, and label.
 * Used in the stats section to highlight key metrics.
 * 
 * @param icon - React icon component to display
 * @param value - The statistic value (e.g., "< 2s", "$0")
 * @param label - Description of the statistic
 */

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="card-elevated rounded-xl p-6 text-center hover-lift">
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="stat-number mb-2">{value}</div>
      <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">{label}</div>
    </div>
  );
}


/**
 * FeatureCard Component
 * 
 * Displays a feature with icon, title, description, and bullet points.
 * Includes color-coded accent borders for visual distinction.
 */
function FeatureCard({ 
  icon, 
  title, 
  description, 
  features,
  accentColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  features: string[];
  accentColor: 'blue' | 'orange' | 'purple';
}) {
  // Map accent color to Tailwind border class
  const borderColors = {
    blue: 'border-blue-500',
    orange: 'border-orange-500',
    purple: 'border-purple-500'
  };

  return (
    <div className="card-elevated rounded-2xl p-8 space-y-5 hover-lift">
      {/* Icon container with colored border */}
      <div className={`w-14 h-14 bg-opacity-10 rounded-xl flex items-center justify-center border ${borderColors[accentColor]} border-opacity-20`}>
        {icon}
      </div>

      {/* Feature title */}
      <h3 className="text-2xl font-bold text-white">{title}</h3>

      {/* Feature description */}
      <p className="text-gray-400 leading-relaxed">{description}</p>

      {/* Feature bullet points */}
      <ul className="space-y-3 pt-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
            {/* Orange bullet point */}
            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}