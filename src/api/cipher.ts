export async function fetchCipherOnce(module: string, userPrompt: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/cipher/once`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ module, userPrompt }),
  })
  if (!res.ok) throw new Error(`Server error: ${res.status}`)
  return res.json()
}
