import React from 'react'
import { AlertTriangle } from 'lucide-react'

export const RiskBanner: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-cipher-amber/10 via-amber-900/10 to-cipher-amber/10 border border-cipher-amber/30 text-cipher-amber p-3 flex items-center justify-center gap-3 rounded shadow-[0_0_15px_rgba(245,158,11,0.1)]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <AlertTriangle size={20} className="shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
      <span className="text-xs md:text-sm font-semibold text-center z-10 tracking-wide uppercase">
        ⚠️ Analysis for informational purposes only. You can lose your entire investment.
      </span>
    </div>
  )
}
