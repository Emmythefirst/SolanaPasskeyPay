export interface Transaction {
  id: string;
  product: string;
  amount: number;
  currency: 'SOL' | 'USDC';
  signature: string;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  merchantWallet: string;
}

export interface WalletInfo {
  credentialId: string;
  passkeyPubkey: number[];
  smartWallet: string;
  walletDevice: string;
  platform: string;
  accountName?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  features: string[];
  category?: string;
}

export interface AnalyticsData {
  totalVolume: number;
  totalTransactions: number;
  avgTransaction: number;
  successRate: number;
}