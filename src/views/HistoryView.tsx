/**
 * HistoryView.tsx
 * 
 * Transaction history page that displays all completed, pending, and failed transactions.
 * Now includes ability to clear transaction history.
 */

import { Trash2 } from 'lucide-react';
import { TransactionHistory } from '../components/TransactionHistory';
import { Transaction } from '../types';


// Props for the HistoryView component
interface HistoryViewProps {

  // Array of all transactions to display
  transactions: Transaction[];
  // Function to clear all transactions 
  onClearTransactions?: () => void;
}

/**
 * HistoryView Component
 * 
 * Simple view that displays the transaction history.
 * Delegates all rendering logic to the TransactionHistory component.
 */
export function HistoryView({ transactions, onClearTransactions }: HistoryViewProps) {
  
  //Handle clear history with confirmation
  const handleClearHistory = () => {
    if (transactions.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to clear all ${transactions.length} transaction(s)? This action cannot be undone.`
    );
    
    if (confirmed && onClearTransactions) {
      onClearTransactions();
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Transaction History</h1>
          {transactions.length > 0 && (
            <p className="text-gray-400 text-sm mt-2">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} recorded
            </p>
          )}
        </div>

        {/* Clear History Button - Only show if transactions exist */}
        {transactions.length > 0 && onClearTransactions && (
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 bg-opacity-20 border border-red-400 border-opacity-30 text-red-400 rounded-lg hover:bg-opacity-30 transition"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>
      
      {/* ==================== TRANSACTION LIST ==================== */}
      {/* 
        TransactionHistory component handles:
        - Empty state when no transactions exist
        - Transaction card rendering
        - Status indicators (completed/pending/failed)
        - Explorer links
        - Transaction details
      */}
      <TransactionHistory transactions={transactions} />
    </div>
  );
}