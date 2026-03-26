'use client'

import React from 'react'
import { Share2, Clock, MapPin, Users, MessageCircle } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  text?: string
  url?: string
  variant?: 'minimal' | 'full'
}

export default function ShareButtons({ title, text, url, variant = 'full' }: ShareButtonsProps) {
  const shareUrl = url || typeof window !== 'undefined' ? window.location.href : ''
  const shareText = text || `Confira isso no GDC ARENA! 🏴‍☠️🚩\n${title}`

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: `GDC ARENA - ${title}`,
        text: shareText,
        url: shareUrl,
      }).catch(console.error)
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`
      window.open(waUrl, '_blank')
    }
  }

  if (variant === 'minimal') {
    return (
      <button 
        onClick={handleShare}
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid var(--outline-variant)', 
          color: 'white', 
          padding: '0.4rem', 
          borderRadius: '6px', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s'
        }}
        title="Compartilhar"
      >
        <Share2 size={16} />
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <button 
        onClick={handleShare}
        className="btn-primary"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '0.6rem 1.25rem',
          fontSize: '0.85rem',
          background: 'var(--surface-container-high)',
          border: '1px solid var(--primary)',
          color: 'var(--primary)',
          fontWeight: 900
        }}
      >
        <Share2 size={18} /> COMPARTILHAR
      </button>
    </div>
  )
}
