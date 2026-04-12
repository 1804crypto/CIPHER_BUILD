import React from 'react'
import type { Narrative } from '../../../types'

export const NarrativeCard: React.FC<{ narrative: Narrative }> = ({ narrative }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-cipher-border bg-cipher-surface rounded">
      <div className="flex justify-between items-start">
        <span className="font-bold text-lg">{narrative.name}</span>
        {narrative.vcBacked && <span className="text-[10px] px-1.5 py-0.5 bg-cipher-purple/20 text-cipher-purple border border-cipher-purple rounded whitespace-nowrap">VC BACKED</span>}
      </div>
      <div className="flex gap-2">
        <span className="text-xs px-2 py-0.5 border border-cipher-dim rounded text-cipher-dim">{narrative.status}</span>
        <span className="text-xs px-2 py-0.5 border border-cipher-dim rounded text-cipher-dim">{narrative.saturationPct}% Saturation</span>
      </div>
      <p className="text-sm mt-2 font-mono text-cipher-dim line-clamp-3">{narrative.description}</p>
    </div>
  )
}
