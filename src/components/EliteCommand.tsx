'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Coins, 
  Shield, 
  Target, 
  Users, 
  Copy, 
  Check 
} from 'lucide-react'
import TacticalField from './TacticalField'

interface Player {
  pos: string
  name: string
  club: string
  price: number
  cap?: boolean
}

interface EliteCommandProps {
  squad: Player[]
  title: string
  description: string
  total_cost: number
}

export default function EliteCommand({ squad, title, description, total_cost }: EliteCommandProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = squad
      .map(p => `${p.pos}: ${p.name} (${p.club}) - C$ ${p.price.toFixed(2)}${p.cap ? ' ★' : ''}`)
      .join('\n')
    
    const fullText = `GDC-ARENA: ${title}\nEscalação:\n\n${text}\n\nCusto Total: C$ ${total_cost.toFixed(2)}`
    
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card" style={{ padding: '3rem', margin: '2rem 0', position: 'relative', overflow: 'hidden' }}>
        {/* Glow effect */}
        <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(226, 14, 14, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ maxWidth: '600px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <Zap size={24} style={{ color: 'var(--primary)' }} />
                        <span className="label" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)' }}>SQUAD GDC-ARENA</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{title}</h2>
                    <p style={{ opacity: 0.8, fontSize: '1.25rem' }}>{description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className="label" style={{ opacity: 0.5, fontSize: '0.8rem' }}>ORÇAMENTO TOTAL</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <Coins size={32} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontSize: '2rem', fontFamily: 'var(--font-epilogue)', fontWeight: 800 }}>C$ {total_cost.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
                
                {/* Control Bar (Simplified) */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center', 
                    width: '100%', 
                    maxWidth: '700px',
                    paddingBottom: '1rem',
                    marginBottom: '-1.5rem',
                    zIndex: 20
                }}>
                    <button
                        onClick={handleCopy}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.75rem'
                        }}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span className="label">{copied ? 'COPIADO' : 'COPIAR ESCALAÇÃO'}</span>
                    </button>
                </div>

                <div style={{ width: '100%', maxWidth: '700px' }}>
                    <TacticalField squad={squad} />
                </div>
                
                {/* Secondary Info Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '2rem',
                    width: '100%',
                    paddingTop: '2rem',
                    borderTop: '1px solid var(--outline-variant)'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Shield style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1rem' }}>FORÇA DEFENSIVA</h4>
                        <p className="label" style={{ fontSize: '0.8rem', opacity: 0.7 }}>Baseada no Scout do Colorado</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Target style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1rem' }}>MIRA NO GOL</h4>
                        <p className="label" style={{ fontSize: '0.8rem', opacity: 0.7 }}>Ataque focado em Gols e Assistências</p>
                    </div>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <Users style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                        <h4 style={{ fontSize: '1rem' }}>CONSISTÊNCIA</h4>
                        <p className="label" style={{ fontSize: '0.8rem', opacity: 0.7 }}>Mescla das Melhores Bancadas</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
