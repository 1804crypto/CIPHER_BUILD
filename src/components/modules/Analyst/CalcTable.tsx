import React from 'react'
import type { TokenMetrics } from '../../../types'
import { VerificationTag } from '../../ui/VerificationTag'

export const CalcTable: React.FC<{ metrics?: TokenMetrics }> = ({ metrics }) => {
  if (!metrics) return null
  
  const isHighInflation = (metrics.annualInflationPct?.value ?? 0) > 25
  const isHighFdv = (metrics.fdvMcapRatio?.value ?? 0) > 4

  const Row = ({ label, metric, format, highlight }: { label: string; metric?: { value?: number | string; tier?: import('../../../types').VerificationTier }; format: (v?: number | string | null) => string; highlight?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b border-cipher-border last:border-0 relative container">
      <span className="text-sm text-cipher-dim">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm ${highlight ? 'text-cipher-red font-bold' : 'text-cipher-text'}`}>
          {format(metric?.value)}
        </span>
        <VerificationTag tier={metric?.tier} />
      </div>
    </div>
  )

  return (
    <div className="bg-cipher-surface border border-cipher-border rounded p-4 flex flex-col">
      <h3 className="font-bold mb-3 border-b border-cipher-border pb-2 inline-flex">Token Metrics</h3>
      <Row label="Current Price" metric={metrics.currentPrice as any} format={(v) => v != null ? `$${Number(v).toLocaleString()}` : '?'} />
      <Row label="Market Cap" metric={metrics.marketCap as any} format={(v) => v != null ? `$${Number(v).toLocaleString()}` : '?'} />
      <Row label="FDV" metric={metrics.fdv as any} format={(v) => v != null ? `$${Number(v).toLocaleString()}` : '?'} />
      <Row label="FDV / MCap Ratio" metric={metrics.fdvMcapRatio as any} format={(v) => v != null ? `${Number(v).toFixed(2)}x` : '?'} highlight={isHighFdv} />
      <Row label="Circulating Supply" metric={metrics.circulatingSupply as any} format={(v) => v != null ? Number(v).toLocaleString() : '?'} />
      <Row label="Annual Inflation" metric={metrics.annualInflationPct as any} format={(v) => v != null ? `${v}%` : '?'} highlight={isHighInflation} />
      <Row label="ATH Price" metric={metrics.athPrice as any} format={(v) => v != null ? `$${Number(v).toLocaleString()}` : '?'} />
      <Row label="Inflation Adjusted ATH" metric={metrics.inflationAdjustedAth as any} format={(v) => v != null ? `$${Number(v).toLocaleString()}` : '?'} />
      
      {metrics.cliffUnlock90d && (
        <div className="mt-3 p-2 bg-cipher-bg border border-cipher-border rounded flex justify-between items-center">
          <span className="text-xs text-cipher-dim">Next 90d Cliff:</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono">{metrics.cliffUnlock90d.value || 'None'}</span>
            <VerificationTag tier={metrics.cliffUnlock90d.tier} />
          </div>
        </div>
      )}
    </div>
  )
}
