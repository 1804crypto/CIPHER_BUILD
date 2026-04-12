import React from 'react'
import type { PriceScenario } from '../../types'
import { VerificationTag } from './VerificationTag'

interface Props {
  scenario?: PriceScenario
}

export const ScenarioCard: React.FC<Props> = ({ scenario }) => {
  if (!scenario) return null

  const isBear = scenario.label === 'Bear'
  const isProfitable = scenario.returnMultiple > 1

  const cardStyle = isBear 
    ? 'bg-cipher-bg border-cipher-red/30' 
    : 'bg-cipher-surface border-cipher-border'

  const multipleColor = isProfitable ? 'text-cipher-green' : 'text-cipher-red'

  return (
    <div className={`p-4 rounded border flex flex-col gap-3 ${cardStyle}`}>
      <div className="flex justify-between items-center bg-cipher-bg/50 p-2 rounded -mt-2 -mx-2">
        <span className={`text-sm font-bold uppercase tracking-wider ${isBear ? 'text-cipher-red' : 'text-cipher-blue'}`}>
          {scenario.label} Case
        </span>
        <span className={`font-mono font-bold ${multipleColor}`}>
          {(scenario.returnMultiple ?? 0).toFixed(2)}x
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-cipher-dim">Target Price:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cipher-text">${scenario.targetPrice?.value?.toLocaleString() ?? '?'}</span>
            <VerificationTag tier={scenario.targetPrice?.tier} />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cipher-dim">Target MCap:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-cipher-text">${scenario.targetMcap?.value?.toLocaleString() ?? '?'}</span>
            <VerificationTag tier={scenario.targetMcap?.tier} />
          </div>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-cipher-border">
          <span className="text-cipher-dim">$1k turns into:</span>
          <span className={`font-mono font-bold ${multipleColor}`}>${scenario.dollarReturnOn1k?.toLocaleString() ?? '?'}</span>
        </div>
      </div>

      <p className="text-sm italic text-cipher-dim mt-2">{scenario.likelihood}</p>

      {scenario.triggers && scenario.triggers.length > 0 && (
        <div className="mt-2 pt-2 border-t border-cipher-border flex flex-col gap-1">
          <span className="text-xs text-cipher-dim font-semibold uppercase">Triggers:</span>
          <ul className="text-xs text-cipher-text list-disc pl-4 space-y-1">
            {scenario.triggers.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
