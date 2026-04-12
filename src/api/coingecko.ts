const BASE = 'https://api.coingecko.com/api/v3'

// Simple in-memory cache — 60s TTL
const cache = new Map<string, { data: unknown; expiresAt: number }>()

async function cachedFetch<T>(url: string): Promise<T> {
  const hit = cache.get(url)
  if (hit && Date.now() < hit.expiresAt) return hit.data as T
  const res = await fetch(url)
  if (res.status === 429) throw new Error('CoinGecko rate limit — wait 60s')
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  const data = await res.json()
  cache.set(url, { data, expiresAt: Date.now() + 60_000 })
  return data as T
}

export async function getPrices(ids: string[]): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  if (ids.length === 0) return {}
  const url = `${BASE}/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`
  return cachedFetch(url)
}

export async function getGlobalData(): Promise<{
  data: {
    total_market_cap: { usd: number }
    market_cap_percentage: { btc: number }
    market_cap_change_percentage_24h_usd: number
  }
}> {
  return cachedFetch(`${BASE}/global`)
}
