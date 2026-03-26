'use client'

import { Calendar, Clock, Trophy } from 'lucide-react'

export default function NextGamesCard() {
  const games = [
    {
      opponent: 'CORITIBA',
      date: '01/04',
      time: '20:30',
      competition: 'BRASILEIRÃO',
      location: 'COUTO PEREIRA',
      type: 'FORA'
    },
    {
      opponent: 'BOTAFOGO',
      date: '04/04',
      time: '21:00',
      competition: 'BRASILEIRÃO',
      location: 'SÃO JANUÁRIO',
      type: 'CASA'
    }
  ]

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Calendar size={20} style={{ color: 'var(--primary)' }} />
        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>PRÓXIMOS CONFRONTOS</h3>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {games.map((game, idx) => (
          <div key={idx} style={{ 
            padding: '1rem', 
            background: 'var(--surface-container-high)', 
            borderRadius: '4px',
            borderLeft: `4px solid ${game.type === 'CASA' ? 'var(--primary)' : 'var(--outline)'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="label" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{game.competition}</span>
                <span className="label" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{game.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 900 }}>VASCO x {game.opponent}</h4>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', opacity: 0.8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={12} />
                    <span style={{ fontSize: '0.75rem' }}>{game.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} />
                    <span style={{ fontSize: '0.75rem' }}>{game.time}</span>
                </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}
