import { notFound } from 'next/navigation'
import Image from 'next/image'
import noticiasData from '@/data/noticias.json'
import ShareButtons from '@/components/ShareButtons'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const noticia = (noticiasData as any[]).find(n => n.id === id)

  if (!noticia) return {}

  const imageUrl = noticia.image_url || noticia.image || '/noticias/default.jpg'

  return {
    title: `${noticia.title} | GDC ARENA`,
    description: noticia.excerpt,
    openGraph: {
      title: noticia.title,
      description: noticia.excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: noticia.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: noticia.title,
      description: noticia.excerpt,
      images: [imageUrl],
    },
  }
}

export default async function NoticiaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const noticia = (noticiasData as any[]).find(n => n.id === id)

  if (!noticia) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
        <article style={{ maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <span className="label" style={{ color: 'var(--primary)', opacity: 0.8, display: 'block', marginBottom: '1rem' }}>
                    {noticia.category} • {noticia.date}
                </span>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '1.5rem', fontWeight: 900, lineHeight: 1.1 }}>{noticia.title}</h1>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <ShareButtons title={noticia.title} text={noticia.excerpt} />
            </div>

            <p style={{ fontSize: '1.25rem', opacity: 0.7, fontStyle: 'italic', borderLeft: '4px solid var(--primary)', paddingLeft: '1.5rem' }}>
                {noticia.excerpt}
            </p>
          </header>

          <div style={{ position: 'relative', width: '100%', height: 'clamp(300px, 50vw, 500px)', marginBottom: '3rem', borderRadius: '4px', overflow: 'hidden' }}>
            <Image 
              src={noticia.image_url || noticia.image || '/noticias/default.jpg'} 
              alt={noticia.title} 
              fill 
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div style={{ color: 'var(--on-surface)', whiteSpace: 'pre-wrap' }}>
            {(noticia.full_content || noticia.excerpt || "").split('\n\n').map((paragraph: string, index: number) => (
              <p key={index} style={{ marginBottom: '1.5rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
                {paragraph}
              </p>
            ))}
          </div>

          <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--outline-variant)', opacity: 0.6 }}>
            <p className="label" style={{ fontSize: '0.8rem' }}>
                FONTE ORIGINAL: <a href={noticia.source_url || noticia.url || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{noticia.source_name || noticia.source || 'GDC Arena'}</a>
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
