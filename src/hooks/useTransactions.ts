/**
 * useTransactions.ts - Transaction state management
 */

import { useState, useCallback, useEffect } from 'react';
import { Transaction } from '../types';

// localStorage key for storing transactions
const STORAGE_KEY = 'lazorkit_transactions';

/**
 * Load transactions from localStorage
 * returns Array of transactions or empty array if none exist
 */
const loadTransactionsFromStorage = (): Transaction[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    
    // Convert timestamp strings back to Date objects
    return parsed.map((tx: any) => ({
      ...tx,
      timestamp: new Date(tx.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load transactions from storage:', error);
    return [];
  }
};

// Save transactions to localStorage
const saveTransactionsToStorage = (transactions: Transaction[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to storage:', error);
  }
};

// Custom hook for managing transaction history with local storage persistence
export function useTransactions() {

  // Initialize state from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return loadTransactionsFromStorage();
  });

  // Save to localStorage whenever transactions change
  useEffect(() => {
    saveTransactionsToStorage(transactions);
  }, [transactions]);

  // Add a new transaction to the list (newest first)
  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev => {
      const updated = [transaction, ...prev];
      console.log('✅ Transaction added:', transaction.id);
      console.log('📊 Total transactions:', updated.length);
      return updated;
    });
  }, []);

  // Clear all transactions from state and localStorage
  const clearTransactions = useCallback(() => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('🗑️ All transactions cleared');
  }, []);

  // Get a specific transaction by ID
  const getTransactionById = useCallback((id: string) => {
    return transactions.find(tx => tx.id === id);
  }, [transactions]);

  // Calculate total transaction volume
  const getTotalVolume = useCallback(() => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions]);

  // Calculate average transaction amount
  const getAverageTransaction = useCallback(() => {
    if (transactions.length === 0) return 0;
    return getTotalVolume() / transactions.length;
  }, [transactions, getTotalVolume]);

  // Get transaction count by status
  const getCountByStatus = useCallback((status: Transaction['status']) => {
    return transactions.filter(tx => tx.status === status).length;
  }, [transactions]);

  return {
    transactions,  // Array of all transactions (newest first)
    addTransaction,
    clearTransactions,
    getTransactionById,
    getTotalVolume,
    getAverageTransaction,
    getCountByStatus,
  };
}