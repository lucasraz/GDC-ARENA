'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, MessageCircle, Send } from 'lucide-react'
import { addEventComment, deleteEventComment } from '@/app/actions/event_actions'
import { useRouter } from 'next/navigation'

interface EventComment {
  id: string
  event_id: string
  author_id: string
  text: string
  created_at: string
  author_profile?: {
    full_name: string
    avatar_url: string
  }
}

interface EventCommentsSectionProps {
  eventId: string
  currentUserId?: string
  initialComments: EventComment[]
}

export default function EventCommentsSection({ eventId, currentUserId, initialComments }: EventCommentsSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<EventComment[]>(initialComments || [])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  // Sync state with props when initialComments changes (RSC refresh)
  useEffect(() => {
    setComments(initialComments || [])
  }, [initialComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return
    setIsSubmitting(true)

    const result = await addEventComment(currentUserId, eventId, newComment)
    if (result.success) {
      setNewComment('')
      // Update local state immediately if we have the data
      if (result.data) {
        setComments(prev => [result.data as EventComment, ...prev])
      }
      router.refresh()
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!currentUserId) return
    setIsDeleting(id)
    const result = await deleteEventComment(id, currentUserId)
    if (result.success) {
      router.refresh()
      setComments(comments.filter(c => c.id !== id))
    }
    setIsDeleting(null)
  }

  return (
    <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MessageCircle size={18} style={{ color: 'var(--primary)' }} />
        <h4 style={{ fontSize: '0.9rem', fontWeight: 900 }}>DISCUSSÃO TÁTICA ({comments.length})</h4>
      </header>

      {/* COMMENT FORM */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Diga algo sobre este evento..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ 
                marginBottom: 0, 
                flex: 1, 
                fontSize: '0.85rem', 
                background: 'rgba(255,255,255,0.03)',
                padding: '0.6rem 1rem'
            }}
            required
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            style={{ 
                background: 'var(--primary)', 
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                padding: '0 1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (isSubmitting || !newComment.trim()) ? 0.5 : 1
            }}
          >
            {isSubmitting ? <span className="loader-small"></span> : <Send size={16} />}
          </button>
        </form>
      ) : (
        <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '4px', marginBottom: '2rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
             <p style={{ opacity: 0.5, fontSize: '0.8rem', marginBottom: '1rem' }}>Identifique-se para participar da discussão.</p>
             <button onClick={() => router.push('/login')} className="btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.75rem' }}>ENTRAR</button>
        </div>
      )}

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ 
                  background: 'rgba(255,255,255,0.02)', 
                  padding: '1rem', 
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(255,255,255,0.03)',
                  opacity: isDeleting === comment.id ? 0.5 : 1
              }}
            >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0 }}>
                        {comment.author_profile?.avatar_url ? (
                             <img src={comment.author_profile.avatar_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', fontWeight: 900 }}>
                                {comment.author_profile?.full_name?.[0] || '?'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.15rem' }}>
                            {comment.author_profile?.full_name || 'Navegador'} • <span style={{ fontSize: '0.65rem', fontWeight: 400 }}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                        </p>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'rgba(255,255,255,0.9)' }}>{comment.text}</p>
                    </div>
                </div>

                {currentUserId === comment.author_id && (
                    <button 
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting === comment.id}
                        style={{ background: 'transparent', border: 'none', color: '#E57373', cursor: 'pointer', padding: '0.25rem', opacity: 0.6 }}
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {comments.length === 0 && (
            <p style={{ textAlign: 'center', opacity: 0.3, fontSize: '0.8rem', fontStyle: 'italic', padding: '1rem' }}>Sem discussões ainda. Seja o primeiro a falar!</p>
        )}
      </div>
    </div>
  )
}
