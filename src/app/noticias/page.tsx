import NextImage from 'next/image'
import articles from '../../data/noticias.json'
import NewsletterForm from '../../components/NewsletterForm'
import NextGamesCard from '../../components/NextGamesCard'
import StandingsCard from '../../components/StandingsCard'
import VascoCompetitionsCard from '../../components/VascoCompetitionsCard'

export default function NoticiasPage() {
  return (
    <main className="min-h-screen">
      
      <section className="section-container" style={{ borderBottom: '4px double var(--outline-variant)', marginBottom: '2rem', paddingBottom: '1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(1rem, 4vw, 2.5rem)', marginBottom: '2rem', flexWrap: 'nowrap' }}>
            <h1 className="shimmer-text" style={{ fontSize: 'clamp(1.8rem, 8.5vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', whiteSpace: 'nowrap' }}>
              GDC ARENA
            </h1>
            <img 
              src="/vasco-logo.png" 
              alt="Vasco" 
              style={{ 
                height: 'clamp(40px, 12vw, 120px)', 
                flexShrink: 0,
                filter: 'drop-shadow(0px 0px 15px rgba(255,255,255,0.25)) drop-shadow(0px 10px 40px rgba(255,255,255,0.15))'
              }} 
            />
          </div>


          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--outline-variant)', borderBottom: '1px solid var(--outline-variant)', padding: '0.5rem 0', marginTop: '1rem' }}>
            <span className="label" style={{ fontSize: '0.75rem' }}>O PORTO SEGURO DO GIGANTE</span>
            <span className="label" style={{ fontSize: '0.75rem' }}>26 DE MARÇO DE 2026</span>
          </div>
        </div>
      </section>

      <section className="noticias-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* DESTAQUES (Primeiras 4 notícias) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {articles.slice(0, 4).map((article: any, index: number) => (
              <article key={article.id} style={{ borderBottom: index === 3 ? 'none' : '1px solid var(--outline-variant)', paddingBottom: '3rem' }}>
                <div className="article-container">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="label" style={{ background: 'var(--primary-container)', color: 'white', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}>{article.category}</span>
                      <span className="label" style={{ opacity: 0.5, fontSize: '0.75rem' }}>{article.date}</span>
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1.25rem', textTransform: 'none', lineHeight: '1.2' }}>{article.title}</h2>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.85, fontFamily: 'var(--font-newsreader)' }}>{article.excerpt}</p>
                  </div>

                  {(article.image_url || article.image) && (
                    <div className="article-image" style={{ width: '300px', height: '200px', position: 'relative', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
                      <NextImage src={article.image_url || article.image} alt={article.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label" style={{ opacity: 0.6, fontSize: '0.7rem' }}>FONTE: {article.source_name || article.source}</span>
                  <a href={`/noticia/${article.id}`} className="label" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 900 }}>LER MATÉRIA COMPLETA →</a>
                </div>
              </article>
            ))}
          </div>

          {/* NOTÍCIAS ANTERIORES (O restante) */}
          {articles.length > 4 && (
            <div style={{ marginTop: '3rem' }}>
              <div style={{ borderBottom: '2px solid var(--primary)', marginBottom: '2.5rem', display: 'inline-block' }}>
                <h3 className="label" style={{ fontSize: '1.2rem', paddingBottom: '0.5rem' }}>NOTÍCIAS ANTERIORES</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {articles.slice(4).map((article: any) => (
                  <article key={article.id} style={{ 
                    background: 'var(--surface-container-low)', 
                    padding: '1.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid var(--outline-variant)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                  }} className="card-hover">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <span className="label" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>{article.category}</span>
                      <span className="label" style={{ opacity: 0.4, fontSize: '0.65rem' }}>{article.date}</span>
                    </div>
                    
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, minHeight: '3.25rem' }}>{article.title}</h4>
                    
                    <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.excerpt}
                    </p>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="label" style={{ opacity: 0.5, fontSize: '0.6rem' }}>{article.source_name || article.source}</span>
                      <a href={`/noticia/${article.id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.7rem', fontWeight: 900 }}>LER →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <VascoCompetitionsCard />
          <NextGamesCard />
          <StandingsCard />
          <NewsletterForm />
        </aside>

      </section>

    </main>
  )
}
