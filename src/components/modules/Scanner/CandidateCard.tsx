import React from 'react'
import type { CandidateToken } from '../../../types'
import { ConfidenceBadge } from '../../ui/ConfidenceBadge'
import { ScenarioCard } from '../../ui/ScenarioCard'
import { useCipherStore } from '../../../store'
import { useNavigate } from 'react-router-dom'

export const CandidateCard: React.FC<{ candidate: CandidateToken }> = ({ candidate }) => {
  const addToWatchlist = useCipherStore(s => s.addToWatchlist)
  const navigate = useNavigate()

  return (
    <div className="glass-panel hover:border-cipher-blue/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 rounded-xl p-6 flex flex-col gap-6 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cipher-blue/0 to-cipher-purple/0 group-hover:from-cipher-blue/5 group-hover:to-cipher-purple/5 transition-all duration-500 pointer-events-none" />
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h3 className="text-2xl font-bold">{candidate.name} <span className="text-cipher-dim font-mono text-lg">${candidate.ticker}</span></h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-cipher-dim font-mono">
            <span>MCap: ${candidate.mcap?.value?.toLocaleString() ?? '?'}</span>
            <span>FDV: ${candidate.fdv?.value?.toLocaleString() ?? '?'}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <ConfidenceBadge tier={candidate.confidenceTier} />
          <div className="flex gap-2 font-mono text-sm mt-1">
            <span className="px-2 py-1 bg-cipher-bg border-cipher-border border rounded">EV: {candidate.evScore}/10</span>
            <span className="px-2 py-1 bg-cipher-bg border-cipher-border border rounded text-cipher-blue">Conv: {candidate.conviction}/10</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-[-10px]">
        <button onClick={() => addToWatchlist(candidate)} className="text-xs px-3 py-1 bg-cipher-bg border border-cipher-border hover:border-cipher-blue rounded cursor-pointer transition-colors">
          + Watchlist
        </button>
        <button onClick={() => navigate(`/analyst?ticker=${candidate.ticker}`)} className="text-xs px-3 py-1 bg-cipher-blue text-white rounded hover:bg-cipher-blue/80 font-bold cursor-pointer transition-colors">
          Deep Analyse →
        </button>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-cipher-bg rounded border border-cipher-border">
        <span className="text-sm font-bold uppercase text-cipher-blue">Thesis: Why retail doesn't know yet</span>
        <p className="text-sm">{candidate.whyRetailDoesntKnow}</p>
        <span className="text-sm font-bold uppercase text-cipher-amber mt-2">Key Catalyst:</span>
        <p className="text-sm text-cipher-dim">{candidate.keyCatalyst}</p>
      </div>
      
      {candidate.redFlagSummary && candidate.redFlagSummary.length > 0 && (
        <div className="flex flex-col gap-1 p-3 bg-cipher-red/10 border border-cipher-red rounded">
          <span className="text-xs font-bold text-cipher-red uppercase mb-1">Red Flag Summary</span>
          <ul className="list-disc pl-4 text-sm text-cipher-red space-y-1">
            {candidate.redFlagSummary.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {candidate.scenarios?.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
      </div>
    </div>
  )
}
