'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { 
      href: '/noticias', 
      label: 'NOTÍCIAS', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-nav-icon">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
          <path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" />
        </svg>
      ) 
    },
    { 
      href: '/', 
      label: 'CRÔNICAS', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-nav-icon">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M8 7h6" /><path d="M8 11h8" /><path d="M8 15h5" />
        </svg>
      ) 
    },
    { 
      href: '/cartola-dicas', 
      label: 'BOTEC-IA', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-nav-icon">
          <path d="m13 10 3.5-3.5a2 2 0 0 1 2.8 2.8L15.8 12.8" /><path d="m3.3 20.7 6.2-6.2" /><path d="M10 10.5 5.5 6a2 2 0 0 1 2.8-2.8L13 7.8" /><path d="m14 14 6.2 6.2" /><path d="M8.5 13.5l1.6-1.6" /><path d="M13 10.5l-1.6 1.6" /><path d="M13.5 15.5l1.6-1.6" /><path d="m14 14-1.6 1.6" /><path d="M19 14.5a2 2 0 0 1 2 2V21h-4.5a2 2 0 0 1-2-2v-4.5a2 2 0 0 1 2-2H19Z" />
        </svg>
      ) 
    },
    { 
      href: '/eventos', 
      label: 'EVENTOS', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-nav-icon">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
        </svg>
      ) 
    },
    { 
      href: '/profile', 
      label: 'PERFIL', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mobile-nav-icon">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
      ) 
    },
  ]

  return (
    <nav className="mobile-bottom-nav mobile-only">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
