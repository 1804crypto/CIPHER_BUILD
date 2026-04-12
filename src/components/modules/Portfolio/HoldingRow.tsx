import React, { useState } from 'react'
import type { AuditedHolding } from '../../../types'
import { VerificationTag } from '../../ui/VerificationTag'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const HoldingRow: React.FC<{ holding: AuditedHolding }> = ({ holding }) => {
  const [expanded, setExpanded] = useState(false)

  const getVerdictStyle = (v: string) => {
    switch (v) {
      case 'HOLD': return 'bg-cipher-green/10 text-cipher-green border-cipher-green'
      case 'SCALE': return 'bg-cipher-blue/10 text-cipher-blue border-cipher-blue'
      case 'REDUCE': return 'bg-cipher-amber/10 text-cipher-amber border-cipher-amber'
      case 'EXIT': return 'bg-cipher-red/10 text-cipher-red border-cipher-red'
      default: return 'bg-cipher-bg border-cipher-border text-cipher-text'
    }
  }

  const isProfitable = holding.pnlPct >= 0
  const pnlColor = isProfitable ? 'text-cipher-green' : 'text-cipher-red'

  return (
    <div className="flex flex-col border border-cipher-border rounded bg-cipher-surface overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-cipher-bg/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 w-1/3">
          <div className="flex flex-col">
            <span className="font-bold">{holding.token}</span>
            <span className="text-xs text-cipher-dim font-mono">${holding.ticker}</span>
          </div>
          <span className={`px-2 py-1 text-xs font-bold border rounded ${getVerdictStyle(holding.verdict)}`}>
            {holding.verdict}
          </span>
        </div>

        <div className="flex flex-col items-end w-1/3">
          <div className="flex items-center gap-2">
            <span className="font-mono">${holding.currentPrice?.value?.toLocaleString() ?? '?'}</span>
            <VerificationTag tier={holding.currentPrice?.tier} />
          </div>
          <span className={`font-mono text-xs font-bold ${pnlColor}`}>
            {isProfitable ? '+' : ''}{holding.pnlPct?.toFixed(2)}% PnL
          </span>
        </div>

        <div className="flex items-center gap-4 justify-end w-1/3">
           <span className="font-mono">${holding.currentValueUsd?.toLocaleString() ?? '?'}</span>
           {expanded ? <ChevronUp size={20} className="text-cipher-dim" /> : <ChevronDown size={20} className="text-cipher-dim" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-cipher-border bg-cipher-bg flex flex-col md:flex-row gap-6 text-sm">
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <span className="text-xs font-semibold uppercase text-cipher-dim block mb-1">Verdict Rationale</span>
              <p>{holding.verdictRationale}</p>
            </div>
            {holding.redFlagSummary && holding.redFlagSummary.length > 0 && (
               <div>
                  <span className="text-xs font-semibold uppercase text-cipher-red block mb-1">Red Flags Found</span>
                  <ul className="list-disc pl-5 text-cipher-red space-y-1">
                    {holding.redFlagSummary.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
               </div>
            )}
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col gap-2">
             <div className="flex justify-between border-b border-cipher-border py-1">
               <span className="text-cipher-dim">Entry Price</span>
               <span className="font-mono">${holding.entryPrice}</span>
             </div>
             <div className="flex justify-between border-b border-cipher-border py-1">
               <span className="text-cipher-dim">Amount</span>
               <span className="font-mono">{holding.amount} {holding.ticker}</span>
             </div>
             <div className="flex justify-between border-b border-cipher-border py-1">
               <span className="text-cipher-dim">Sector</span>
               <span>{holding.narrativeSector}</span>
             </div>
             <div className="flex justify-between py-1">
               <span className="text-cipher-dim">Unlock</span>
               <div className="flex items-center gap-2">
                 <span>{holding.upcomingUnlock?.value || 'None'}</span>
                 {holding.upcomingUnlock && <VerificationTag tier={holding.upcomingUnlock.tier} />}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  )
}
