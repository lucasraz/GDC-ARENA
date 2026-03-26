import { Trophy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TabelaPage() {
  const teams = [
    { pos: 1, team: 'Palmeiras', pts: 19, j: 8, v: 6, e: 1, d: 1, gp: 17, gc: 8, sg: 9 },
    { pos: 2, team: 'São Paulo', pts: 16, j: 8, v: 5, e: 1, d: 2, gp: 10, gc: 5, sg: 5 },
    { pos: 3, team: 'Fluminense', pts: 16, j: 8, v: 5, e: 1, d: 2, gp: 13, gc: 9, sg: 4 },
    { pos: 4, team: 'Flamengo', pts: 14, j: 7, v: 4, e: 2, d: 1, gp: 13, gc: 5, sg: 8 },
    { pos: 5, team: 'Bahia', pts: 14, j: 7, v: 4, e: 2, d: 1, gp: 9, gc: 7, sg: 2 },
    { pos: 6, team: 'Athletico-PR', pts: 13, j: 7, v: 4, e: 1, d: 2, gp: 10, gc: 7, sg: 3 },
    { pos: 7, team: 'Coritiba', pts: 13, j: 8, v: 4, e: 1, d: 3, gp: 9, gc: 8, sg: 1 },
    { pos: 8, team: 'Grêmio', pts: 11, j: 8, v: 3, e: 2, d: 3, gp: 13, gc: 12, sg: 1 },
    { pos: 9, team: 'VASCO', pts: 11, j: 8, v: 3, e: 2, d: 3, gp: 13, gc: 13, sg: 0 },
    { pos: 10, team: 'Vitória', pts: 10, j: 7, v: 3, e: 1, d: 3, gp: 8, gc: 10, sg: -2 },
    { pos: 11, team: 'Internacional', pts: 10, j: 8, v: 3, e: 1, d: 4, gp: 7, gc: 10, sg: -3 },
    { pos: 12, team: 'Cruzeiro', pts: 9, j: 8, v: 2, e: 3, d: 3, gp: 8, gc: 11, sg: -3 },
    { pos: 13, team: 'Botafogo', pts: 8, j: 7, v: 2, e: 2, d: 3, gp: 8, gc: 9, sg: -1 },
    { pos: 14, team: 'Atlético-GO', pts: 8, j: 8, v: 2, e: 2, d: 4, gp: 6, gc: 9, sg: -3 },
    { pos: 15, team: 'Corinthians', pts: 7, j: 8, v: 1, e: 4, d: 3, gp: 5, gc: 8, sg: -3 },
    { pos: 16, team: 'Fortaleza', pts: 7, j: 7, v: 1, e: 4, d: 2, gp: 4, gc: 7, sg: -3 },
    { pos: 17, team: 'Bragantino', pts: 6, j: 8, v: 1, e: 3, d: 4, gp: 5, gc: 11, sg: -6 },
    { pos: 18, team: 'Criciúma', pts: 5, j: 7, v: 1, e: 2, d: 4, gp: 6, gc: 12, sg: -6 },
    { pos: 19, team: 'Cuiabá', pts: 2, j: 7, v: 0, e: 2, d: 5, gp: 3, gc: 12, sg: -9 },
    { pos: 20, team: 'Atlético-MG', pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0 },
  ]

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '6rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <Link href="/noticias" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'inherit', textDecoration: 'none', marginBottom: '2rem', opacity: 0.6 }}>
            <ArrowLeft size={16} /> VOLTAR PARA NOTÍCIAS
          </Link>

          <header style={{ marginBottom: '3rem' }}>
              <span className="label" style={{ color: 'var(--primary)', opacity: 0.7 }}>BRASILEIRÃO 2026</span>
              <h1 style={{ fontSize: '3.5rem', marginTop: '0.5rem', letterSpacing: '-0.02em', fontWeight: 900 }}>CLASSIFICAÇÃO COMPLETA</h1>
              <p style={{ fontSize: '1.25rem', opacity: 0.6, marginTop: '1rem' }}>Rodada 8 de 38</p>
          </header>

          <div className="glass-card" style={{ padding: '2rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--outline-variant)', opacity: 0.5 }}>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem' }}>POS</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem' }}>CLUBE</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>PTS</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>J</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>V</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>E</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>D</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>GP</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>GC</th>
                  <th style={{ padding: '1rem 0.5rem', fontSize: '0.75rem', textAlign: 'center' }}>SG</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => (
                  <tr key={team.pos} style={{ 
                    borderBottom: '1px solid var(--outline-variant)',
                    background: team.team === 'VASCO' ? 'rgba(255,215,0,0.05)' : 'transparent',
                    fontWeight: team.team === 'VASCO' ? 900 : 400
                  }}>
                    <td style={{ padding: '1rem 0.5rem', opacity: idx < 4 ? 1 : idx >= 16 ? 0.5 : 0.7, color: idx < 4 ? '#81C784' : idx >= 16 ? '#E57373' : 'inherit' }}>{team.pos}</td>
                    <td style={{ padding: '1rem 0.5rem', color: team.team === 'VASCO' ? 'var(--primary)' : 'inherit' }}>{team.team}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', fontWeight: 900 }}>{team.pts}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.j}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.v}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.e}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.d}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.gp}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', opacity: 0.6 }}>{team.gc}</td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'center', color: team.sg > 0 ? '#81C784' : team.sg < 0 ? '#E57373' : 'inherit' }}>{team.sg}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer style={{ marginTop: '2rem', display: 'flex', gap: '2rem', fontSize: '0.65rem', opacity: 0.5 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#81C784' }}></div> LIBERTADORES (G4)</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E57373' }}></div> REBAIXAMENTO (Z4)</div>
            </footer>
          </div>
        </div>
      </section>
    </main>
  )
}
