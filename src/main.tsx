import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer';
import './index.css'
import App from './App.tsx'

/**
 * Global polyfills required by Solana + LazorKit SDKs.
 *
 * Why this is needed:
 * - Some Solana and Anchor dependencies expect Node globals
 * - Browsers do not provide Buffer / process by default
 *
 * These MUST run before React renders.
 */
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
  window.process = window.process || { env: {} };
}

/**
 * React 18+ root rendering.
 * StrictMode is kept enabled to surface unsafe lifecycle usage.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)



