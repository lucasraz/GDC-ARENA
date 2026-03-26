'use client'

import { Trophy } from 'lucide-react'

export default function StandingsCard() {
  const teams = [
    { pos: 1, team: 'Palmeiras', pts: 19, j: 8, v: 6, sg: 9 },
    { pos: 2, team: 'São Paulo', pts: 16, j: 8, v: 5, sg: 5 },
    { pos: 3, team: 'Fluminense', pts: 16, j: 8, v: 5, sg: 4 },
    { pos: 4, team: 'Flamengo', pts: 14, j: 7, v: 4, sg: 8 },
    { pos: 5, team: 'Bahia', pts: 14, j: 7, v: 4, sg: 2 },
    { pos: 6, team: 'Athletico-PR', pts: 13, j: 7, v: 4, sg: 3 },
    { pos: 7, team: 'Coritiba', pts: 13, j: 8, v: 4, sg: 1 },
    { pos: 8, team: 'Grêmio', pts: 11, j: 8, v: 3, sg: 1 },
    { pos: 9, team: 'VASCO', pts: 11, j: 8, v: 3, sg: 0 },
    { pos: 10, team: 'Vitória', pts: 10, j: 7, v: 3, sg: -2 }
  ]

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <header style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Trophy size={18} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 900 }}>BRASILEIRÃO 2026 - RODADA 8</h3>
      </header>

      <div style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '30px 1fr 40px 30px 40px', padding: '0.5rem 0', borderBottom: '1px solid var(--outline-variant)', opacity: 0.6, fontWeight: 700 }}>
            <span>POS</span>
            <span>CLUBE</span>
            <span style={{ textAlign: 'center' }}>PTS</span>
            <span style={{ textAlign: 'center' }}>J</span>
            <span style={{ textAlign: 'center' }}>SG</span>
        </div>
        {teams.map((team: any) => (
          <div key={team.pos} style={{ 
            display: 'grid', 
            gridTemplateColumns: '30px 1fr 40px 30px 40px', 
            padding: '0.6rem 0', 
            borderBottom: '1px solid var(--outline-variant)', 
            background: team.team === 'VASCO' ? 'rgba(255,215,0,0.1)' : 'transparent',
            borderRadius: team.team === 'VASCO' ? '4px' : '0',
            fontWeight: team.team === 'VASCO' ? 900 : 500,
            color: team.team === 'VASCO' ? 'var(--primary)' : 'inherit'
          }}>
            <span style={{ opacity: 0.6 }}>{team.pos}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {team.team}
            </span>
            <span style={{ textAlign: 'center', fontWeight: 900 }}>{team.pts}</span>
            <span style={{ textAlign: 'center', opacity: 0.8 }}>{team.j}</span>
            <span style={{ textAlign: 'center', opacity: 0.8, color: team.sg > 0 ? '#81C784' : team.sg < 0 ? '#E57373' : 'inherit' }}>{team.sg > 0 ? `+${team.sg}` : team.sg}</span>
          </div>
        ))}
      </div>

      <a href="/tabela" style={{ 
        display: 'block', 
        width: '100%', 
        marginTop: '1.5rem', 
        textAlign: 'center', 
        fontSize: '0.7rem', 
        fontWeight: 900, 
        color: 'var(--primary)', 
        textDecoration: 'none' 
      }}>
        VER TABELA COMPLETA →
      </a>
    </div>
  )
}
