/**
 * AnalyticsView.tsx
 * 
 * Analytics dashboard page that displays transaction statistics and insights.
 * Shows metrics like total volume, transaction count, and success rates.
 * Simple view wrapper for the analytics dashboard
 */

import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { Transaction } from '../types';

// Props for the AnalyticsView component
interface AnalyticsViewProps {
  /** Array of all transactions to analyze */
  transactions: Transaction[];
}

export function AnalyticsView({ transactions }: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard transactions={transactions} />
    </div>
  );
}