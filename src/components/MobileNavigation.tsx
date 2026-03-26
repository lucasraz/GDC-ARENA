'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import HeaderLinks from './HeaderLinks'
import { logout } from '@/app/actions/auth_actions'

interface MobileNavigationProps {
  userLoggedIn: boolean
}

export default function MobileNavigation({ userLoggedIn }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mobile-only" style={{ position: 'relative', zIndex: 10000, width: '40px', flexShrink: 0 }}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer', 
          padding: '1rem', 
          margin: '-1rem',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10001
        }}
        aria-label="Menu"
      >
        {isOpen ? <X size={28} style={{ pointerEvents: 'none' }} /> : <Menu size={28} style={{ pointerEvents: 'none' }} />}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10002 }}>


          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
          ></div>
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '280px', background: 'var(--surface)', padding: '2rem', borderRight: '1px solid var(--outline-variant)', boxShadow: '20px 0 50px rgba(0,0,0,0.5)' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 className="shimmer-text" style={{ fontSize: '1rem', fontWeight: 900 }}>GDC ARENA</h2>
               <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <HeaderLinks 
                 userLoggedIn={userLoggedIn} 
                 isMobile={true} 
                 onLinkClick={() => setIsOpen(false)} 
               />
               {userLoggedIn && (
                 <form action={logout}>
                   <button type="submit" className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.8rem', marginTop: '1rem' }}>SAIR</button>
                 </form>
               )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
