export function LazorKitIcon({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg shadow-lg shadow-purple-500/20"
      style={{ width: size, height: size }}
    >
      <svg 
        width={size * 0.6} 
        height={size * 0.6} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" 
          fill="white"
        />
      </svg>
    </div>
  );
}