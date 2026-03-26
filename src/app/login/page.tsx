'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { login, signup } from '@/app/actions/auth_actions'
export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    const result = isLogin ? await login(formData) : await signup(formData)

    if (result && !result.success) {
      setMessage({ type: 'error', text: result.message })
    } else if (result && result.success) {
      setMessage({ type: 'success', text: result.message })
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '8rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
            {isLogin ? 'ENTRAR NA ARENA' : 'ALISTAMENTO GDC'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="input-label">E-MAIL</label>
              <input name="email" type="email" className="input-field" placeholder="exemplo@vail.com" required />
            </div>
            <div>
              <label className="input-label">SENHA</label>
              <input name="password" type="password" className="input-field" placeholder="••••••••" required />
            </div>

            {message && (
              <div style={{ 
                padding: '0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.8rem',
                background: message.type === 'success' ? '#1B5E20' : '#B71C1C',
                color: 'white'
              }}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'PROCESSANDO...' : (isLogin ? 'ENTRAR' : 'CADASTRAR')}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', opacity: 0.7 }}>
            {isLogin ? 'Ainda não é um Navegador?' : 'Já possui autorização?'}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 700 }}
            >
              {isLogin ? 'Aliste-se aqui' : 'Entre agora'}
            </button>
          </p>
        </motion.div>
      </section>
    </main>
  )
}
