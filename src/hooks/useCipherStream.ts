import { useState, useCallback, useRef } from 'react'

interface StreamState {
  status: 'idle' | 'streaming' | 'done' | 'error'
  rawText: string
  searches: string[]
  parsedData: unknown
  error: string | null
}

export function useCipherStream() {
  const [state, setState] = useState<StreamState>({
    status: 'idle',
    rawText: '',
    searches: [],
    parsedData: null,
    error: null,
  })
  const abortRef = useRef<AbortController | null>(null)

  const stream = useCallback(async (module: string, userPrompt: string) => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setState({ status: 'streaming', rawText: '', searches: [], parsedData: null, error: null })

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/cipher/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module, userPrompt }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        if (res.status === 429) {
          try {
            const data = await res.json()
            throw new Error(data.error || 'Rate limit exceeded. Wait 60 seconds.')
          } catch {
            throw new Error('Rate limit exceeded. Wait 60 seconds.')
          }
        }
        throw new Error(`Server error: ${res.status}`)
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === 'text') {
              accumulated += event.text
              setState(s => ({ ...s, rawText: accumulated }))
            }
            if (event.type === 'search') {
              setState(s => ({ ...s, searches: [...s.searches, event.query] }))
            }
            if (event.type === 'done') {
              // Attempt JSON parse — strip any accidental markdown fences
              const clean = accumulated
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/```\s*$/i, '')
                .trim()
              try {
                const parsed = JSON.parse(clean)
                setState(s => ({ ...s, status: 'done', parsedData: parsed }))
              } catch {
                // JSON parse failed — retry after extracting first {...} block
                const match = clean.match(/\{[\s\S]*\}/)
                if (match) {
                  try {
                    const parsed = JSON.parse(match[0])
                    setState(s => ({ ...s, status: 'done', parsedData: parsed }))
                  } catch {
                    setState(s => ({ ...s, status: 'error', error: 'Response was not valid JSON. Raw output is available.' }))
                  }
                } else {
                  setState(s => ({ ...s, status: 'error', error: 'No JSON found in response.' }))
                }
              }
            }
            if (event.type === 'error') {
              setState(s => ({ ...s, status: 'error', error: event.message }))
            }
          } catch { /* malformed SSE line — skip */ }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return
      setState(s => ({ ...s, status: 'error', error: (err as Error).message }))
    }
  }, [])

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setState(s => ({ ...s, status: 'idle' }))
  }, [])

  return { ...state, stream, abort }
}
