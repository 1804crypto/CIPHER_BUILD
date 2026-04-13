import React from 'react'
import type { ConfidenceTier } from '../../types'
import { Badge } from './Badge'

interface Props {
  tier?: ConfidenceTier
}

export const ConfidenceBadge: React.FC<Props> = ({ tier }) => {
  if (!tier) return <Badge className="border-cipher-dim text-cipher-dim">UNKNOWN CONFIDENCE</Badge>

  switch (tier) {
    case 'HIGH':
      return <Badge className="border-cipher-green text-cipher-green bg-cipher-green/10 shadow-[0_0_10px_rgba(0,212,170,0.2)]">🟢 HIGH CONFIDENCE</Badge>
    case 'MODERATE':
      return <Badge className="border-cipher-amber text-cipher-amber bg-cipher-amber/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]">🟡 MODERATE CONFIDENCE</Badge>
    case 'LOW':
      return <Badge className="border-cipher-red text-cipher-red bg-cipher-red/10 shadow-[0_0_10px_rgba(239,68,68,0.2)]">🔴 LOW CONFIDENCE</Badge>
    case 'INSUFFICIENT':
      return <Badge className="border-red-900 text-red-500 bg-red-900/20">⛔ INSUFFICIENT DATA</Badge>
    default:
      return null
  }
}
