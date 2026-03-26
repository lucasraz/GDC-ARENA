'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }])

      if (error) throw error
      setStatus('success')
      setEmail('')
    } catch (err) {
      console.error('Newsletter error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div style={{ background: 'var(--primary)', color: 'black', padding: '1.5rem', borderRadius: '4px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 900 }}>RESPEITO É PRA QUEM TEM!</h3>
        <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Inscrição realizada. O Gigante te espera no e-mail.</p>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--primary)', color: 'black', padding: '1.5rem', borderRadius: '4px' }}>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 900 }}>GDC ARENA: A VOZ DO GIGANTE.</h3>
      <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>Conteúdo exclusivo e dicas do Cartola direto no seu e-mail.</p>
      
      <form onSubmit={handleSubscribe} style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input 
          type="email" 
          placeholder="seu@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            background: 'white', 
            border: 'none', 
            borderRadius: '2px',
            fontSize: '0.85rem'
          }}
        />
        <button 
          disabled={status === 'loading'}
          style={{ 
            width: '100%', 
            background: 'black', 
            color: 'white', 
            border: 'none', 
            padding: '0.75rem', 
            fontWeight: 900,
            cursor: 'pointer',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          {status === 'loading' ? 'ENVIANDO...' : 'ASSINAR AGORA'}
        </button>
        {status === 'error' && (
          <p style={{ fontSize: '0.7rem', color: 'red', fontWeight: 700, marginTop: '0.5rem' }}>E-mail já cadastrado ou erro na rede.</p>
        )}
      </form>
    </div>
  )
}
