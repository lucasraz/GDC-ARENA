import { cronicaRepository } from '@execution/repositories/cronica_repository'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'
  
  const cronicas = await cronicaRepository.findAll(TENANT_ID)

  return (
    <main className="min-h-screen">
      
      {/* Hero Section */}
      <section className="section-container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="label" style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>
            CRÔNICAS DO GIGANTE
          </span>
          <h1 style={{ fontSize: 'clamp(3rem, 10vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '2rem' }}>
            GDC ARENA
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '3rem' }}>
            Uma jornada editorial pela história, glória e o futuro do Gigante da Colina. 
            Sem bordas, apenas paixão e tipografia.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/cartola-dicas" className="btn-primary">Domine o Cartola</a>
            <a href="/my-cronicas" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Escrever Crônica</a>
          </div>
        </div>
      </section>

      {/* Crônicas Feed */}
      <section style={{ background: 'var(--surface-container-low)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <span className="label" style={{ color: 'var(--primary)', opacity: 0.7, letterSpacing: '0.15em' }}>MURAL DO NAVEGADOR</span>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>ÚLTIMAS CRÔNICAS</h2>
            </div>

            {cronicas.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <p style={{ opacity: 0.5 }}>Ainda não há crônicas publicadas. Seja o primeiro!</p>
                </div>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {cronicas.map((cronica) => (
                        <div key={cronica.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--outline-variant)' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--primary)', background: 'var(--surface-container-high)' }}>
                                    {cronica.author_profile?.avatar_url ? (
                                        <img src={cronica.author_profile.avatar_url} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.75rem', fontWeight: 900 }}>
                                            {cronica.author_profile?.full_name?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {cronica.author_profile?.full_name || 'NAVEGADOR'}
                                    </p>
                                    <p className="caption" style={{ fontSize: '0.7rem', opacity: 0.5 }}>{new Date(cronica.created_at).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'none' }}>{cronica.title}</h3>
                            <p style={{ fontSize: '1rem', opacity: 0.8, lineHeight: '1.6', flex: 1, fontFamily: 'var(--font-newsreader)' }}>
                                {cronica.content.length > 200 ? `${cronica.content.substring(0, 200)}...` : cronica.content}
                            </p>
                            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <a href={`/cronica/${cronica.id}`} className="label" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 700 }}>LER CRÔNICA COMPLETA →</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </section>
    </main>
  )
}
