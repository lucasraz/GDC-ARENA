'use client'

import { useState } from 'react'
import { Calendar, MapPin, DollarSign, Type, AlignLeft, Beer, Home, AlertCircle } from 'lucide-react'

interface EventEditorProps {
  onSubmit: (data: any) => Promise<{ success: boolean, error?: string }>
  onCancel: () => void
}

export default function EventEditor({ onSubmit, onCancel }: EventEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_time: '',
    price: '0',
    beer_price_heineken: '0',
    beer_price_brahma: '0',
    beer_price_antarctica: '0',
    beer_price_stella: '0',
    consume_on_site: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!formData.title || !formData.location || !formData.event_time) {
        setError('Preencha os campos obrigatórios (Título, Local e Hora).')
        setIsSubmitting(false)
        return
    }

    const result = await onSubmit({
        ...formData,
        price: parseFloat(formData.price) || 0,
        beer_price_heineken: parseFloat(formData.beer_price_heineken) || 0,
        beer_price_brahma: parseFloat(formData.beer_price_brahma) || 0,
        beer_price_antarctica: parseFloat(formData.beer_price_antarctica) || 0,
        beer_price_stella: parseFloat(formData.beer_price_stella) || 0,
        event_time: new Date(formData.event_time).toISOString()
    })

    if (!result.success) {
      setError(result.error || 'Erro ao salvar evento.')
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
      
      {/* LEFT COLUMN: BASIC INFO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>DADOS BÁSICOS</h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={14} /> TÍTULO *
          </label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ex: Resenha pós-jogo" 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={14} /> LOCAL *
          </label>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Ex: Bar do Vasco / São Januário" 
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={14} /> DATA E HORA *
                </label>
                <input 
                    type="datetime-local" 
                    className="input-field" 
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                    required
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={14} /> TICKET (BASE)
                </label>
                <input 
                    type="number" 
                    className="input-field" 
                    placeholder="0.00" 
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
            </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlignLeft size={14} /> ESCOPO DO EVENTO
          </label>
          <textarea 
            className="input-field" 
            placeholder="Explique o que vai rolar..." 
            style={{ minHeight: '120px', resize: 'none' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      {/* RIGHT COLUMN: BEVERAGES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--surface-container-low)', padding: '2rem', borderRadius: '4px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>SISTEMA DE CONSUMO</h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', padding: '1rem', border: '1px solid var(--outline-variant)', borderRadius: '4px' }}>
            <input 
                type="checkbox" 
                id="consume_on_site"
                checked={formData.consume_on_site}
                onChange={(e) => setFormData({ ...formData, consume_on_site: e.target.checked })}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="consume_on_site" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Home size={16} /> CONSUMIR NO LOCAL (OPÇÕES ABAIXO SOMEM)
            </label>
        </div>

        {!formData.consume_on_site ? (
            <>
                <p style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.5rem' }}>
                    Defina o valor de cada marca. Se o valor for 0, a marca não aparecerá para os convidados.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="label">HEINEKEN (R$)</label>
                        <input type="number" step="0.01" className="input-field" value={formData.beer_price_heineken} onChange={(e) => setFormData({ ...formData, beer_price_heineken: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="label">STELLA (R$)</label>
                        <input type="number" step="0.01" className="input-field" value={formData.beer_price_stella} onChange={(e) => setFormData({ ...formData, beer_price_stella: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="label">BRAHMA (R$)</label>
                        <input type="number" step="0.01" className="input-field" value={formData.beer_price_brahma} onChange={(e) => setFormData({ ...formData, beer_price_brahma: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="label">ANTARCTICA (R$)</label>
                        <input type="number" step="0.01" className="input-field" value={formData.beer_price_antarctica} onChange={(e) => setFormData({ ...formData, beer_price_antarctica: e.target.value })} />
                    </div>
                </div>
            </>
        ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5, padding: '2rem', textAlign: 'center', border: '2px dashed var(--outline-variant)' }}>
                <AlertCircle size={20} />
                <p style={{ fontSize: '0.8rem' }}>As opções de marca foram desativadas pois o consumo será realizado diretamente no local do evento.</p>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--outline-variant)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
        {error && <span style={{ color: '#E57373', fontSize: '0.8rem' }}>{error}</span>}
        <button type="button" onClick={onCancel} style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 700, cursor: 'pointer', padding: '0 1rem' }}>CANCELAR</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ padding: '1rem 3rem' }}>
            {isSubmitting ? 'SALVANDO...' : 'PUBLICAR EVENTO'}
        </button>
      </div>

    </form>
  )
}
