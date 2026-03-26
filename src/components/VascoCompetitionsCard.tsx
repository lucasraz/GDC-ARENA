'use client'

import { Star, Shield, Trophy } from 'lucide-react'

export default function VascoCompetitionsCard() {
  const competitions = [
    {
      name: 'BRASILEIRÃO 2026',
      status: 'EM ANDAMENTO',
      stats: '9º LUGAR | 11 PTS',
      next: 'CORITIBA (FORA)',
      icon: <Trophy size={16} />
    },
    {
      name: 'SUL-AMERICANA 2026',
      status: 'FASE DE GRUPOS (G)',
      stats: 'ESTREIA EM 07/04',
      next: 'BARRACAS (FORA)',
      icon: <Star size={16} />
    }
  ]

  return (
    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Shield size={18} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '0.9rem', fontWeight: 900 }}>GIGANTE NAS COPAS</h3>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {competitions.map((comp, idx) => (
          <div key={idx} style={{ 
            padding: '1rem', 
            background: 'var(--surface-container-low)', 
            borderRadius: '4px',
            border: '1px solid var(--outline-variant)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--primary)' }}>{comp.icon}</span>
                <span className="label" style={{ fontSize: '0.75rem', fontWeight: 700 }}>{comp.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{comp.stats}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{comp.status}</span>
            </div>
            <p style={{ fontSize: '0.7rem', opacity: 0.5, borderTop: '1px solid var(--outline-variant)', paddingTop: '0.5rem' }}>
                PRÓXIMO: {comp.next}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
