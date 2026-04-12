import React from 'react'
import type { VerificationTier } from '../../types'

interface Props {
  tier?: VerificationTier
}

export const VerificationTag: React.FC<Props> = ({ tier }) => {
  if (!tier) return <span className="text-xs text-cipher-dim">❓ UNKNOWN</span>
  
  switch (tier) {
    case 'VERIFIED':
      return <span className="text-xs text-cipher-green">✅ VERIFIED</span>
    case 'ESTIMATED':
      return <span className="text-xs text-cipher-amber">⚠️ ESTIMATED</span>
    case 'UNVERIFIED':
      return <span className="text-xs text-cipher-dim">❓ UNVERIFIED</span>
    case 'UNAVAILABLE':
      return <span className="text-xs text-cipher-red">🚫 UNAVAILABLE</span>
    default:
      return null
  }
}
