/**
 * Navigation Component
 * 
 * Main navigation bar for the application with:
 * - Logo and branding
 * - Navigation links (Home, Store, History, Analytics, Docs)
 * - Wallet connection button
 * - Sticky positioning
 * - Responsive design
 * - Mobile dropdown
 * 
 * This component provides the primary navigation structure and
 * handles view switching through callback props.
 */


import React, { useState } from 'react';
import { ShoppingCart, History, TrendingUp, Menu, X } from 'lucide-react';
import { LazorKitIcon } from './LazorKitIcon';

// Props for Navigation component containing type definition for available views
interface NavigationProps {
  view: string;
  setView: (view: 'home' | 'demo' | 'history' | 'analytics' | 'docs') => void;
  walletButton: React.ReactNode;
}

// Navigation Component - Renders a sticky top navigation bar with logo, links, and wallet button
export function Navigation({ view, setView, walletButton }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (target: 'home' | 'demo' | 'history' | 'analytics' | 'docs') => {
    setView(target);
    setMobileOpen(false); // close menu after click on mobile
  };

  // Nav Container
  return (
    <nav className="bg-[#1a1a1a] border-b border-white border-opacity-5 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNav('home')}
          >
            <LazorKitIcon size={36} />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">LazorKit Integration</h1>
              <p className="text-[0.65rem] text-gray-500 uppercase tracking-wider">
                Solana Passkey Pay Starter Template
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-1">
            <NavButton active={view === 'home'} onClick={() => handleNav('home')}>
              Home
            </NavButton>
            <NavButton active={view === 'demo'} onClick={() => handleNav('demo')}>
              <ShoppingCart size={16} />
              Store
            </NavButton>
            <NavButton active={view === 'history'} onClick={() => handleNav('history')}>
              <History size={16} />
              History
            </NavButton>
            <NavButton active={view === 'analytics'} onClick={() => handleNav('analytics')}>
              <TrendingUp size={16} />
              Analytics
            </NavButton>
            <NavButton active={view === 'docs'} onClick={() => handleNav('docs')}>
              Docs
            </NavButton>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {walletButton}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-4 space-y-1">
            <MobileNavButton active={view === 'home'} onClick={() => handleNav('home')}>
              Home
            </MobileNavButton>
            <MobileNavButton active={view === 'demo'} onClick={() => handleNav('demo')}>
              Store
            </MobileNavButton>
            <MobileNavButton active={view === 'history'} onClick={() => handleNav('history')}>
              History
            </MobileNavButton>
            <MobileNavButton active={view === 'analytics'} onClick={() => handleNav('analytics')}>
              Analytics
            </MobileNavButton>
            <MobileNavButton active={view === 'docs'} onClick={() => handleNav('docs')}>
              Docs
            </MobileNavButton>
          </div>
        )}
      </div>
    </nav>
  );
}

/* Desktop Button */
function NavButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
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

/* Mobile Button */
function MobileNavButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-white text-gray-900'
          : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
      }`}
    >
      {children}
    </button>
  );
}
