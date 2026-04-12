import React from 'react'
import { AlertTriangle } from 'lucide-react'

export const RiskBanner: React.FC = () => {
  return (
    <div className="w-full bg-cipher-amber/10 border-b border-cipher-amber/30 text-cipher-amber p-2 md:p-3 flex items-start md:items-center justify-center gap-2">
      <AlertTriangle size={18} className="shrink-0" />
      <span className="text-xs md:text-sm font-semibold text-center">
        ⚠️ Analysis for informational purposes only. Not financial advice. You can lose your entire investment.
      </span>
    </div>
  )
}
