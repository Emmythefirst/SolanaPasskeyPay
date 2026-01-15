/**
 * Navigation Component
 * 
 * Main navigation bar for the application with:
 * - Logo and branding
 * - Navigation links (Home, Store, History, Analytics, Docs)
 * - Wallet connection button
 * - Sticky positioning
 * - Responsive design
 * 
 * This component provides the primary navigation structure and
 * handles view switching through callback props.
 */

import React from 'react';
import { ShoppingCart, History, TrendingUp } from 'lucide-react';
import { LazorKitIcon } from './LazorKitIcon';

// Props for Navigation component containing type definition for available views
interface NavigationProps {
  view: string;
  setView: (view: 'home' | 'demo' | 'history' | 'analytics' | 'docs') => void;
  walletButton: React.ReactNode;
}

// Navigation Component - Renders a sticky top navigation bar with logo, links, and wallet button
export function Navigation({ view, setView, walletButton }: NavigationProps) {
  return (
    // Nav container
    <nav className="bg-[#1a1a1a] border-b border-white border-opacity-5 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <LazorKitIcon size={40} />
            <div>
              <h1 className="text-xl font-bold text-white">LazorKit Integration</h1>
              <p className="text-[0.65rem] text-gray-500 uppercase tracking-wider">Solana Passkey Pay Starter Template</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-1">
            <NavButton active={view === 'home'} onClick={() => setView('home')}>
              Home
            </NavButton>
            <NavButton active={view === 'demo'} onClick={() => setView('demo')}>
              <ShoppingCart size={16} />
              Store
            </NavButton>
            <NavButton active={view === 'history'} onClick={() => setView('history')}>
              <History size={16} />
              History
            </NavButton>
            <NavButton active={view === 'analytics'} onClick={() => setView('analytics')}>
              <TrendingUp size={16} />
              Analytics
            </NavButton>
            <NavButton active={view === 'docs'} onClick={() => setView('docs')}>
              Docs
            </NavButton>
          </div>

          {/* Wallet Button */}
          <div className="flex items-center gap-3">
            {walletButton}
          </div>
        </div>
      </div>
    </nav>
  );
}


 /* NavButton Component
 * 
 * Individual navigation button with active state styling.
 * 
 * Features:
 * - Active state highlighting (white background)
 * - Hover effects
 * - Icon + text support
 * - Smooth transitions
 */

function NavButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean; 
  onClick: () => void; 

  //Button content (text and/or icons)
  children: React.ReactNode;
}) {
  return (
    // Button Styling
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
        active 
          ? 'bg-white text-gray-900 shadow-lg' 
          : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5'
      }`}
    >
      {children}
    </button>
  );
}