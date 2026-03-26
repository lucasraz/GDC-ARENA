'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ProfileFormProps {
  initialData?: {
    full_name: string
    username: string
    nickname?: string
    display_name_preference?: 'full_name' | 'nickname'
    avatar_url?: string
    birth_date?: string
    whatsapp?: string
    membership_type?: string
  }
  onSubmit: (formData: FormData) => Promise<{ success: boolean, message?: string }>
}

export default function ProfileForm({ initialData, onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    username: initialData?.username || '',
    nickname: initialData?.nickname || '',
    display_name_preference: initialData?.display_name_preference || 'full_name',
    birth_date: initialData?.birth_date || '',
    whatsapp: initialData?.whatsapp || '',
    membership_type: initialData?.membership_type || 'nenhum',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar_url || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      const data = new FormData()
      data.append('full_name', formData.full_name)
      data.append('username', formData.username)
      data.append('nickname', formData.nickname)
      data.append('display_name_preference', formData.display_name_preference)
      data.append('birth_date', formData.birth_date)
      data.append('whatsapp', formData.whatsapp)
      data.append('membership_type', formData.membership_type)
      if (avatarFile) {
        data.append('avatar', avatarFile)
      }

      const result = await onSubmit(data)
      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      } else {
        setMessage({ type: 'error', text: result.message || 'Erro ao atualizar.' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Falha na comunicação com a Arena.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card"
      style={{ maxWidth: '600px', width: '100%', position: 'relative' }}
    >
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        {/* Avatar Section */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: '50%', 
            background: 'var(--surface-container-highest)',
            border: '4px solid var(--primary)',
            overflow: 'hidden',
            position: 'relative',
            marginBottom: '1rem'
          }}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', opacity: 0.3 }}>+</div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
            />
          </div>
          <span className="label" style={{ fontSize: '0.75rem', opacity: 0.6 }}>TOQUE PARA MUDAR A FOTO</span>
        </div>

        <h2 style={{ fontSize: '1.75rem', color: 'var(--primary)' }}>PERFIL DO NAVEGADOR</h2>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="input-label">NOME COMPLETO</label>
            <input 
              type="text" 
              className="input-field"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Vasco da Gama"
              required
            />
          </div>
          <div>
            <label className="input-label">DATA DE NASCIMENTO</label>
            <input 
              type="date" 
              className="input-field"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="input-label">COMO QUER SER CHAMADO? (APELIDO)</label>
            <input 
              type="text" 
              className="input-field"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="Ex: O Brabo"
            />
          </div>
          <div>
            <label className="input-label">PREFERÊNCIA DE EXIBIÇÃO</label>
            <select 
              className="input-field"
              value={formData.display_name_preference}
              onChange={(e) => setFormData({ ...formData, display_name_preference: e.target.value as any })}
              style={{ width: '100%', appearance: 'none' }}
            >
              <option value="full_name">NOME REAL</option>
              <option value="nickname">APELIDO GDC</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label className="input-label">TELEFONE / WHATSAPP</label>
            <input 
              type="text" 
              className="input-field"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(21) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="input-label">GDC-ID (USERNAME)</label>
            <input 
              type="text" 
              className="input-field"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="ex-vasco-1898"
              required
            />
          </div>
        </div>

        <div>
           <label className="input-label">MODALIDADE DE AFILIAÇÃO</label>
           <select 
             className="input-field"
             value={formData.membership_type}
             onChange={(e) => setFormData({ ...formData, membership_type: e.target.value as any })}
             style={{ width: '100%', appearance: 'none' }}
           >
             <option value="nenhum">NÃO SOU SÓCIO</option>
             <option value="socio_torcedor">SÓCIO TORCEDOR</option>
             <option value="estatutario">SÓCIO ESTATUTÁRIO</option>
           </select>
        </div>

        {message && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              padding: '1rem', 
              borderRadius: '4px', 
              fontSize: '0.875rem',
              textAlign: 'center',
              background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              color: message.type === 'success' ? '#81C784' : '#E57373',
              border: `1px solid ${message.type === 'success' ? '#4CAF50' : '#F44336'}`
            }}
          >
            {message.text}
          </motion.div>
        )}

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isSubmitting}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {isSubmitting ? 'SALVANDO...' : 'SALVAR PERFIL'}
        </button>
      </form>

      {/* Watermark Maltese Cross (Symbolic for Vasco) */}
      <div style={{ 
        position: 'absolute', 
        bottom: '1rem', 
        right: '1rem', 
        opacity: 0.03, 
        pointerEvents: 'none',
        fontSize: '8rem',
        fontWeight: 900
      }}>
        +
      </div>
    </motion.div>
  )
}

