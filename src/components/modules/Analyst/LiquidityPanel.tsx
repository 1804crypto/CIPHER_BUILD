import React from 'react'
import type { LiquidityMetrics } from '../../../types'
import { VerificationTag } from '../../ui/VerificationTag'

export const LiquidityPanel: React.FC<{ liquidity?: LiquidityMetrics }> = ({ liquidity }) => {
  if (!liquidity) return null

  return (
    <div className="bg-cipher-surface border border-cipher-border rounded p-4 flex flex-col h-full">
      <h3 className="font-bold mb-3 border-b border-cipher-border pb-2 inline-flex">Liquidity & Exit Risk</h3>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-cipher-dim">Liquidity Score</span>
          <span className={`text-xs px-2 py-1 font-bold rounded border ${
            liquidity.liquidityScore === 'HIGH' ? 'bg-cipher-green/10 text-cipher-green border-cipher-green' :
            liquidity.liquidityScore === 'ILLIQUID' ? 'bg-cipher-red/10 text-cipher-red border-cipher-red' :
            'bg-cipher-bg text-cipher-text border-cipher-dim'
          }`}>{liquidity.liquidityScore || 'UNKNOWN'}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-cipher-dim">Vol/MCap Ratio</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{liquidity.volumeMcapRatio?.value != null ? `${liquidity.volumeMcapRatio.value}%` : '?'}</span>
            <VerificationTag tier={liquidity.volumeMcapRatio?.tier} />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-cipher-dim">Days to Exit $10k</span>
          <div className="flex items-center gap-2">
            <span className="font-mono">{liquidity.daysToExit10k?.value != null ? liquidity.daysToExit10k.value : '?'}</span>
            <VerificationTag tier={liquidity.daysToExit10k?.tier} />
          </div>
        </div>
        {liquidity.exchangeTier && (
          <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-cipher-border">
            <span className="text-cipher-dim">Top Exchange Tier</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold">{liquidity.exchangeTier.value || '?'}</span>
              <VerificationTag tier={liquidity.exchangeTier.tier} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
