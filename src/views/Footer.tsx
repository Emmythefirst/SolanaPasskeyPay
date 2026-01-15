import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 p-8 text-center text-gray-400">
      <div className="flex justify-center items-center gap-2 mb-2">
        <Zap className="text-gray-400 text-sm" />
        LazorKit Pay
      </div>
      <p>Emmy • 2026</p>
    </footer>
  );
}
