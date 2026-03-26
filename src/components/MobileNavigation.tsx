'use client'

import { useEffect, useState } from 'react'

import { createPortal } from 'react-dom'
import HeaderLinks from './HeaderLinks'
import { logout } from '@/app/actions/auth_actions'

interface MobileNavigationProps {
  userLoggedIn: boolean
}

export default function MobileNavigation({ userLoggedIn }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const drawerContent = (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000000 }}>
      {/* Background Overlay */}
      <div 
        onClick={() => setIsOpen(false)} 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'rgba(0,0,0,0.95)', 
          backdropFilter: 'blur(20px)',
          animation: 'fade-in 0.3s ease-out'
        }}
      ></div>

      {/* Drawer Panel */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        bottom: 0, 
        width: 'min(310px, 88vw)', 
        background: 'var(--surface)', 
        padding: '2.5rem 1.5rem', 
        borderRight: '1px solid var(--outline-variant)', 
        boxShadow: '40px 0 100px rgba(0,0,0,1)', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h2 className="shimmer-text" style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em' }}>GDC ARENA</h2>
           <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '10px' }}>
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1 }}>
           <HeaderLinks 
             userLoggedIn={userLoggedIn} 
             isMobile={true} 
             onLinkClick={() => setIsOpen(false)} 
           />
        </nav>

        {userLoggedIn && (
          <form action={logout} style={{ marginTop: 'auto', paddingTop: '2.5rem' }}>
            <button type="submit" className="btn-primary" style={{ 
              width: '100%', 
              background: 'transparent', 
              border: '2px solid var(--primary)', 
              color: 'var(--primary)', 
              padding: '1.1rem', 
              fontWeight: 900,
              letterSpacing: '0.1em'
            }}>SAIR DO COMANDO</button>
          </form>
        )}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        `}} />
      </div>
    </div>
  );

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
          position: 'relative'
        }}
        aria-label="Menu"
      >
        {!isOpen ? (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        ) : (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        )}
      </button>

      {isOpen && mounted && typeof document !== 'undefined' && createPortal(
        drawerContent,
        document.body
      )}
    </div>
  )
}

