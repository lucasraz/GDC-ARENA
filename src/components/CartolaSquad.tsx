'use client'

import { motion } from 'framer-motion'
import { Trophy, Coins, User, Star } from 'lucide-react'

interface Player {
  pos: string
  name: string
  club: string
  price: number
  cap?: boolean
}

interface SquadProps {
  name: string
  strategy: string
  squad?: Player[]
  highlights?: string[]
}

export default function CartolaSquad({ name, strategy, squad, highlights }: SquadProps) {
  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{name}</h3>
        <span className="label" style={{ fontSize: '0.7rem', opacity: 0.6 }}>{strategy}</span>
      </div>

      {squad && (
        <div style={{ flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--surface-container-highest)', textAlign: 'left' }}>
                <th className="label" style={{ padding: '0.5rem 0', fontSize: '0.7rem', opacity: 0.5 }}>POS</th>
                <th className="label" style={{ padding: '0.5rem 0', fontSize: '0.7rem', opacity: 0.5 }}>ATLETA</th>
                <th className="label" style={{ padding: '0.5rem 0', fontSize: '0.7rem', opacity: 0.5, textAlign: 'right' }}>$$$</th>
              </tr>
            </thead>
            <tbody>
              {squad.map((player, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--outline-variant)', opacity: 0.9 }}>
                  <td className="label" style={{ padding: '0.5rem 0', fontSize: '0.75rem', fontWeight: 700 }}>{player.pos}</td>
                  <td style={{ padding: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="label" style={{ fontSize: '0.85rem' }}>{player.name}</span>
                      <span className="label" style={{ fontSize: '0.65rem', opacity: 0.5 }}>({player.club})</span>
                      {player.cap && <Star size={12} style={{ color: 'var(--primary)' }} />}
                    </div>
                  </td>
                  <td className="label" style={{ padding: '0.5rem 0', fontSize: '0.75rem', textAlign: 'right' }}>{player.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {highlights && (
        <ul style={{ listStyle: 'none', flex: 1 }}>
          {highlights.map((h, idx) => (
            <li key={idx} style={{ padding: '0.75rem 0', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', opacity: 0.9 }}>
              <Trophy size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
              {h}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-container-highest)' }}>
          <button className="label" style={{ background: 'transparent', border: 'none', color: 'var(--on-surface)', cursor: 'pointer', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
            Ver Análise Completa →
          </button>
      </div>
    </div>
  )
}
