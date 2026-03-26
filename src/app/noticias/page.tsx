import NextImage from 'next/image'
import articles from '../../data/noticias.json'
import NewsletterForm from '../../components/NewsletterForm'

export default function NoticiasPage() {
  return (
    <main className="min-h-screen">
      
      {/* Newspaper Header */}
      <section className="section-container" style={{ borderBottom: '4px double var(--outline-variant)', marginBottom: '2rem', paddingBottom: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '2rem' }}>
            GDC ARENA
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--outline-variant)', borderBottom: '1px solid var(--outline-variant)', padding: '0.5rem 0', marginTop: '1rem' }}>
            <span className="label" style={{ fontSize: '0.75rem' }}>EDICÃO Nº 001</span>
            <span className="label" style={{ fontSize: '0.75rem' }}>26 DE MARÇO DE 2026</span>
          </div>
        </div>
      </section>

      {/* Main News Layout - Editorial Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem 4rem', display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '3rem' }}>
        
        {/* Main Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {articles.map((article: any, index: number) => (
            <article key={article.id} style={{ background: index % 2 === 0 ? 'transparent' : 'var(--surface-container-low)', padding: index % 2 === 0 ? '0' : '2rem', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '2rem', flexDirection: index % 2 === 0 ? 'row' : 'row-reverse' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="label" style={{ background: 'var(--primary-container)', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}>{article.category}</span>
                    <span className="label" style={{ opacity: 0.5, fontSize: '0.75rem' }}>{article.date}</span>
                  </div>
                  <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem', textTransform: 'none' }}>{article.title}</h2>
                  <p style={{ fontSize: '1.15rem', lineHeight: '1.6', opacity: 0.9, fontFamily: 'var(--font-newsreader)' }}>{article.excerpt}</p>
                  
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="label" style={{ fontSize: '0.65rem', opacity: 0.5 }}>FONTE VERIFICADA:</span>
                    <span className="label" style={{ fontSize: '0.65rem', border: '1px solid var(--outline-variant)', padding: '0.1rem 0.4rem', borderRadius: '2px' }}>
                      {article.source_name}
                    </span>
                  </div>
                </div>

                {article.image_url && (
                  <div style={{ width: '350px', height: '240px', position: 'relative', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
                    <NextImage src={article.image_url} alt={article.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="label" style={{ opacity: 0.6, fontSize: '0.75rem' }}>FONTE: {article.source_name}</span>
                <a href={`/noticia/${article.id}`} className="label" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 900 }}>LER MATÉRIA COMPLETA →</a>
              </div>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: 900 }}>NOTÍCIAS DO GIGANTE</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>Novo reforço de peso na SAF deve ser anunciado em breve.</p>
                <span className="caption" style={{ fontSize: '0.7rem', opacity: 0.5 }}>HÁ 10 MINUTOS</span>
              </li>
              <li style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>Camisas retrô do Vasco batem recorde de vendas no GDC.</p>
                <span className="caption" style={{ fontSize: '0.7rem', opacity: 0.5 }}>HÁ 2 HORAS</span>
              </li>
            </ul>
          </div>

          <NewsletterForm />
        </aside>

      </section>
    </main>
  )
}
