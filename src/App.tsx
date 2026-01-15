import { useState } from 'react';
import { LazorKitAppProvider } from './contexts/LazorKitAppContext';
import { Navigation } from './components/Navigation';
import { WalletButton } from './components/WalletButton';
import { useTransactions } from './hooks/useTransactions';
import { HomeView } from './views/HomeView';
import { DemoStoreView } from './views/DemoStoreView';
import { HistoryView } from './views/HistoryView';
import { AnalyticsView } from './views/AnalyticsView';
import { DocsView } from './views/DocsView';
import { Footer } from './views/Footer';

/**
 * Centralized union type for app-level navigation.
 * This ensures type-safe routing without a router dependency.
 */
type ViewType = 'home' | 'demo' | 'history' | 'analytics' | 'docs';

/**
 * Root App wrapper.
 *
 * LazorKitAppProvider is mounted at the top level so:
 * - Wallet state
 * - Session persistence
 * - Passkey context
 * are available everywhere in the app.
 */
function App() {
  return (
    <LazorKitAppProvider>
      <AppContent />
    </LazorKitAppProvider>
  );
}

function AppContent() {
  // Simple state-based navigation
  const [view, setView] = useState<ViewType>('home');

  // Custom hook that stores and manage transaction history
  const { transactions, addTransaction, clearTransactions } = useTransactions();

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navigation
        view={view}
        setView={setView}
        walletButton={<WalletButton />}
      />

    {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {view === 'home' && <HomeView setView={setView} />}
        {view === 'demo' && <DemoStoreView addTransaction={addTransaction} />}
        {view === 'history' && (
          <HistoryView 
        transactions={transactions} 
        onClearTransactions={clearTransactions}
        />)}
        {view === 'analytics' && <AnalyticsView transactions={transactions} />}
        {view === 'docs' && <DocsView />}
      </main>

      <Footer />
    </div>
  );
}

export default App;