import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getCipherSystemPrompt } from '../prompts/system'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'no-key-provided' })
const ZAI_API_KEY = '539c00bb5c5146579abdf08905d7b18d.r6CzlXeHWATy0flh'

async function callZaiStreamFallback(systemPrompt: string, conversationHistory: any[], fullUserPrompt: string, send: (data: object) => void) {
  const zaiMessages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: fullUserPrompt }
  ]

  const zaiRes = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'glm-4-plus',
      max_tokens: 8192,
      messages: zaiMessages,
      stream: true,
      tools: [{ type: 'web_search', web_search: { enable: true } }]
    })
  })

  if (!zaiRes.ok) throw new Error(`Z.ai fallback failed: ${zaiRes.statusText}`)

  const reader = zaiRes.body?.getReader()
  if (!reader) throw new Error('No body in Z.ai response')
  
  const decoder = new TextDecoder()
  let accumulated = ''
  send({ type: 'search', query: 'Routing request to Z.ai primary node...' })
  send({ type: 'search', query: 'Web search protocol executing natively inside Zhipu cluster...' })

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    accumulated += decoder.decode(value, { stream: true })
    
    const lines = accumulated.split('\n')
    accumulated = lines.pop() || ''
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') continue
        try {
          const parsed = JSON.parse(payload)
          const content = parsed.choices?.[0]?.delta?.content
          if (content) send({ type: 'text', text: content })
        } catch { /* ignore JSON chunk parse skips */ }
      }
    }
  }
}

async function callZaiOnceFallback(systemPrompt: string, fullUserPrompt: string) {
  const zaiRes = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'glm-4-plus',
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullUserPrompt }
      ],
      tools: [{ type: 'web_search', web_search: { enable: true } }]
    })
  })
  if (!zaiRes.ok) throw new Error(`Z.ai fallback failed: ${zaiRes.statusText}`)
  const data = await zaiRes.json()
  return data.choices?.[0]?.message?.content || ''
}


// Simple rate limiter
const requestCounts = new Map<string, { count: number; resetAt: number }>()
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (entry.count >= 10) return false
  entry.count++
  return true
}

// Module-specific JSON output instructions
function getModuleOutputSpec(module: string): string {
  const specs: Record<string, string> = {
    scanner: `
Return your complete analysis as a single valid JSON object matching this structure exactly.
Do not include any text before or after the JSON. Do not use markdown code fences.
The JSON must have these top-level keys: macro, narratives, candidates, dataGaps, timestamp.
- macro: MacroSnapshot object
- narratives: array of up to 5 Narrative objects, each with: name, status, saturationPct (0-100), vcBacked (boolean), description
- candidates: array of up to 3 CandidateToken objects ranked by evScore descending
- dataGaps: string array of what could not be verified
- timestamp: Unix timestamp in milliseconds

Every numeric DataPoint must follow this shape: { "value": number, "tier": "VERIFIED"|"ESTIMATED"|"UNVERIFIED"|"UNAVAILABLE", "source": "optional url or source name" }
Every candidate must include a full redFlagSummary array and all four price scenarios.
`,
    analyst: `
Return your complete analysis as a single valid JSON object.
Do not include any text before or after the JSON. Do not use markdown code fences.
The JSON must exactly match the CipherAnalysis interface.
Every DataPoint must include tier and optionally source.
All four price scenarios are required including the bear/zero case.
All five signal layers are required even if findings are empty.
dataGaps must list every metric that could not be verified.
`,
    portfolio: `
Return your complete portfolio audit as a single valid JSON object matching the PortfolioAudit interface.
Do not include any text before or after the JSON. Do not use markdown code fences.
Every holding must have a verdict (HOLD|SCALE|REDUCE|EXIT) and verdictRationale.
Include sectorExposure as an array of {sector, pct} objects that sum to 100.
`,
    exit: `
Return your exit intelligence as a single valid JSON object matching the ExitIntelligence interface.
Do not include any text before or after the JSON. Do not use markdown code fences.
Include exactly 4 tpLayers using the conservative stagger framework.
triggeredSignals must list any exit signals that appear to be currently active based on your research.
`
  }
  return specs[module] || ''
}

router.post('/stream', async (req, res) => {
  const ip = req.ip || 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Wait 60 seconds.' })
  }

  const { module, userPrompt, conversationHistory = [] } = req.body
  if (!module || !userPrompt) {
    return res.status(400).json({ error: 'module and userPrompt are required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`)

  try {
    const systemPrompt = getCipherSystemPrompt()
    const outputSpec = getModuleOutputSpec(module)
    const fullUserPrompt = `${userPrompt}\n\n---\nOUTPUT FORMAT REQUIREMENT:\n${outputSpec}`

    const messages = [
      ...conversationHistory,
      { role: 'user' as const, content: fullUserPrompt }
    ]

    try {
      const stream = client.messages.stream({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
        messages,
      })

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          send({ type: 'text', text: event.delta.text })
        }
        if (event.type === 'content_block_start' && event.content_block.type === 'tool_use' && event.content_block.name === 'web_search') {
          const input = event.content_block.input as { query?: string }
          if (input?.query) send({ type: 'search', query: input.query })
        }
      }
    } catch (anthropicErr) {
      console.warn('Anthropic API failed or key missing, falling back to Z.ai natively', anthropicErr)
      await callZaiStreamFallback(systemPrompt, conversationHistory, fullUserPrompt, send)
    }

    send({ type: 'done' })
    res.end()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    send({ type: 'error', message })
    res.end()
  }
})

router.post('/once', async (req, res) => {
  const ip = req.ip || 'unknown'
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded.' })
  }

  const { module, userPrompt } = req.body
  try {
    const systemPrompt = getCipherSystemPrompt()
    const outputSpec = getModuleOutputSpec(module)
    let text = ''
    try {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
        messages: [{ role: 'user', content: `${userPrompt}\n\n${outputSpec}` }],
      })
      text = response.content
        .filter(b => b.type === 'text')
        .map(b => (b as Anthropic.TextBlock).text)
        .join('')
    } catch (anthropicErr) {
      console.warn('Anthropic API failed or key missing, falling back to Z.ai natively', anthropicErr)
      text = await callZaiOnceFallback(systemPrompt, `${userPrompt}\n\n${outputSpec}`)
    }
    res.json({ text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

export default router
