
import CartolaSquad from '@/components/CartolaSquad'
import EliteCommand from '@/components/EliteCommand'
import tipsData from '@/data/cartola_tips.json'

export default function CartolaTipsPage() {
  const { sources, consolidated, rodada } = tipsData

  return (
    <main className="min-h-screen">
      
      {/* Hero Section */}
      <section className="section-container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="label" style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'block' }}>
            RODADA {rodada} - SCOUT E ESTRATÉGIA
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4xl)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            COMANDO DE ELITE
          </h1>
          <p style={{ maxWidth: '600px', fontSize: '1.25rem', marginBottom: '3rem', opacity: 0.8 }}>
            Análises profundas de estatísticas para o Cartola. 
            O time definitivo para dominar a rodada.
          </p>


        </div>
      </section>

      {/* COMPARATIVO DE BANCADAS */}
      <section style={{ background: 'var(--surface-container-low)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <span className="label" style={{ color: 'var(--primary)', opacity: 0.7, letterSpacing: '0.15em' }}>ANÁLISE COMPARATIVA</span>
                <h2 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>PRINCIPAIS BANCADAS DA RODADA</h2>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                gap: '2.5rem' 
            }}>
                {sources.map((source, index) => (
                    <CartolaSquad 
                        key={index}
                        name={source.name}
                        strategy={source.strategy}
                        squad={'squad' in source ? (source.squad as any) : undefined}
                        highlights={'highlights' in source ? (source.highlights as any) : undefined}
                    />
                ))}
            </div>
        </div>
      </section>

      {/* ELITE COMMAND (Consolidated) */}
      <section className="section-container">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <EliteCommand 
                title={consolidated.title}
                description={consolidated.description}
                total_cost={consolidated.total_cost}
                squad={consolidated.squad as any}
            />
        </div>
      </section>

      {/* Subscription Teaser (Premium) */}
      <section className="section-container" style={{ textAlign: 'center', background: 'var(--surface)' }}>
         <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: 'var(--primary)' }}>ACESSO PREMIUM</h2>
            <p style={{ margin: '1.5rem 0', opacity: 0.9 }}>
              Tenha acesso a planilhas detalhadas, scout em tempo real e o grupo de 
              estratégia exclusiva dos Navegadores.
            </p>
            <button className="btn-primary">ASSINAR AGORA</button>
         </div>
      </section>
    </main>
  )
}
