'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, Clock } from 'lucide-react'
import { saveCronica, deleteCronica } from '@/app/actions/cronica_actions'
import { Cronica } from '@execution/repositories/cronica_repository'
import CronicaEditor from './CronicaEditor'
import { useRouter } from 'next/navigation'

interface MyCronicasClientProps {
  userId: string
  tenantId: string
  initialCronicas: Cronica[]
}

export default function MyCronicasClient({ userId, tenantId, initialCronicas }: MyCronicasClientProps) {
  const router = useRouter()
  const [cronicas, setCronicas] = useState<Cronica[]>(initialCronicas)
  const [editingCronica, setEditingCronica] = useState<Partial<Cronica> | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleSave = async (data: { id?: string, title: string, content: string }) => {
    const result = await saveCronica(userId, tenantId, data)
    if (result.success) {
      router.refresh()
      setIsAdding(false)
      setEditingCronica(null)
      return { success: true }
    }
    return result
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteCronica(id, userId)
    if (result.success) {
       router.refresh()
       setCronicas(cronicas.filter(c => c.id !== id))
    }
    setIsDeleting(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {!isAdding && !editingCronica && (
        <button 
            onClick={() => setIsAdding(true)}
            className="btn-primary" 
            style={{ width: '100%', maxWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.25rem' }}
        >
            <Plus size={20} /> ESCREVER NOVA CRÔNICA
        </button>
      )}

      <AnimatePresence mode="wait">
        {(isAdding || editingCronica) && (
            <motion.div
                key="editor"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ marginBottom: '4rem' }}
            >
                <CronicaEditor 
                    initialData={editingCronica as any}
                    onSubmit={handleSave}
                    onCancel={() => {
                        setIsAdding(false)
                        setEditingCronica(null)
                    }}
                />
            </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {cronicas.length === 0 ? (
            <div style={{ opacity: 0.5, textAlign: 'center', padding: '4rem', gridColumn: '1 / -1' }}>
                <Clock size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>Você ainda não publicou nenhuma crônica.</p>
            </div>
        ) : (
            cronicas.map((cronica: Cronica) => (
                <motion.div 
                    layout
                    key={cronica.id} 
                    className="card"
                    style={{ opacity: isDeleting === cronica.id ? 0.5 : 1 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                         <span className="label" style={{ opacity: 0.5, fontSize: '0.7rem' }}>
                             {new Date(cronica.created_at).toLocaleDateString('pt-BR')}
                         </span>
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                                onClick={() => setEditingCronica(cronica)}
                                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.6 }}
                            >
                                <Edit2 size={16} />
                            </button>
                            <button 
                                onClick={() => handleDelete(cronica.id)}
                                disabled={isDeleting === cronica.id}
                                style={{ background: 'transparent', border: 'none', color: '#E57373', cursor: 'pointer', opacity: 0.6 }}
                            >
                                <Trash2 size={16} />
                            </button>
                         </div>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{cronica.title}</h3>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', flex: 1 }}>
                        {cronica.content.substring(0, 100)}...
                    </p>
                </motion.div>
            ))
        )}
      </div>
    </div>
  )
}
