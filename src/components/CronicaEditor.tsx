'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface CronicaEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
  }
  onSubmit: (data: { id?: string, title: string, content: string }) => Promise<{ success: boolean, message?: string }>
  onCancel: () => void
}

export default function CronicaEditor({ initialData, onSubmit, onCancel }: CronicaEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = await onSubmit({ 
        id: initialData?.id,
        ...formData 
    })
    
    if (result.success) {
      onCancel() // Close/Reset
    } else {
      setError(result.message || 'Erro ao salvar crônica.')
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ width: '100%', maxWidth: '800px' }}
    >
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>
            {initialData?.id ? 'EDITAR CRÔNICA' : 'ESCREVER NOVA CRÔNICA'}
        </h2>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label className="input-label">TÍTULO DA CRÔNICA (MÁX. 100)</label>
          <input 
            type="text" 
            className="input-field"
            maxLength={100}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Dê um título marcante para sua história..."
            required
          />
        </div>

        <div>
          <label className="input-label">CONTEÚDO (MÁX. 5000 CARACTERES)</label>
          <div style={{ position: 'relative' }}>
            <textarea 
              className="input-field"
              rows={15}
              maxLength={5000}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Era uma vez em São Januário..."
              required
              style={{ 
                  resize: 'vertical', 
                  lineHeight: '1.6',
                  background: 'var(--surface-container-high)',
                  border: '1px solid var(--outline)',
                  padding: '1.5rem',
                  fontSize: '1.1rem'
              }}
            />
            <div style={{ 
                position: 'absolute', 
                bottom: '1rem', 
                right: '1rem', 
                fontSize: '0.75rem', 
                opacity: 0.5,
                pointerEvents: 'none'
            }}>
                {formData.content.length} / 5000
            </div>
          </div>
        </div>

        {error && (
            <div style={{ color: '#E57373', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
                type="button" 
                onClick={onCancel}
                className="btn-primary"
                style={{ background: 'transparent', border: '1px solid var(--outline-variant)', color: 'inherit', flex: 1 }}
            >
                CANCELAR
            </button>
            <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                style={{ flex: 2 }}
            >
                {isSubmitting ? 'SALVANDO...' : 'PUBLICAR CRÔNICA'}
            </button>
        </div>
      </form>
    </motion.div>
  )
}
