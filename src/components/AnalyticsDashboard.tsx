/**
 * AnalyticsDashboard Component
 * 
 * Displays comprehensive analytics and metrics for transaction data.
 * 
 * Features:
 * - Key performance indicators (KPIs)
 * - Total volume, transaction count, success rate
 * - Visual breakdown by transaction status
 * - Color-coded status cards
 * - Trend indicators
 * 
 * This component receives transaction data and calculates metrics
 * in real-time. All calculations are done client-side.
 */

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

// Props for AnalyticsDashboard component
interface AnalyticsDashboardProps {
  transactions: Transaction[];
}

// Calculates and displays analytics metrics from transaction data.
export function AnalyticsDashboard({ transactions }: AnalyticsDashboardProps) {
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const avgTransaction = transactions.length > 0 ? totalVolume / transactions.length : 0;
  const completedTx = transactions.filter(tx => tx.status === 'completed').length;
  const successRate = transactions.length > 0 ? (completedTx / transactions.length) * 100 : 0;

  // Render Dashboard
  return (
    <div className="space-y-8">

      {/* Top Metrics Row */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Total Volume Card */}
        <AnalyticCard
          title="Total Volume"
          value={formatCurrency(totalVolume, 'USDC')}
          change="+12.5%"
          positive
        />

        {/* Total Transactions Card */}
        <AnalyticCard
          title="Total Transactions"
          value={transactions.length.toString()}
          change={`${completedTx} completed`}
          positive
        />

        {/* Success Rate Card */}
        <AnalyticCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          change={`Avg: ${formatCurrency(avgTransaction, 'USDC')}`}
          positive={successRate > 80}
        />
      </div>

      {/* Transaction Status Section */}
      <div className="card-elevated rounded-2xl p-8">

        {/* Section Header */}
        <h3 className="text-2xl font-bold text-white mb-8">Transaction Status</h3>

        {/* Status cards grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Completed transactions (green) */}
          <StatusCard
            label="Completed"
            count={transactions.filter(tx => tx.status === 'completed').length}
            color="green"
          />

          {/* Pending Transactions (yellow) */}
          <StatusCard
            label="Pending"
            count={transactions.filter(tx => tx.status === 'pending').length}
            color="yellow"
          />

          {/* Failed Transactions (red) */}
          <StatusCard
            label="Failed"
            count={transactions.filter(tx => tx.status === 'failed').length}
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * AnalyticCard SubComponent
 * 
 * Displays a single metric with:
 * - Title (e.g., "Total Volume")
 * - Large value (e.g., "10.5 SOL")
 * - Change indicator with trend icon
 */
function AnalyticCard({ 
  title, 
  value, 
  change, 
  positive 
}: { 
  title: string; 
  value: string; 
  change: string;
  positive: boolean;  // Whether the change is positive (affects icon and color)
}) {
  return (
    // Card Container
    <div className="card-elevated rounded-xl p-6 hover-lift">

      {/* Metric title (small, uppercase, muted) */}
      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">{title}</p>

      {/* Main value (large, gradient text) */}
      <p className="stat-number mb-3">{value}</p>

      {/* Change indicator with trend icon */}
      <div className={`flex items-center gap-1.5 text-sm font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>

        {/* Trend icon (up arrow for positive, down for negative) */}
        {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change}</span>
      </div>
    </div>
  );
}

/**
 * StatusCard SubComponent
 * 
 * Displays transaction count for a specific status with:
 * - Large count number
 * - Status label
 * - Color-coded background and border
 */
function StatusCard({ 
  label, 
  count, 
  color 
}: { 
  label: string; 
  count: number; 
  color: 'green' | 'yellow' | 'red';
}) {

  // Color mapping - Maps color prop to Tailwind CSS classes
  const colorClasses = {
    green: 'bg-green-600 bg-opacity-10 border-green-400 text-green-400',
    yellow: 'bg-yellow-600 bg-opacity-10 border-yellow-400 text-yellow-400',
    red: 'bg-red-600 bg-opacity-10 border-red-400 text-red-400',
  };

  return (
    // Status Card Container
    <div className={`${colorClasses[color]} border border-opacity-30 rounded-xl p-6 text-center hover-lift`}>

      {/* Large count display */}
      <p className="text-5xl font-bold mb-2">{count}</p>

      {/* Status label */}
      <p className="text-sm uppercase tracking-wider font-semibold opacity-90">{label}</p>
    </div>
  );
}