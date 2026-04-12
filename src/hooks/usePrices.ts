import { useQuery } from '@tanstack/react-query'
import { getPrices, getGlobalData } from '../api/coingecko'

export function usePrices(ids: string[]) {
  return useQuery({
    queryKey: ['prices', ids],
    queryFn: () => getPrices(ids),
    enabled: ids.length > 0,
    refetchInterval: 60000, // Refresh every 60s
  })
}

export function useGlobalData() {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: getGlobalData,
    refetchInterval: 60000,
  })
}
