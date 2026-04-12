// Verification and confidence tiers
export type VerificationTier = 'VERIFIED' | 'ESTIMATED' | 'UNVERIFIED' | 'UNAVAILABLE'
export type ConfidenceTier = 'HIGH' | 'MODERATE' | 'LOW' | 'INSUFFICIENT'
export type RedFlagLevel = 'GREEN' | 'YELLOW' | 'RED' | 'UNVERIFIED'
export type NarrativeStatus = 'Pre-Discovery' | 'Early Adoption' | 'Growing Awareness' | 'Peak Hype' | 'Late' | 'Dead'
export type CyclePhase = 'Deep Bear' | 'Early Accumulation' | 'Early Bull' | 'Mid Bull' | 'Late Bull' | 'Distribution' | 'Bear Onset'
export type PositionVerdict = 'HOLD' | 'SCALE' | 'REDUCE' | 'EXIT'

export interface DataPoint<T> {
  value: T
  tier: VerificationTier
  source?: string
}

export interface MacroSnapshot {
  btcPrice: DataPoint<number>
  btcDominance: DataPoint<number>
  fearGreedIndex: DataPoint<number>
  totalMarketCap: DataPoint<number>
  cyclePhase: DataPoint<CyclePhase>
  halvingMonths: DataPoint<number>
  summary: string
}

export interface Narrative {
  name: string
  status: NarrativeStatus
  saturationPct: number
  vcBacked: boolean
  description: string
}

export interface RedFlagCheck {
  label: string
  level: RedFlagLevel
  detail: string
}

export interface RedFlags {
  contract: RedFlagCheck[]
  team: RedFlagCheck[]
  tokenomics: RedFlagCheck[]
  liquidity: RedFlagCheck[]
  criticalCount: number
}

export interface PriceScenario {
  label: 'Base' | 'Bull' | 'Ultra Bull' | 'Bear'
  targetMcap: DataPoint<number>
  targetPrice: DataPoint<number>
  returnMultiple: number
  dollarReturnOn1k: number
  likelihood: string   // plain English — no fake percentages
  triggers: string[]
}

export interface SignalLayer {
  name: string
  score: number         // 0–10
  confidence: ConfidenceTier
  findings: string[]
  searchesRun: string[]
}

export interface LiquidityMetrics {
  volumeMcapRatio: DataPoint<number>
  daysToExit10k: DataPoint<number>
  slippage10k: DataPoint<number>
  exchangeTier: DataPoint<string>
  liquidityScore: 'HIGH' | 'ADEQUATE' | 'THIN' | 'ILLIQUID'
}

export interface TokenMetrics {
  name: string
  ticker: string
  currentPrice: DataPoint<number>
  marketCap: DataPoint<number>
  fdv: DataPoint<number>
  fdvMcapRatio: DataPoint<number>
  circulatingSupply: DataPoint<number>
  totalSupply: DataPoint<number>
  athPrice: DataPoint<number>
  athDate: DataPoint<string>
  athMcap: DataPoint<number>
  inflationAdjustedAth: DataPoint<number>
  supplyExpansionFactor: DataPoint<number>
  discountToAthPrice: DataPoint<number>
  discountToAthMcap: DataPoint<number>
  annualInflationPct: DataPoint<number>
  cliffUnlock90d: DataPoint<string>
}

export interface CipherAnalysis {
  token: string
  ticker: string
  verdict: string
  confidenceTier: ConfidenceTier
  riskBannerText: string
  macroContext: MacroSnapshot
  metrics: TokenMetrics
  liquidity: LiquidityMetrics
  signalLayers: SignalLayer[]
  redFlags: RedFlags
  scenarios: PriceScenario[]
  kellyPositionPct: DataPoint<number>
  recommendedAllocationPct: DataPoint<number>
  dataGaps: string[]
  bottomLine: string
  exitTriggers: {
    fundamental: string[]
    onchain: string[]
    narrative: string[]
  }
  timestamp: number
}

export interface ScannerResult {
  macro: MacroSnapshot
  narratives: Narrative[]
  candidates: CandidateToken[]
  dataGaps: string[]
  timestamp: number
}

export interface CandidateToken {
  name: string
  ticker: string
  mcap: DataPoint<number>
  fdv: DataPoint<number>
  conviction: number         // 1–10
  evScore: number            // 1–10
  narrativeStatus: NarrativeStatus
  whyRetailDoesntKnow: string
  keyCatalyst: string
  redFlagSummary: string[]
  scenarios: PriceScenario[]
  confidenceTier: ConfidenceTier
}

export interface Holding {
  id: string
  token: string
  ticker: string
  amount: number
  entryPrice: number
  entryDate: string
  notes: string
}

export interface PortfolioAudit {
  holdings: AuditedHolding[]
  totalValueUsd: number
  totalPnlPct: number
  concentrationWarnings: string[]
  sectorExposure: { sector: string; pct: number }[]
  cycleAlignment: string
  rebalancingSuggestions: string[]
  dataGaps: string[]
  timestamp: number
}

export interface AuditedHolding extends Holding {
  currentPrice: DataPoint<number>
  currentValueUsd: number
  pnlPct: number
  verdict: PositionVerdict
  verdictRationale: string
  redFlagSummary: string[]
  upcomingUnlock: DataPoint<string>
  narrativeSector: string
}

export interface TPLayer {
  targetMultiple: number
  targetPrice: number
  sellPct: number
  rationale: string
}

export interface ExitIntelligence {
  token: string
  entryPrice: number
  currentPrice: number
  currentMultiple: number
  positionSizeUsd: number
  tpLayers: TPLayer[]
  stopLossPrice: number
  stopRationale: string
  narrativePhase: NarrativeStatus
  triggeredSignals: string[]
  moonbagPct: number
  timestamp: number
}

// Zustand store shape
export interface CipherStore {
  watchlist: CandidateToken[]
  holdings: Holding[]
  lastScan: ScannerResult | null
  lastAnalysis: Record<string, CipherAnalysis>
  addToWatchlist: (token: CandidateToken) => void
  removeFromWatchlist: (ticker: string) => void
  addHolding: (holding: Holding) => void
  removeHolding: (id: string) => void
  updateHolding: (id: string, updates: Partial<Holding>) => void
  setLastScan: (scan: ScannerResult) => void
  setAnalysis: (ticker: string, analysis: CipherAnalysis) => void
}
