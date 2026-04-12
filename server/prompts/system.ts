import { readFileSync } from 'fs'
import { join } from 'path'

let cached: string | null = null

export function getCipherSystemPrompt(): string {
  if (cached) return cached
  try {
    cached = readFileSync(join(process.cwd(), 'public', 'cipher_v3.md'), 'utf-8')
    console.log('[CIPHER] System prompt loaded:', cached.length, 'chars')
    return cached
  } catch (e) {
    console.error('[CIPHER] Failed to load cipher_v3.md — check public/ directory')
    throw new Error('CIPHER system prompt not found. Place cipher_v3.md in /public/')
  }
}
