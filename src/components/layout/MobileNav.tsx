import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Activity, Search, Briefcase, Calculator, Star, X } from 'lucide-react'
import { useCipherStore } from '../../store'

export const MobileNav: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const watchlist = useCipherStore(s => s.watchlist)
  const removeFromWatchlist = useCipherStore(s => s.removeFromWatchlist)
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', icon: Activity, label: 'Scan' },
    { to: '/analyst', icon: Search, label: 'Analyse' },
    { to: '/portfolio', icon: Briefcase, label: 'Audit' },
    { to: '/exit', icon: Calculator, label: 'Exit' },
  ]

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-cipher-surface border-t border-cipher-border flex lg:hidden justify-around items-center h-[72px] z-50 text-[10px] uppercase font-bold text-cipher-dim pb-safe">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setDrawerOpen(false)}
            className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors ${isActive ? 'text-cipher-blue bg-cipher-blue/5' : 'hover:text-cipher-text hover:bg-cipher-bg'}`}
          >
            <Icon size={22} className="mb-0.5" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button 
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors ${drawerOpen ? 'text-amber-400 bg-amber-400/5' : 'hover:text-cipher-text hover:bg-cipher-bg'}`}
        >
          <div className="relative mb-0.5">
            <Star size={22} />
            {watchlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-cipher-blue text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </div>
          <span>Watchlist</span>
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end lg:hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setDrawerOpen(false)} />
          <div className="bg-cipher-surface border-t border-cipher-border border-x rounded-t-xl max-h-[80vh] flex flex-col mb-[72px] relative z-50 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-8 duration-300">
            <div className="p-4 border-b border-cipher-border flex justify-between items-center bg-cipher-bg/50 rounded-t-xl shrink-0">
              <h3 className="font-bold flex items-center gap-2">
                Watchlist <span className="text-xs bg-cipher-surface border border-cipher-border px-2 py-0.5 rounded text-cipher-dim">{watchlist.length}</span>
              </h3>
              <button type="button" onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-cipher-surface rounded-full text-cipher-dim hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-3">
              {watchlist.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="mx-auto text-cipher-dim mb-3 opacity-20" size={48} />
                  <p className="text-sm text-cipher-dim uppercase font-bold">Watchlist Empty</p>
                  <p className="text-xs text-cipher-dim mt-1">Run a scan to find new candidates</p>
                </div>
              ) : (
                watchlist.map(token => (
                  <div key={token.ticker} className="bg-cipher-bg border border-cipher-border rounded p-4 flex justify-between items-center">
                    <div className="flex flex-col gap-1.5 w-1/2">
                      <span className="font-bold text-cipher-text">{token.ticker}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-cipher-surface border border-cipher-border h-2 rounded overflow-hidden">
                          <div className="bg-cipher-blue h-full transition-all" style={{ width: `${(token.conviction / 10) * 100}%` }} />
                        </div>
                        <span className="text-xs text-cipher-dim font-mono">{token.conviction}/10</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => { setDrawerOpen(false); navigate(`/analyst?ticker=${token.ticker}`) }}
                        className="text-xs font-bold px-4 py-2 bg-cipher-blue/10 border border-cipher-blue text-cipher-blue hover:bg-cipher-blue hover:text-white rounded cursor-pointer transition-colors"
                      >
                        Analyse
                      </button>
                      <button type="button" onClick={() => removeFromWatchlist(token.ticker)} className="text-cipher-dim hover:text-cipher-red hover:bg-cipher-red/10 p-2 rounded transition-colors border border-transparent">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
