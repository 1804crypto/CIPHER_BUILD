import React, { useEffect, useRef } from 'react'
import { Terminal, Search, AlertCircle, XCircle } from 'lucide-react'

interface Props {
  status: 'idle' | 'streaming' | 'done' | 'error'
  rawText: string
  searches: string[]
  error: string | null
  onAbort?: () => void
}

export const StreamingTerminal: React.FC<Props> = ({ status, rawText, searches, error, onAbort }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [rawText, searches, status])

  if (status === 'idle') return null

  const isStreaming = status === 'streaming'

  const getStatusColor = () => {
    if (status === 'error') return 'text-cipher-red bg-cipher-red/10 border-cipher-red'
    if (status === 'done') return 'text-cipher-green bg-cipher-green/10 border-cipher-green'
    return 'text-cipher-blue bg-cipher-blue/10 border-cipher-blue'
  }

  return (
    <div className="flex flex-col bg-cipher-bg border border-cipher-border rounded overflow-hidden">
      <div className="flex justify-between items-center p-2 bg-cipher-surface border-b border-cipher-border text-xs">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-cipher-dim" />
          <span className="font-mono text-cipher-dim uppercase tracking-wider">Cipher Console</span>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase z-10 ${getStatusColor()}`}>
            {status}
          </span>
        </div>
        {isStreaming && onAbort && (
          <button 
            type="button"
            onClick={onAbort}
            className="flex items-center gap-1 text-cipher-red hover:bg-cipher-red/10 px-2 py-1 rounded transition-colors z-10 relative"
          >
            <XCircle size={14} />
            <span>ABORT</span>
          </button>
        )}
      </div>

      <div className="p-3 bg-cipher-surface border-b border-cipher-border flex flex-wrap gap-2 min-h-12 max-h-32 overflow-y-auto">
        {searches.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-cipher-bg border border-cipher-muted rounded-full text-xs text-cipher-blue font-mono border-l-2 border-l-cipher-blue">
            <Search size={12} />
            <span>{s}</span>
          </div>
        ))}
        {searches.length === 0 && (
          <span className="text-xs text-cipher-dim font-mono italic">Waiting for search telemetry...</span>
        )}
      </div>

      <div ref={scrollRef} className="p-4 h-64 overflow-y-auto font-mono text-sm text-cipher-text whitespace-pre-wrap leading-relaxed relative overflow-hidden">
        {isStreaming && (
          <div className="absolute left-0 right-0 h-[200%] pointer-events-none opacity-20" style={{
            background: 'linear-gradient(to bottom, rgba(10,10,15,0) 0%, rgba(59,130,246,0.3) 50%, rgba(10,10,15,0) 100%)',
            animation: 'scan 2s linear infinite'
          }} />
        )}
        
        <div className="relative z-10 mix-blend-screen">
          {rawText || <span className="text-cipher-dim">Awaiting response body...</span>}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-cipher-green ml-1 animate-cursor-blink align-middle" />
          )}
        </div>

        {error && (
          <div className="relative z-10 mt-4 p-3 bg-cipher-red/10 border border-cipher-red/50 text-cipher-red rounded flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
