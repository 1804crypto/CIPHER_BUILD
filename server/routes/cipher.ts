import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getCipherSystemPrompt } from '../prompts/system'

const router = Router()
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
      messages,
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          send({ type: 'text', text: event.delta.text })
        }
      }
      if (event.type === 'content_block_start') {
        if (event.content_block.type === 'tool_use' && event.content_block.name === 'web_search') {
          const input = event.content_block.input as { query?: string }
          if (input?.query) send({ type: 'search', query: input.query })
        }
      }
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
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: systemPrompt,
      tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
      messages: [{ role: 'user', content: `${userPrompt}\n\n${outputSpec}` }],
    })
    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => (b as Anthropic.TextBlock).text)
      .join('')
    res.json({ text })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

export default router
