import React, { useState } from 'react'
import { useCipherStream } from '../hooks/useCipherStream'
import { StreamingTerminal } from '../components/ui/StreamingTerminal'
import { RiskBanner } from '../components/ui/RiskBanner'
import { TPLadder } from '../components/modules/Exit/TPLadder'
import { ExitSignalList } from '../components/modules/Exit/ExitSignalList'
import type { ExitIntelligence } from '../types'
import { Calculator } from 'lucide-react'

export const ExitPage = () => {
  const { status, rawText, searches, parsedData, error, stream, abort } = useCipherStream()

  const [input, setInput] = useState({ token: '', entryPrice: '', positionSizeUsd: '' })

  const handleCalculate = () => {
    if (!input.token || !input.entryPrice || !input.positionSizeUsd) return
    
    const prompt = `
Execute the CIPHER EXIT STRATEGY protocol for:
Token: ${input.token}
Entry Price: $${input.entryPrice}
Position Size: $${input.positionSizeUsd}
Today's date: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.

Check current price, calculate current multiple.
Identify current Narrative Phase.
Assess all 12 Exit Signals — list only the ones that are currently triggered.
Generate a staggered 4-tier take-profit (TP) ladder using the conservative framework.
Define a hard stop-loss price and provide the rationale.
    `.trim()
    stream('exit', prompt)
  }

  const result = parsedData as ExitIntelligence | null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-cipher-text">
      <RiskBanner />

      <div className="flex flex-col">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="text-cipher-blue" />
          Exit Planner
        </h1>
        <p className="text-cipher-dim mt-1">Determine robust take-profit layering and stop-loss logic for a single position.</p>
      </div>

      <div className="bg-cipher-surface border border-cipher-border rounded p-4 md:p-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full">
          <label className="text-xs text-cipher-dim block mb-1 uppercase font-bold">Token Ticker</label>
          <input 
            type="text" 
            placeholder="e.g. BTC" 
            value={input.token} 
            onChange={e => setInput(s => ({...s, token: e.target.value.toUpperCase()}))} 
            className="w-full bg-cipher-bg border border-cipher-border rounded p-3 outline-none focus:border-cipher-blue" 
          />
        </div>
        <div className="w-full">
          <label className="text-xs text-cipher-dim block mb-1 uppercase font-bold">Entry Price (USD)</label>
          <input 
            type="number" 
            placeholder="e.g. 60000" 
            value={input.entryPrice} 
            onChange={e => setInput(s => ({...s, entryPrice: e.target.value}))} 
            className="w-full bg-cipher-bg border border-cipher-border rounded p-3 outline-none focus:border-cipher-blue font-mono" 
          />
        </div>
        <div className="w-full">
          <label className="text-xs text-cipher-dim block mb-1 uppercase font-bold">Position Size (USD)</label>
          <input 
            type="number" 
            placeholder="e.g. 1000" 
            value={input.positionSizeUsd} 
            onChange={e => setInput(s => ({...s, positionSizeUsd: e.target.value}))} 
            className="w-full bg-cipher-bg border border-cipher-border rounded p-3 outline-none focus:border-cipher-blue font-mono" 
          />
        </div>
        <button 
          onClick={handleCalculate}
          disabled={status === 'streaming'}
          className="w-full md:w-auto px-8 py-3 bg-cipher-blue text-white font-bold rounded cursor-pointer hover:bg-cipher-blue/90 disabled:opacity-50 uppercase whitespace-nowrap transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 tracking-wide"
        >
          Plan Exit
        </button>
      </div>

      <StreamingTerminal status={status} rawText={rawText} searches={searches} error={error} onAbort={abort} onRetry={handleCalculate} />

      {status === 'error' && !result && rawText && (
        <div className="bg-cipher-surface border border-cipher-border p-4 rounded overflow-auto">
          <h3 className="text-cipher-red font-bold mb-2">JSON Parse Failed - Fallback Output:</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{rawText}</pre>
        </div>
      )}

      {result && status === 'done' && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-cipher-bg p-4 rounded border border-cipher-border">
          
          <div className="flex flex-col md:flex-row gap-6 justify-between border-b border-cipher-border pb-6">
            <div>
              <h2 className="text-3xl font-bold">{result.token} Position</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-2 py-1 bg-cipher-surface border border-cipher-dim rounded text-xs text-cipher-dim">
                  Narrative Phase: <span className="font-bold text-cipher-text">{result.narrativePhase}</span>
                </span>
                <span className="px-2 py-1 bg-cipher-surface border border-cipher-dim rounded text-xs text-cipher-dim">
                  Moonbag: <span className="font-bold text-cipher-text">{result.moonbagPct}%</span>
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col">
                 <span className="text-xs text-cipher-dim uppercase text-right">Current Price</span>
                 <span className="text-xl font-mono text-right">${result.currentPrice?.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-xs text-cipher-dim uppercase text-right">Current Multiplier</span>
                 <span className={`text-xl font-mono text-right font-bold ${result.currentMultiple >= 1 ? 'text-cipher-green' : 'text-cipher-red'}`}>
                   {result.currentMultiple?.toFixed(2)}x
                 </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TPLadder layers={result.tpLayers} />
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 p-4 bg-cipher-surface border border-cipher-border rounded">
                <h3 className="font-bold text-sm uppercase text-cipher-dim">Stop-Loss Guard</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-mono text-cipher-red border-b border-cipher-red">${result.stopLossPrice?.toLocaleString()}</span>
                </div>
                <p className="text-sm leading-relaxed mt-2 p-3 bg-cipher-bg border border-cipher-border rounded">
                  {result.stopRationale}
                </p>
              </div>

              <ExitSignalList signals={result.triggeredSignals} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
