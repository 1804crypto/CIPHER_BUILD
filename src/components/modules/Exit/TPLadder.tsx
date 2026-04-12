import React from 'react'
import type { TPLayer } from '../../../types'
import { Target } from 'lucide-react'

export const TPLadder: React.FC<{ layers?: TPLayer[] }> = ({ layers }) => {
  if (!layers || layers.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-xl flex items-center gap-2 border-b border-cipher-border pb-2">
        <Target className="text-cipher-blue" />
        Take-Profit Ladder
      </h3>
      <div className="flex flex-col gap-3">
        {layers.map((layer, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-cipher-border bg-cipher-surface rounded items-start sm:items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cipher-blue/50" />
            
            <div className="flex flex-col min-w-[80px]">
              <span className="text-xs text-cipher-dim uppercase font-bold">Layer {idx + 1}</span>
              <span className="text-xl font-mono text-cipher-blue">{layer.sellPct}%</span>
            </div>
            
            <div className="flex flex-col gap-1 flex-1 border-l border-cipher-border pl-4">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-cipher-dim uppercase">Target</span>
                  <span className="font-mono text-lg">${layer.targetPrice?.toLocaleString() ?? '?'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-cipher-dim uppercase">Multiple</span>
                  <span className="font-mono text-lg text-cipher-green">{layer.targetMultiple}x</span>
                </div>
              </div>
              <p className="text-sm text-cipher-dim leading-snug mt-1">{layer.rationale}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
