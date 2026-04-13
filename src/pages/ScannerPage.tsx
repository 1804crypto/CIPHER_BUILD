import React, { useState } from 'react'
import { useCipherStream } from '../hooks/useCipherStream'
import { useCipherStore } from '../store'
import { StreamingTerminal } from '../components/ui/StreamingTerminal'
import { RiskBanner } from '../components/ui/RiskBanner'
import { CandidateCard } from '../components/modules/Scanner/CandidateCard'
import { NarrativeCard } from '../components/modules/Scanner/NarrativeCard'
import { Badge } from '../components/ui/Badge'
import type { ScannerResult } from '../types'
import { Search } from 'lucide-react'

export const ScannerPage = () => {
  const [keyword, setKeyword] = useState('')
  const { status, rawText, searches, parsedData, error, stream, abort } = useCipherStream()
  const setLastScan = useCipherStore(s => s.setLastScan)

  const handleHunt = () => {
    const prompt = `
Execute the CIPHER EARLY GEM SCANNER protocol.
${keyword ? `Focus narrative: ${keyword}` : 'Scan all top narratives.'}
Today's date: ${new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}.
Run all 8 steps of the protocol. Apply the Epistemic Integrity Protocol to every data point.
For each candidate that passes the Red Flag screen, run all 5 Calculation Sets.
    `.trim()
    stream('scanner', prompt)
  }

  React.useEffect(() => {
    if (status === 'done' && parsedData) {
      setLastScan(parsedData as ScannerResult)
    }
  }, [status, parsedData, setLastScan])

  const result = parsedData as ScannerResult | null

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full text-cipher-text">
      <RiskBanner />
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 text-cipher-dim" size={18} />
          <input 
            type="text" 
            placeholder="Enter a narrative keyword or leave blank for full scan"
            className="w-full bg-cipher-surface border border-cipher-border rounded p-2 pl-10 text-cipher-text outline-none focus:border-cipher-blue"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && status !== 'streaming' && handleHunt()}
          />
        </div>
        <button 
          onClick={handleHunt}
          disabled={status === 'streaming'}
          className="w-full md:w-auto px-8 py-3 bg-cipher-blue text-white font-bold rounded cursor-pointer hover:bg-cipher-blue/90 disabled:opacity-50 uppercase whitespace-nowrap transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 tracking-wide"
        >
          Hunt Alpha
        </button>
      </div>

      <StreamingTerminal status={status} rawText={rawText} searches={searches} error={error} onAbort={abort} onRetry={handleHunt} />

      {status === 'error' && !result && rawText && (
        <div className="bg-cipher-surface border border-cipher-border p-4 rounded overflow-auto">
          <h3 className="text-cipher-red font-bold mb-2">JSON Parse Failed - Fallback Output:</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{rawText}</pre>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-wrap gap-4 items-center p-4 bg-cipher-surface border border-cipher-border rounded">
            <span className="font-bold">Macro Context:</span>
            <Badge className="border-cipher-blue text-cipher-blue">BTC: ${result.macro?.btcPrice?.value?.toLocaleString()}</Badge>
            <Badge className="border-cipher-blue text-cipher-blue">Dom: {result.macro?.btcDominance?.value}%</Badge>
            <Badge className="border-cipher-blue text-cipher-blue">F&G: {result.macro?.fearGreedIndex?.value}</Badge>
            <Badge className="border-cipher-purple text-cipher-purple uppercase">{result.macro?.cyclePhase?.value}</Badge>
          </div>

          {result.dataGaps && result.dataGaps.length > 0 && (
            <div className="p-4 bg-cipher-surface border w-full border-cipher-border rounded">
              <span className="font-bold text-cipher-amber block mb-2">Data Gaps</span>
              <ul className="list-disc pl-5 text-sm text-cipher-dim space-y-1">
                {result.dataGaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Narrative Heatmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.narratives?.map((n, i) => <NarrativeCard key={i} narrative={n} />)}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-cipher-border pt-6">
            <h2 className="text-xl font-bold">Candidates</h2>
            <div className="flex flex-col gap-6">
              {result.candidates?.map((c, i) => <CandidateCard key={i} candidate={c} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
