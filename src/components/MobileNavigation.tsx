'use client'

import { useState } from 'react'
import HeaderLinks from './HeaderLinks'
import { logout } from '@/app/actions/auth_actions'

interface MobileNavigationProps {
  userLoggedIn: boolean
}

export default function MobileNavigation({ userLoggedIn }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-only" style={{ width: '40px', height: '40px' }}>
      <button 
        onClick={toggleMenu}
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'white', 
          cursor: 'pointer', 
          padding: '10px',
          width: '50px',
          height: '50px',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 100000
        }}
        aria-label="Menu"
      >
        {!isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </button>

      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100001 }}>
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(15px)' }}
          ></div>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            bottom: 0, 
            width: 'min(310px, 88vw)', 
            background: 'var(--surface)', 
            padding: '2.5rem 1.5rem', 
            borderRight: '1px solid var(--outline-variant)', 
            boxShadow: '40px 0 80px rgba(0,0,0,0.9)', 
            overflowY: 'auto' 
          }}>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2 className="shimmer-text" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>GDC ARENA</h2>
               <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '10px' }}>
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <line x1="18" y1="6" x2="6" y2="18"></line>
                   <line x1="6" y1="6" x2="18" y2="18"></line>
                 </svg>
               </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <HeaderLinks 
                 userLoggedIn={userLoggedIn} 
                 isMobile={true} 
                 onLinkClick={() => setIsOpen(false)} 
               />
               
               {userLoggedIn && (
                 <form action={logout}>
                   <button type="submit" className="btn-primary" style={{ 
                     width: '100%', 
                     background: 'transparent', 
                     border: '2px solid var(--primary)', 
                     color: 'var(--primary)', 
                     padding: '1rem', 
                     marginTop: '2rem', 
                     fontWeight: 900,
                     letterSpacing: '0.1em'
                   }}>SAIR DO COMANDO</button>
                 </form>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
