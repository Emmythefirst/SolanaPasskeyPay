/**
 * DemoStoreView.tsx
 * 
 * Demo store page that showcases the PayWithSolana component in action.
 * Displays subscription plans that users can purchase using USDC on devnet.
 * Handles transaction creation and success callbacks.
 * This view demonstrates how to integrate the payment component
 * into a real e-commerce or SaaS checkout flow.
 */

import { ShoppingCart, CheckCircle, Sparkles } from 'lucide-react';
import { PayWithUSDC } from '../components/PayWithUSDC';
import { Transaction, Product } from '../types';
import { APP_CONFIG } from '../utils/constants';

//Props for the DemoStoreView component
interface DemoStoreViewProps {
  addTransaction: (tx: Transaction) => void;
}

export function DemoStoreView({ addTransaction }: DemoStoreViewProps) {
  /**
   * Product catalog - subscription tiers with pricing and features
   * 
   * These are demo products priced in USDC (devnet) to showcase
   * the payment flow without real financial risk.
   */
  const products: Product[] = [
    { 
      id: 1, 
      name: 'Starter Plan', 
      price: 0.1, // 0.1 USDC
      description: 'For individuals',
      features: ['5 projects', 'Basic support', '1GB storage']
    },
    { 
      id: 2, 
      name: 'Pro Plan', 
      price: 0.5, // 0.5 USDC
      description: 'For teams',
      features: ['Unlimited projects', 'Priority support', '10GB storage', 'Analytics']
    },
    { 
      id: 3, 
      name: 'Enterprise', 
      price: 1, // 1 USDC
      description: 'For organizations',
      features: ['Everything in Pro', 'Custom integrations', 'Dedicated support', 'SLA']
    }
  ];

  // Handles successful payment completion
  const handleSuccess = (product: Product, signature: string) => {
    // Create transaction record
    const transaction: Transaction = {
      id: Date.now().toString(), // Simple unique ID
      product: product.name,
      amount: product.price,
      currency: 'USDC',
      signature,  // Blockchain transaction hash
      timestamp: new Date(),
      status: 'completed',  // Payment was successful
      merchantWallet: APP_CONFIG.merchantWallet || '' // Merchant's recieving address
    };
    // Add to transaction history
    addTransaction(transaction);
  };

  return (
    <div className="space-y-12">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="text-center space-y-4">
        {/* Active status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-20 rounded-full text-orange-400 text-sm font-semibold mb-4">
          <Sparkles size={16} />
          Active Terminal
        </div>

        {/* Page title */}
        <h1 className="text-5xl font-bold text-white tracking-tight">Demo Store</h1>

        {/* Subtitle explaining the demo */}
        <p className="text-xl text-gray-400">Pay with USDC • Zero SOL needed • Fully gasless</p>
      </div>

      {/* ==================== PRODUCT GRID ==================== */}
      <div className="grid md:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onSuccess={(sig) => handleSuccess(product, sig)}
          />
        ))}
      </div>
    </div>
  );
}

// ProductCard Component - Individual product card displaying subscription details and payment button.

function ProductCard({ product, onSuccess }: { 
  product: Product; 
  onSuccess: (signature: string) => void;
}) {
  return (
    <div className="card-elevated rounded-2xl p-7 space-y-6 hover-lift">

      {/* ==================== PRODUCT ICON ==================== */}
      <div className="w-full h-48 bg-gradient-to-br from-white-500 to-white-600 rounded-xl flex items-center justify-center glow-orange">
        <ShoppingCart className="text-white" size={50} />
      </div>
      
      {/* ==================== PRODUCT INFO ==================== */}
      <div className="space-y-2">
        {/* Product name */}
        <h3 className="text-2xl font-bold text-white">{product.name}</h3>

        {/* Product tier/category */}
        <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold">{product.description}</p>
      </div>
      
      {/* ==================== FEATURE LIST ==================== */}
      <ul className="space-y-3">
        {product.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
            {/* Green checkmark icon */}
            <CheckCircle size={18} className="text-green-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      
      {/* ==================== PRICING & CHECKOUT ==================== */}
      <div className="pt-4 border-t border-white border-opacity-5">
        {/* Large price display */}
        <div className="stat-number mb-6">{product.price} USDC</div>
        
        {/* 
          Payment button component.
          Handles wallet connection, transaction signing, and confirmation.
          */}
        <PayWithUSDC
          amount={product.price}
          currency="USDC"
          merchantWallet={APP_CONFIG.merchantWallet || ''}
          onSuccess={onSuccess}
          gasless={true}
          label='Pay with USDC'
        />
      </div>
    </div>
  );
}