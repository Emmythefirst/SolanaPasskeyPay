/**
 * TransactionHistory Component
 * 
 * Displays a list of all past transactions with detailed information.
 */

import { History, CheckCircle, Clock, XCircle, ExternalLink } from 'lucide-react';
import { Transaction } from '../types';
import { formatDate, formatCurrency, getExplorerUrl, formatAddress } from '../utils/formatters';

// Props for TransactionHistory component
interface TransactionHistoryProps {
  transactions: Transaction[];
}

// Main container that handles empty state or renders transaction list
export function TransactionHistory({ transactions }: TransactionHistoryProps) {

  // Empty State Rendering
  if (transactions.length === 0) {
    return (
      <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-2xl border border-white border-opacity-10 p-12 text-center">

        {/* Large icon for visual interest */}
        <History className="mx-auto text-gray-500 mb-4" size={64} />

        {/* Clear Primary message */}
        <p className="text-gray-400 text-lg font-semibold mb-2">No transactions yet</p>
        
        {/* Helpful secondary message */}
        <p className="text-gray-500 text-sm">
          Make a purchase in the demo store to see your transaction history here
        </p>
      </div>
    );
  }

  // Transaction List Rendering
  return (
    <div className="space-y-4">
      {transactions.map(tx => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

// TransactionCard component
function TransactionCard({ transaction }: { transaction: Transaction }) {
  // Get appropriate icon for transaction status
  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'pending':
        return <Clock className="text-yellow-400" size={24} />;
      case 'failed':
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <Clock className="text-gray-400" size={24} />;
    }
  };

  // Get background color for status icon container
  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return 'bg-green-600 bg-opacity-20';
      case 'pending':
        return 'bg-yellow-600 bg-opacity-20';
      case 'failed':
        return 'bg-red-600 bg-opacity-20';
      default:
        return 'bg-gray-600 bg-opacity-20';
    }
  };

  // Get text for transaction status
  const getStatusText = () => {
    switch (transaction.status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  // Render Transaction Card
  return (
    <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl border border-white border-opacity-10 p-6 hover:border-purple-400 hover:border-opacity-30 transition">
      {/* Main Card content */}
      <div className="flex items-start justify-between gap-4">

        {/* Left Side - Icon and transaction details */}
        <div className="flex items-start gap-4 flex-1">

          {/* Status icon in colored container */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          
          {/* Transaction details */}
          <div className="flex-1 min-w-0">

            {/* Product name and status badge */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-lg">{transaction.product}</h3>

              {/* Status badge with color coding */}
              <span className={`text-xs px-2 py-1 rounded-full ${
                transaction.status === 'completed' ? 'bg-green-600 bg-opacity-20 text-green-400' :
                transaction.status === 'pending' ? 'bg-yellow-600 bg-opacity-20 text-yellow-400' :
                'bg-red-600 bg-opacity-20 text-red-400'
              }`}>
                {getStatusText()}
              </span>
            </div>
            
            {/* Timestamp */}
            <p className="text-gray-400 text-sm mb-2">
              {formatDate(transaction.timestamp)}
            </p>
            
            {/* Merchant wallet address (shortened) */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>To:</span>
              <span className="font-mono">{formatAddress(transaction.merchantWallet)}</span>
            </div>

            {/* Transaction actions (if signature exists) */}
            {transaction.signature && (
              <div className="mt-3 flex items-center gap-2">
                {/* Explorer Link */}
                <a
                  href={getExplorerUrl(transaction.signature, 'devnet')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  <ExternalLink size={12} />
                  View on Explorer
                </a>

                {/* Copy signature button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.signature);
                  }}
                  className="text-xs text-gray-400 hover:text-gray-300 transition"
                >
                  Copy Tx
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Amount */}
        <div className="text-right">

          {/* Large amount display */}
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(transaction.amount, transaction.currency)}
          </p>

          {/* Currency name */}
          <p className="text-sm text-gray-400">
            {transaction.currency === 'SOL' ? 'Solana' : transaction.currency}
          </p>
        </div>
      </div>

      {/* Transaction ID (collapsed by default) */}
      {transaction.signature && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-gray-400 hover:text-gray-300 transition">
            Show transaction details
          </summary>

          {/* Details content (shown when expanded) */}
          <div className="mt-3 bg-gray-900 bg-opacity-50 rounded-lg p-3">
            <div className="space-y-2 text-xs">

              {/* Transaction ID */}
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="text-gray-400 font-mono">{transaction.id}</span>
              </div>

              {/* Signature (truncated) */}
              <div className="flex justify-between">
                <span className="text-gray-500">Signature:</span>
                <span className="text-gray-400 font-mono break-all">
                  {transaction.signature.slice(0, 20)}...
                </span>
              </div>

              {/* Network */}
              <div className="flex justify-between">
                <span className="text-gray-500">Network:</span>
                <span className="text-gray-400">Devnet</span>
              </div>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}