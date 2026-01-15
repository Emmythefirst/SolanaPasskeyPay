import { Send, Loader, CheckCircle, XCircle, Fingerprint } from 'lucide-react'

// Payment state type definition
export type PaymentState =
  | 'idle'
  | 'connecting'
  | 'authenticating'
  | 'processing'
  | 'success'
  | 'error'

  //Props for PaymentButton component
interface PaymentButtonProps {
  status: PaymentState
  amount: number
  currency: string
  label?: string
  disabled?: boolean
  onClick: () => void
}

/**
 * PaymentButton Component
 * 
 * Displays an interactive payment button that changes appearance
 * based on the current payment state.
 */
export function PaymentButton({
  status,
  amount,
  currency,
  label,
  disabled,
  onClick
}: PaymentButtonProps) {
  // Generate button content based on current state
  const content = () => {
    switch (status) {
      case 'connecting':
        return <><Loader className="animate-spin" size={18} /> Connecting…</>
      case 'authenticating':
        return <><Fingerprint className="animate-pulse" size={18} /> Authenticate…</>
      case 'processing':
        return <><Loader className="animate-spin" size={18} /> Processing…</>
      case 'success':
        return <><CheckCircle size={18} /> Paid</>
      case 'error':
        return <><XCircle size={18} /> Failed</>
      default:
        return <><Send size={18} /> {label ?? `Pay ${amount} ${currency}`}</>
    }
  }

  // Render button with state-dependent styling
  return (
    <button
      onClick={onClick}
      disabled={disabled || status !== 'idle'}
      className="w-full px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2
                 bg-gradient-to-r from-orange-500 to-orange-600 text-white
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {content()}
    </button>
  )
}


 /* Separation of Concerns:
 * - This component only handles UI rendering
 * - Parent (PayWithSolana/index.tsx) manages state and logic
 * - Makes component reusable and testable
 */ 