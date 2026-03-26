import { notFound } from 'next/navigation'
import Image from 'next/image'
import noticiasData from '@/data/noticias.json'

export default async function NoticiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const noticia = noticiasData.find(n => n.id === id)

  if (!noticia) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem' }}>
            <span className="label" style={{ color: 'var(--primary)', opacity: 0.8, display: 'block', marginBottom: '1rem' }}>
                {noticia.category} • {noticia.date}
            </span>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>{noticia.title}</h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.7, fontStyle: 'italic', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem', marginBottom: '2rem' }}>
                {noticia.excerpt}
            </p>
          </header>

          <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '3rem', borderRadius: '4px', overflow: 'hidden' }}>
            <Image 
              src={noticia.image_url} 
              alt={noticia.title} 
              fill 
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ color: 'var(--on-surface)', whiteSpace: 'pre-wrap' }}>
            {noticia.full_content.split('\n\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '1.5rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--outline-variant)', opacity: 0.6 }}>
            <p className="label" style={{ fontSize: '0.8rem' }}>
                FONTE ORIGINAL: <a href={noticia.source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{noticia.source_name}</a>
            </p>
          </footer>
          
          <div style={{ marginTop: '3rem' }}>
            <a href="/noticias" style={{ color: 'var(--on-surface)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700 }}>
                ← VOLTAR PARA NOTÍCIAS
            </a>
          </div>
        </article>
      </section>
    </main>
  )
}
