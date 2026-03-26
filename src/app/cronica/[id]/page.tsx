import { cronicaRepository } from '@execution/repositories/cronica_repository'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import CommentsSection from '../../../components/CommentsSection'

export default async function CronicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const cronica = await cronicaRepository.findById(id)
  
  if (!cronica) {
    notFound()
  }

  const comments = await cronicaRepository.findComments(id)

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '8rem', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Author Header */}
        <header style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--outline-variant)', paddingBottom: '2rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                <img src={cronica.author_profile?.avatar_url || ''} alt="Author" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
                <p style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em' }}>{cronica.author_profile?.full_name?.toUpperCase() || 'NAVEGADOR'}</p>
                <p className="caption" style={{ opacity: 0.5 }}>{new Date(cronica.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </header>

        {/* Content */}
        <article>
            <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, lineHeight: 1, marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>
                {cronica.title}
            </h1>
            
            <div style={{ fontSize: '1.25rem', lineHeight: 1.8, opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                {cronica.content}
            </div>
        </article>

        {/* Comments Section */}
        <CommentsSection 
            cronicaId={cronica.id} 
            currentUserId={user?.id} 
            initialComments={comments} 
        />

        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
            <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.1em' }}>← VOLTAR PARA TODAS AS CRÔNICAS</a>
        </div>
      </section>
    </main>
  )
}
