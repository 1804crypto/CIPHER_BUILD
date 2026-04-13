import React from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { useGlobalData } from '../../hooks/usePrices'

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: globalData } = useGlobalData()

  return (
    <div className="flex h-screen bg-cipher-bg bg-mesh text-cipher-text overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full lg:ml-64 relative pb-[72px] lg:pb-0 h-full overflow-hidden bg-transparent">
        
        {/* Top Bar */}
        <header className="h-[60px] glass-panel-heavy border-x-0 border-t-0 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <div className="flex items-center lg:hidden gap-2">
            <div className="w-6 h-6 bg-cipher-blue rounded flex items-center justify-center font-bold text-[10px] text-white shadow shadow-cipher-blue/50">C</div>
            <span className="font-bold tracking-widest text-white text-sm">CIPHER</span>
          </div>
          <div className="hidden lg:flex items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-cipher-dim flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cipher-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cipher-green"></span>
              </span>
              Global Macro Stream
            </span>
          </div>
          
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-[11px] lg:text-xs font-mono ml-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-cipher-dim uppercase">Total MCap:</span>
              <span className="text-cipher-blue font-bold">
                {globalData?.data?.total_market_cap?.usd ? `$${(globalData.data.total_market_cap.usd / 1e12).toFixed(2)}T` : 'Fetching...'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex border-l border-cipher-border pl-4">
               <span className="text-cipher-dim uppercase">BTC Dom:</span>
               <span className="text-cipher-purple font-bold">
                 {globalData?.data?.market_cap_percentage?.btc ? `${globalData.data.market_cap_percentage.btc.toFixed(1)}%` : '...'}
               </span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex border-l border-cipher-border pl-4">
               <span className="text-cipher-dim uppercase">24h Change:</span>
               <span className={`font-bold ${globalData?.data?.market_cap_change_percentage_24h_usd >= 0 ? 'text-cipher-green' : 'text-cipher-red'}`}>
                 {globalData?.data?.market_cap_change_percentage_24h_usd != null ? `${globalData.data.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%` : '...'}
               </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto relative scroll-smooth bg-transparent">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
