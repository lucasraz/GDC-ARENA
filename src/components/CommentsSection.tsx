'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, MessageCircle } from 'lucide-react'
import { addComment, deleteComment } from '@/app/actions/cronica_actions'
import { Comment } from '@execution/repositories/cronica_repository'
import { useRouter } from 'next/navigation'

interface CommentsSectionProps {
  cronicaId: string
  currentUserId?: string
  initialComments: Comment[]
}

export default function CommentsSection({ cronicaId, currentUserId, initialComments }: CommentsSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Sync state if initialComments change (prop sync)
  if (initialComments.length !== comments.length && !isSubmitting) {
      setComments(initialComments)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUserId) return
    setIsSubmitting(true)

    const result = await addComment(currentUserId, cronicaId, newComment)
    if (result.success) {
      setNewComment('')
      router.refresh() 
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!currentUserId) return
    setIsDeleting(id)
    const result = await deleteComment(id, currentUserId)
    if (result.success) {
      router.refresh()
      setComments(comments.filter(c => c.id !== id))
    }
    setIsDeleting(null)
  }

  return (
    <div style={{ marginTop: '4rem', padding: '2rem', borderTop: '2px solid var(--outline-variant)' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <MessageCircle size={24} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '1.25rem' }}>COMENTÁRIOS DA TORCIDA ({comments.length})</h3>
      </header>

      {/* COMMENT FORM */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="O que você achou dessa história?" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{ marginBottom: 0, flex: 1 }}
            required
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ 
                width: 'auto', 
                padding: '0.8rem 2rem', 
                background: 'var(--primary)', 
                color: 'black',
                fontWeight: 900,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
          >
            {isSubmitting ? '...' : 'COMENTAR'}
          </button>
        </form>
      ) : (
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
             <p style={{ opacity: 0.5 }}>Faça login para participar da conversa e deixar sua marca no GDC.</p>
        </div>
      )}

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <AnimatePresence>
          {comments.map((comment: Comment) => (
            <motion.div 
              key={comment.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              style={{ 
                  background: 'var(--surface-container-low)', 
                  padding: '1.25rem', 
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  opacity: isDeleting === comment.id ? 0.5 : 1
              }}
            >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: 'var(--surface-container-high)' }}>
                        {comment.author_profile?.avatar_url ? (
                             <img src={comment.author_profile.avatar_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.6rem', fontWeight: 900 }}>
                                {comment.author_profile?.full_name?.[0] || 'N'}
                            </div>
                        )}
                    </div>
                    <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.6, marginBottom: '0.25rem' }}>
                            {comment.author_profile?.full_name || 'Navegador'} • <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>{new Date(comment.created_at).toLocaleDateString('pt-BR')}</span>
                        </p>
                        <p style={{ fontSize: '1rem', lineHeight: '1.5' }}>{comment.text}</p>
                    </div>
                </div>

                {currentUserId === comment.author_id && (
                    <button 
                        onClick={() => handleDelete(comment.id)}
                        disabled={isDeleting === comment.id}
                        style={{ background: 'transparent', border: 'none', color: '#E57373', cursor: 'pointer', padding: '0.5rem' }}
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
