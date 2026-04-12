import React, { useState } from 'react'
import { useCipherStream } from '../hooks/useCipherStream'
import { useCipherStore } from '../store'
import { StreamingTerminal } from '../components/ui/StreamingTerminal'
import { RiskBanner } from '../components/ui/RiskBanner'
import { HoldingRow } from '../components/modules/Portfolio/HoldingRow'
import { SectorPie } from '../components/modules/Portfolio/SectorPie'
import type { PortfolioAudit } from '../types'
import { Plus, Trash2 } from 'lucide-react'

export const PortfolioPage = () => {
  const { status, rawText, searches, parsedData, error, stream, abort } = useCipherStream()
  const holdings = useCipherStore(s => s.holdings)
  const addHolding = useCipherStore(s => s.addHolding)
  const removeHolding = useCipherStore(s => s.removeHolding)

  const [newHolding, setNewHolding] = useState({ token: '', ticker: '', amount: '', entryPrice: '', entryDate: '', notes: '' })
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = () => {
    if (!newHolding.token || !newHolding.ticker || !newHolding.amount || !newHolding.entryPrice) return
    addHolding({
      id: Math.random().toString(36).substr(2, 9),
      token: newHolding.token,
      ticker: newHolding.ticker.toUpperCase(),
      amount: Number(newHolding.amount),
      entryPrice: Number(newHolding.entryPrice),
      entryDate: newHolding.entryDate || new Date().toISOString().split('T')[0],
      notes: newHolding.notes
    })
    setNewHolding({ token: '', ticker: '', amount: '', entryPrice: '', entryDate: '', notes: '' })
    setIsAdding(false)
  }

  const handleAudit = () => {
    if (holdings.length === 0) return
    const prompt = `
Execute the CIPHER PORTFOLIO AUDIT protocol.
Today's date: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
Holdings to audit:
${holdings.map(h => `- ${h.token} (${h.ticker}): ${h.amount} units, entry price $${h.entryPrice}, entered ${h.entryDate}`).join('\n')}

For each holding: verify current price, check FDV risk, search for upcoming unlocks, run Red Flag Detection, and assign verdict (HOLD/SCALE/REDUCE/EXIT) with rationale.
Check portfolio concentration — flag any single position >15%.
Assess cycle alignment.
Apply Epistemic Integrity Protocol throughout.
    `.trim()
    stream('portfolio', prompt)
  }

  const result = parsedData as PortfolioAudit | null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-cipher-text">
      <RiskBanner />

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Auditor</h1>
          <p className="text-cipher-dim mt-1">Independent analysis and risk assessment of your current positions.</p>
        </div>
        <button 
          onClick={handleAudit}
          disabled={status === 'streaming' || holdings.length === 0}
          className="px-6 py-2 bg-cipher-blue text-white font-bold rounded cursor-pointer hover:bg-cipher-blue/80 disabled:opacity-50 uppercase whitespace-nowrap"
        >
          Run Portfolio Audit
        </button>
      </div>

      <div className="bg-cipher-surface border border-cipher-border rounded p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-cipher-border pb-2">
          <h2 className="text-xl font-bold">Your Holdings</h2>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-1 text-sm text-cipher-blue hover:bg-cipher-blue/10 px-2 py-1 rounded cursor-pointer">
            <Plus size={16} /> Add Position
          </button>
        </div>

        {isAdding && (
          <div className="bg-cipher-bg p-4 rounded border border-cipher-blue/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="text-xs text-cipher-dim block mb-1">Token Name</label>
              <input type="text" placeholder="Bitcoin" value={newHolding.token} onChange={e => setNewHolding(s => ({...s, token: e.target.value}))} className="w-full bg-cipher-surface border border-cipher-border rounded p-2 text-sm outline-none focus:border-cipher-blue" />
            </div>
            <div>
              <label className="text-xs text-cipher-dim block mb-1">Ticker</label>
              <input type="text" placeholder="BTC" value={newHolding.ticker} onChange={e => setNewHolding(s => ({...s, ticker: e.target.value}))} className="w-full bg-cipher-surface border border-cipher-border rounded p-2 text-sm outline-none focus:border-cipher-blue" />
            </div>
            <div>
              <label className="text-xs text-cipher-dim block mb-1">Amount</label>
              <input type="number" placeholder="0.5" value={newHolding.amount} onChange={e => setNewHolding(s => ({...s, amount: e.target.value}))} className="w-full bg-cipher-surface border border-cipher-border rounded p-2 text-sm outline-none focus:border-cipher-blue" />
            </div>
            <div>
              <label className="text-xs text-cipher-dim block mb-1">Entry Price (USD)</label>
              <input type="number" placeholder="60000" value={newHolding.entryPrice} onChange={e => setNewHolding(s => ({...s, entryPrice: e.target.value}))} className="w-full bg-cipher-surface border border-cipher-border rounded p-2 text-sm outline-none focus:border-cipher-blue" />
            </div>
            <div>
              <label className="text-xs text-cipher-dim block mb-1">Entry Date (opt)</label>
              <input type="date" value={newHolding.entryDate} onChange={e => setNewHolding(s => ({...s, entryDate: e.target.value}))} className="w-full bg-cipher-surface border border-cipher-border rounded p-2 text-sm outline-none focus:border-cipher-blue" />
            </div>
            <button onClick={handleAdd} className="w-full py-2 bg-cipher-green text-cipher-bg font-bold rounded hover:bg-cipher-green/80 cursor-pointer">Save</button>
          </div>
        )}

        {holdings.length === 0 ? (
          <div className="text-center py-8 text-cipher-dim">
            <p>No holdings added yet.</p>
            <p className="text-sm">Add your positions to run a full risk audit.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {holdings.map((h) => (
              <div key={h.id} className="flex justify-between items-center p-3 bg-cipher-bg border border-cipher-border rounded text-sm">
                <div className="flex flex-col w-1/4">
                  <span className="font-bold">{h.token}</span>
                  <span className="text-xs text-cipher-dim">{h.ticker}</span>
                </div>
                <span className="font-mono w-1/4">{h.amount}</span>
                <span className="font-mono w-1/4">${h.entryPrice}</span>
                <button onClick={() => removeHolding(h.id)} className="text-cipher-red hover:bg-cipher-red/10 p-1 rounded cursor-pointer">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StreamingTerminal status={status} rawText={rawText} searches={searches} error={error} onAbort={abort} />

      {status === 'error' && !result && rawText && (
        <div className="bg-cipher-surface border border-cipher-border p-4 rounded overflow-auto">
          <h3 className="text-cipher-red font-bold mb-2">JSON Parse Failed - Fallback Output:</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{rawText}</pre>
        </div>
      )}

      {result && status === 'done' && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-4">
               <div className="p-4 bg-cipher-surface border border-cipher-border rounded">
                 <span className="text-xs text-cipher-dim uppercase font-bold block mb-1">Total Value</span>
                 <span className="text-3xl font-mono">${result.totalValueUsd?.toLocaleString()}</span>
                 <span className={`text-sm font-bold block mt-1 ${result.totalPnlPct >= 0 ? 'text-cipher-green' : 'text-cipher-red'}`}>
                   {result.totalPnlPct >= 0 ? '+' : ''}{result.totalPnlPct?.toFixed(2)}% All-Time PnL
                 </span>
               </div>
               
               <div className="p-4 bg-cipher-surface border border-cipher-border rounded">
                 <h3 className="font-bold mb-3 border-b border-cipher-border pb-2 inline-flex">Cycle Alignment</h3>
                 <p className="text-sm leading-relaxed">{result.cycleAlignment}</p>
               </div>
            </div>

            <div className="lg:col-span-2 p-4 bg-cipher-surface border border-cipher-border rounded flex flex-col items-center">
              <h3 className="font-bold w-full mb-2">Sector Exposure</h3>
              <SectorPie data={result.sectorExposure} />
            </div>
          </div>

          {(result.concentrationWarnings?.length > 0 || result.rebalancingSuggestions?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {result.concentrationWarnings?.length > 0 && (
                <div className="p-4 bg-cipher-amber/10 border border-cipher-amber rounded text-cipher-amber">
                  <h3 className="font-bold mb-2 uppercase text-sm">Concentration Warnings</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.concentrationWarnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}
              {result.rebalancingSuggestions?.length > 0 && (
                <div className="p-4 bg-cipher-blue/10 border border-cipher-blue rounded text-cipher-blue">
                  <h3 className="font-bold mb-2 uppercase text-sm">Rebalancing Suggestions</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.rebalancingSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result.dataGaps && result.dataGaps.length > 0 && (
            <div className="p-4 border border-cipher-border border-dashed rounded">
              <h4 className="font-bold text-cipher-dim mb-2 uppercase text-sm">Unverified Data Gaps</h4>
              <ul className="list-disc pl-5 text-sm text-cipher-dim space-y-1">
                {result.dataGaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4 mt-2">
            <h2 className="text-xl font-bold">Audited Positions</h2>
            <div className="flex flex-col gap-3">
              {result.holdings?.map((h, i) => <HoldingRow key={i} holding={h} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
