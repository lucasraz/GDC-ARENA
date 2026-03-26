'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface Player {
  pos: string
  name: string
  club: string
  price: number
  cap?: boolean
}

interface TacticalFieldProps {
  squad: Player[]
}

const CLUB_LOGOS: Record<string, string> = {
  'PAL': 'https://s.sde.globo.com/media/organizations/2014/04/14/palmeiras_60x60.png',
  'FLA': 'https://s.sde.globo.com/media/organizations/2014/04/14/flamengo_60x60.png',
  'BOT': 'https://s.sde.globo.com/media/organizations/2014/04/14/botafogo_60x60.png',
  'FLU': 'https://s.sde.globo.com/media/organizations/2014/04/14/fluminense_60x60.png',
  'INT': 'https://s.sde.globo.com/media/organizations/2014/04/14/internacional_60x60.png',
  'BAH': 'https://s.sde.globo.com/media/organizations/2014/04/14/bahia_60x60.png',
  'SAN': 'https://s.sde.globo.com/media/organizations/2014/04/14/santos_60x60.png',
  'SAO': 'https://s.sde.globo.com/media/organizations/2014/04/14/sao_paulo_60x60.png',
  'COR': 'https://s.sde.globo.com/media/organizations/2014/04/14/corinthians_60x60.png',
  'CRU': 'https://s.sde.globo.com/media/organizations/2015/04/29/cruzeiro_60x60.png',
  'GRE': 'https://s.sde.globo.com/media/organizations/2014/04/14/gremio_60x60.png',
  'CAM': 'https://s.sde.globo.com/media/organizations/2014/04/14/atletico_mg_60x60.png',
  'VAS': 'https://s.sde.globo.com/media/organizations/2014/04/14/vasco_60x60.png'
}

export default function TacticalField({ squad }: TacticalFieldProps) {
  // Stable categories
  const categories: Record<string, Player[]> = { GOL: [], ZAG: [], LAT: [], MEI: [], ATA: [] }
  squad.forEach(p => {
    const pos = p.pos.toUpperCase()
    if (categories[pos]) categories[pos].push(p)
  })

  // Mathematical slots (Exact symmetrical percentages)
  const slots: Record<string, { top: number, left: number }[]> = {
    GOL: [{ top: 91, left: 50 }],
    ZAG: [{ top: 78, left: 35 }, { top: 78, left: 65 }],
    LAT: [{ top: 72, left: 16 }, { top: 72, left: 84 }],
    MEI: [{ top: 54, left: 50 }, { top: 44, left: 24 }, { top: 44, left: 76 }],
    ATA: [{ top: 12, left: 50 }, { top: 22, left: 18 }, { top: 22, left: 82 }]
  }

  return (
    <div 
        style={{
            position: 'relative',
            width: '100%',
            maxWidth: '600px',
            aspectRatio: '1 / 1.4',
            margin: '0 auto',
            background: 'repeating-linear-gradient(180deg, #429E1D 0px, #429E1D 40px, #3A8E19 40px, #3A8E19 80px)',
            borderRadius: '16px',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'visible'
        }}
    >
        {/* Pitch markings */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: 'white', opacity: 0.8 }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '28%', aspectRatio: '1/1', border: '4px solid white', borderRadius: '50%', opacity: 0.8 }}></div>
            <div style={{ position: 'absolute', top: 0, left: '16%', right: '16%', height: '18%', border: '4px solid white', borderTop: 'none', opacity: 0.8 }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: '16%', right: '16%', height: '18%', border: '4px solid white', borderBottom: 'none', opacity: 0.8 }}></div>
        </div>

        {/* Players Area */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            {Object.entries(categories).map(([pos, posPlayers]) => 
                posPlayers.map((player, idx) => {
                    const coords = slots[pos]?.[idx] || { top: 50, left: 50 }
                    const logo = CLUB_LOGOS[player.club.toUpperCase()]

                    return (
                        <motion.div
                            key={`${player.name}-${pos}-${idx}`}
                            initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
                            transition={{ delay: idx * 0.05 }}
                            style={{
                                position: 'absolute',
                                top: `${coords.top}%`,
                                left: `${coords.left}%`,
                                // Using Framer Motion's internal x/y instead of style.transform to avoid conflict with scale animations
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 10
                            }}
                        >
                            {/* Shield */}
                            <div className="tactical-shield">
                                {logo ? (
                                    <img src={logo} alt={player.club} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '0.65rem', fontWeight: 900 }}>{player.club}</div>
                                )}
                        {player.cap && (
                          <div style={{ 
                            position: 'absolute', 
                            top: '-4px', 
                            right: '-4px', 
                            background: 'var(--primary)', 
                            border: '2px solid white', 
                            borderRadius: '50%', 
                            width: 'min(22px, 5vw)', 
                            height: 'min(22px, 5vw)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            zIndex: 12,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}>
                            <Star size={10} style={{ color: '#000', fill: '#000' }} />
                          </div>
                        )}
                            </div>

                            {/* Label */}
                            <div className="tactical-label">
                                <div>{player.name}</div>
                                <div>C$ {player.price.toFixed(2)}</div>
                            </div>

                        </motion.div>
                    )
                })
            )}
        </div>
    </div>
  )
}
