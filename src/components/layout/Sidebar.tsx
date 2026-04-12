import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, Search, Briefcase, Calculator, X } from 'lucide-react'
import { useCipherStore } from '../../store'

export const Sidebar: React.FC = () => {
  const watchlist = useCipherStore(s => s.watchlist)
  const removeFromWatchlist = useCipherStore(s => s.removeFromWatchlist)
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', icon: Activity, label: 'Scanner' },
    { to: '/analyst', icon: Search, label: 'Deep Analyst' },
    { to: '/portfolio', icon: Briefcase, label: 'Portfolio Auditor' },
    { to: '/exit', icon: Calculator, label: 'Exit Planner' },
  ]

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-cipher-surface border-r border-cipher-border hidden lg:flex flex-col z-50">
      <div className="p-6 border-b border-cipher-border flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-cipher-blue rounded flex items-center justify-center font-bold text-white shadow shadow-cipher-blue/50">C</div>
        <span className="font-bold text-xl tracking-widest text-white">CIPHER</span>
      </div>

      <nav className="p-4 flex flex-col gap-2 shrink-0">
        <span className="text-xs font-bold text-cipher-dim uppercase ml-2 mb-2">Modules</span>
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink 
            key={to} 
            to={to} 
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${isActive ? 'bg-cipher-blue/10 text-cipher-blue font-bold border border-cipher-blue/30' : 'text-cipher-dim hover:text-cipher-text hover:bg-cipher-bg border border-transparent'}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <span className="text-xs font-bold text-cipher-dim uppercase ml-2 mb-2 flex items-center gap-2">
          Watchlist
          <span className="px-1.5 py-0.5 bg-cipher-bg border border-cipher-border rounded-full text-[10px]">{watchlist.length}</span>
        </span>
        {watchlist.length === 0 ? (
          <p className="text-xs text-cipher-dim px-2 italic">No tokens on watchlist. Run a scan to find candidates.</p>
        ) : (
          watchlist.map(token => (
            <div key={token.ticker} className="bg-cipher-bg border border-cipher-border rounded p-3 flex flex-col gap-2 relative group">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-cipher-text">{token.ticker}</span>
                <button onClick={() => removeFromWatchlist(token.ticker)} className="text-cipher-dim hover:text-cipher-red cursor-pointer p-1">
                  <X size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-cipher-surface border border-cipher-border h-2 rounded overflow-hidden">
                  <div className="bg-cipher-blue h-full transition-all" style={{ width: `${(token.conviction / 10) * 100}%` }} />
                </div>
                <span className="text-[10px] text-cipher-dim font-mono">{token.conviction}/10</span>
              </div>
              <button 
                onClick={() => navigate(`/analyst?ticker=${token.ticker}`)}
                className="w-full text-xs py-1.5 text-cipher-dim bg-cipher-surface border border-cipher-border hover:bg-cipher-blue/10 hover:border-cipher-blue hover:text-cipher-blue rounded mt-1 cursor-pointer transition-colors font-semibold"
              >
                Deep Analyse
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-cipher-border text-center flex flex-col shrink-0 bg-cipher-bg/50">
        <span className="text-xs text-cipher-dim font-mono font-bold">CIPHER v3.0</span>
        <span className="text-[10px] text-cipher-dim mt-1 cursor-pointer hover:underline hover:text-cipher-text transition-colors">Risk Disclaimer</span>
      </div>
    </aside>
  )
}
