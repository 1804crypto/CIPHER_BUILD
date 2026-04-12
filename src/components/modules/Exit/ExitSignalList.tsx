import React from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export const ExitSignalList: React.FC<{ signals?: string[] }> = ({ signals }) => {
  if (!signals) return null
  
  if (signals.length === 0) {
    return (
      <div className="p-4 bg-cipher-surface border border-cipher-border rounded flex items-start gap-3">
        <CheckCircle2 className="text-cipher-green shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cipher-green block mb-1">Clear Skies</span>
          <p className="text-sm text-cipher-dim">No major exit signals are currently triggered based on the analysis. Maintain position monitoring.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold border-b border-cipher-border pb-2 flex items-center gap-2">
        <AlertCircle className="text-cipher-red" size={20} />
        Triggered Exit Signals
      </h3>
      <div className="p-4 bg-cipher-red/10 border border-cipher-red rounded text-cipher-red">
         <p className="text-sm font-bold mb-3 uppercase tracking-wide">Warning: The following signs of cycle exhaustion or token risk have been identified</p>
         <ul className="space-y-4">
           {signals.map((s, i) => (
             <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
               <span className="text-cipher-red shrink-0 font-bold">•</span>
               <span>{s}</span>
             </li>
           ))}
         </ul>
      </div>
    </div>
  )
}
