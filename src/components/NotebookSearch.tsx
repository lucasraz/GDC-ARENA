'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Sparkles, AlertCircle, TrendingUp } from 'lucide-react'

export default function NotebookSearch() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [result, setResult] = useState<null | { answer: string }>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setResult(null)

    // Simulating call to "Manuscript" (NotebookLM)
    // Normally we would hit /api/notebooklm/query
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock answer based on the real notebook content found earlier
    const mockAnswer = `Na Rodada 9 do Cartola FC 2026, você deve focar em confrontos como Botafogo x Mirassol e Internacional x São Paulo. A "Seleção FC Brasil #9" indica que o Internacional é um dos times com maior probabilidade de pontuação alta. Se você busca ganhar cartoletas, o time "Tio Patinhas" é a melhor estratégia no momento.`

    setResult({ answer: mockAnswer })
    setIsSearching(false)
  }

  return (
    <div className="notebook-search-container" style={{ margin: '2rem 0' }}>
      <div className="glass-card" style={{ border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sparkles size={20} style={{ color: 'var(--primary)' }} />
          <span className="label" style={{ letterSpacing: '0.1em', opacity: 0.8 }}>IA GDC - CONSULTA INTELIGENTE</span>
        </div>

        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Perguntar à IA da Arena..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ paddingLeft: '3rem' }}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '1.25rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                opacity: 0.5
              }} 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSearching}
            style={{ opacity: isSearching ? 0.7 : 1 }}
          >
            {isSearching ? 'Analisando...' : 'Consultar'}
          </button>
        </form>

        <AnimatePresence>
          {isSearching && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              <div className="loading-dots">
                <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Acessando base de dados da Arena...</span>
              </div>
            </motion.div>
          )}

          {result && !isSearching && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ 
                marginTop: '1.5rem', 
                background: 'var(--surface-container-highest)', 
                padding: '1.5rem',
                borderRadius: '4px',
                borderLeft: '4px solid var(--primary)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <TrendingUp size={16} style={{ color: 'var(--primary)' }} />
                <span className="label" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>RESPOSTA DA IA GDC</span>
              </div>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.5', opacity: 0.9 }}>
                {result.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
