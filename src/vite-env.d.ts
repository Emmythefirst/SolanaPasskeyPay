/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOLANA_NETWORK: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_PORTAL_URL: string;
  readonly VITE_PAYMASTER_URL: string;
  readonly VITE_PAYMASTER_API_KEY?: string;
  readonly VITE_MERCHANT_WALLET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}