import React from 'react'
import type { RedFlags, RedFlagCheck } from '../../types'

interface Props {
  flags?: RedFlags
}

const renderCell = (check: RedFlagCheck) => {
  const isRed = check.level === 'RED'
  const bgClass = isRed ? 'bg-cipher-red text-white' : 'bg-cipher-surface text-cipher-text border-cipher-border'
  
  let icon = ''
  if (check.level === 'GREEN') icon = '🟢'
  if (check.level === 'YELLOW') icon = '🟡'
  if (check.level === 'RED') icon = '🚨'
  if (check.level === 'UNVERIFIED') icon = '❓'

  return (
    <div key={check.label} className={`p-3 border rounded flex flex-col gap-1 ${bgClass}`}>
      <div className="flex justify-between items-start">
        <span className="font-mono text-sm font-semibold">{check.label}</span>
        <span>{icon}</span>
      </div>
      <p className="text-xs opacity-90 leading-tight">{check.detail}</p>
    </div>
  )
}

export const RedFlagGrid: React.FC<Props> = ({ flags }) => {
  if (!flags) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-bold text-cipher-text">Red Flag Detection</h3>
        {flags.criticalCount > 0 ? (
          <span className="px-2 py-1 bg-cipher-red/20 text-cipher-red text-xs font-bold rounded border border-cipher-red">
            {flags.criticalCount} CRITICAL FLAGS
          </span>
        ) : (
          <span className="px-2 py-1 bg-cipher-green/20 text-cipher-green text-xs font-bold rounded border border-cipher-green">
            0 CRITICAL FLAGS
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-cipher-dim uppercase">Contract</h4>
          {flags.contract?.map(renderCell)}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-cipher-dim uppercase">Team</h4>
          {flags.team?.map(renderCell)}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-cipher-dim uppercase">Tokenomics</h4>
          {flags.tokenomics?.map(renderCell)}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-cipher-dim uppercase">Liquidity</h4>
          {flags.liquidity?.map(renderCell)}
        </div>
      </div>
    </div>
  )
}
