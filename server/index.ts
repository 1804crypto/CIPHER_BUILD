import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cipherRouter from './routes/cipher'
import { getCipherSystemPrompt } from './prompts/system'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))
app.use('/api/cipher', cipherRouter)
app.get('/health', (_, res) => res.json({ status: 'ok' }))

getCipherSystemPrompt() // validate on startup — crash early if missing

app.listen(PORT, () => console.log(`[CIPHER Server] Running on port ${PORT}`))
