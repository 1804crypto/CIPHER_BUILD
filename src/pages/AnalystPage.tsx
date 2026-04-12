import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCipherStream } from '../hooks/useCipherStream'
import { useCipherStore } from '../store'
import { StreamingTerminal } from '../components/ui/StreamingTerminal'
import { RiskBanner } from '../components/ui/RiskBanner'
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge'
import { RedFlagGrid } from '../components/ui/RedFlagGrid'
import { ScenarioCard } from '../components/ui/ScenarioCard'
import { SignalRadar } from '../components/ui/SignalRadar'
import { CalcTable } from '../components/modules/Analyst/CalcTable'
import { LiquidityPanel } from '../components/modules/Analyst/LiquidityPanel'
import type { CipherAnalysis } from '../types'
import { Search } from 'lucide-react'

export const AnalystPage = () => {
  const [searchParams] = useSearchParams()
  const tickerQuery = searchParams.get('ticker') || ''
  
  const [tokenSearch, setTokenSearch] = useState(tickerQuery)
  const { status, rawText, searches, parsedData, error, stream, abort } = useCipherStream()
  const setAnalysis = useCipherStore(s => s.setAnalysis)
  const cachedAnalysis = useCipherStore(s => s.lastAnalysis[tokenSearch?.toUpperCase()])

  useEffect(() => {
    if (tickerQuery && !cachedAnalysis && status === 'idle') {
      handleAnalyse(tickerQuery)
    }
  }, [tickerQuery])

  useEffect(() => {
    if (status === 'done' && parsedData) {
      const data = parsedData as CipherAnalysis
      if (data.ticker) {
        setAnalysis(data.ticker.toUpperCase(), data)
      }
    }
  }, [status, parsedData, setAnalysis])

  const handleAnalyse = (searchTerm: string) => {
    if (!searchTerm) return
    const prompt = `
Run complete CIPHER analysis on: ${searchTerm}
Today's date: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
Execute all 5 Calculation Sets. Run all 5 Signal Layers. Run full Red Flag Detection.
Apply Epistemic Integrity Protocol — tag every data point with its verification tier.
List all data gaps explicitly in the dataGaps array.
Build all 4 price scenarios including the bear/zero case.
    `.trim()
    stream('analyst', prompt)
  }

  const result = (status === 'done' && parsedData ? parsedData : cachedAnalysis) as CipherAnalysis | null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-cipher-text">
      <div className="print:hidden">
        <RiskBanner />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center print:hidden mt-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-cipher-dim" size={18} />
          <input 
            type="text" 
            placeholder="Enter token name or ticker (e.g. INJ, Render)"
            className="w-full bg-cipher-surface border border-cipher-border rounded p-2 pl-10 text-cipher-text outline-none focus:border-cipher-blue uppercase"
            value={tokenSearch}
            onChange={e => setTokenSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && status !== 'streaming' && handleAnalyse(tokenSearch)}
          />
        </div>
        <button 
          onClick={() => handleAnalyse(tokenSearch)}
          disabled={status === 'streaming' || !tokenSearch}
          className="w-full md:w-auto px-6 py-2 bg-cipher-blue text-white font-bold rounded cursor-pointer hover:bg-cipher-blue/80 disabled:opacity-50 uppercase whitespace-nowrap"
        >
          Analyse
        </button>
      </div>

      <div className="print:hidden">
        <StreamingTerminal status={status} rawText={rawText} searches={searches} error={error} onAbort={abort} />
      </div>

      {status === 'error' && !result && rawText && (
        <div className="bg-cipher-surface border border-cipher-border p-4 rounded overflow-auto print:hidden">
          <h3 className="text-cipher-red font-bold mb-2">JSON Parse Failed - Fallback Output:</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{rawText}</pre>
        </div>
      )}

      {result && (
        <div id="analyst-report" className="flex flex-col gap-8 bg-cipher-bg p-4 rounded animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cipher-border pb-4">
            <div>
              <h1 className="text-4xl font-bold">{result.token} <span className="text-cipher-dim font-mono">${result.ticker}</span></h1>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => window.print()} className="print:hidden text-xs text-cipher-blue border border-cipher-blue px-3 py-1 rounded hover:bg-cipher-blue/10 cursor-pointer">
                Export PDF
              </button>
            </div>
          </div>

          <div className="p-4 bg-cipher-surface border border-cipher-border rounded flex flex-col sm:flex-row gap-4 items-center">
            <ConfidenceBadge tier={result.confidenceTier} />
            <p className="text-lg font-semibold flex-1">{result.verdict}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RedFlagGrid flags={result.redFlags} />
            </div>
            <div className="flex flex-col gap-6">
              <CalcTable metrics={result.metrics} />
              <LiquidityPanel liquidity={result.liquidity} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-4">
            <div className="xl:col-span-1 border border-cipher-border rounded p-4 bg-cipher-surface">
              <h3 className="font-bold mb-4">Signal Radar</h3>
              <SignalRadar layers={result.signalLayers} />
            </div>
            <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {result.scenarios?.map((s, i) => <ScenarioCard key={i} scenario={s} />)}
            </div>
          </div>

          {result.exitTriggers && (
            <div className="flex flex-col gap-4 border border-cipher-border rounded p-4 bg-cipher-surface mt-4">
              <h3 className="text-xl font-bold">Exit Triggers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-cipher-dim mb-2 uppercase">Fundamental</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.exitTriggers.fundamental?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cipher-dim mb-2 uppercase">On-Chain</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.exitTriggers.onchain?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-cipher-dim mb-2 uppercase">Narrative</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {result.exitTriggers.narrative?.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 mt-4">
             <div className="flex-1 p-4 bg-cipher-surface border border-cipher-border rounded">
               <h3 className="text-cipher-amber font-bold mb-2 uppercase">Bottom Line</h3>
               <p className="text-sm leading-relaxed">{result.bottomLine}</p>
             </div>
             <div className="w-full md:w-64 p-4 bg-cipher-blue/10 border border-cipher-blue rounded flex flex-col justify-center items-center text-center">
               <span className="text-xs text-cipher-blue uppercase font-bold mb-1">Max Position Size</span>
               <span className="text-3xl font-mono text-cipher-blue font-bold">{result.recommendedAllocationPct?.value}%</span>
               <span className="text-xs text-cipher-dim mt-2">Kelly %: {result.kellyPositionPct?.value?.toFixed(2)}%</span>
             </div>
          </div>

          {result.dataGaps && result.dataGaps.length > 0 && (
            <div className="mt-4 p-4 border border-cipher-border border-dashed rounded">
              <h4 className="font-bold text-cipher-dim mb-2 uppercase">Unverified Data Gaps</h4>
              <ul className="list-disc pl-5 text-sm text-cipher-dim space-y-1">
                {result.dataGaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
