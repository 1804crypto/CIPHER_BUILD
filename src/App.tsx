import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Shell } from './components/layout/Shell'
import { ScannerPage } from './pages/ScannerPage'
import { AnalystPage } from './pages/AnalystPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { ExitPage } from './pages/ExitPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<ScannerPage />} />
            <Route path="/analyst" element={<AnalystPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/exit" element={<ExitPage />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
