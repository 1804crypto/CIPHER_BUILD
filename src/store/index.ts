import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CipherStore, CandidateToken, Holding, ScannerResult, CipherAnalysis } from '../types'

export const useCipherStore = create<CipherStore>()(
  persist(
    (set) => ({
      watchlist: [],
      holdings: [],
      lastScan: null,
      lastAnalysis: {},

      addToWatchlist: (token) =>
        set((s) => ({
          watchlist: s.watchlist.find(t => t.ticker === token.ticker)
            ? s.watchlist
            : [...s.watchlist, token]
        })),

      removeFromWatchlist: (ticker) =>
        set((s) => ({ watchlist: s.watchlist.filter(t => t.ticker !== ticker) })),

      addHolding: (holding) =>
        set((s) => ({ holdings: [...s.holdings, holding] })),

      removeHolding: (id) =>
        set((s) => ({ holdings: s.holdings.filter(h => h.id !== id) })),

      updateHolding: (id, updates) =>
        set((s) => ({
          holdings: s.holdings.map(h => h.id === id ? { ...h, ...updates } : h)
        })),

      setLastScan: (scan) => set({ lastScan: scan }),

      setAnalysis: (ticker, analysis) =>
        set((s) => ({ lastAnalysis: { ...s.lastAnalysis, [ticker]: analysis } })),
    }),
    {
      name: 'cipher-store',
      partialize: (s) => ({
        watchlist: s.watchlist,
        holdings: s.holdings,
        lastScan: s.lastScan,
        lastAnalysis: s.lastAnalysis,
      })
    }
  )
)
