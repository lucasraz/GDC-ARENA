'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface HeaderLinksProps {
  userLoggedIn: boolean
  isMobile?: boolean
  onLinkClick?: () => void
}

export default function HeaderLinks({ userLoggedIn, isMobile = false, onLinkClick }: HeaderLinksProps) {
  const pathname = usePathname()

  const links = [
    { href: '/noticias', label: 'NOTÍCIAS' },
    { href: '/', label: 'CRÔNICAS' },
    { href: '/cartola-dicas', label: 'CARTOLA-DICAS' },
    { href: '/eventos', label: 'EVENTOS' },
  ]

  if (userLoggedIn) {
    links.push({ href: '/my-cronicas', label: 'MINHAS CRÔNICAS' })
  }

  return (
    <div className={isMobile ? "" : "desktop-only"} style={{ 
      display: 'flex', 
      gap: isMobile ? '2rem' : '1.5rem', 
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row'
    }}>

      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            onClick={onLinkClick}
            className="label" 
            style={{ 
              color: isActive ? 'var(--primary)' : 'inherit', 
              textDecoration: 'none', 
              fontSize: isMobile ? '1.1rem' : '0.75rem',
              fontWeight: isActive ? 900 : 700,
              paddingBottom: isMobile ? '0.5rem' : '0.25rem',
              borderBottom: !isMobile && isActive ? '2px solid var(--primary)' : 'none',
              borderLeft: isMobile && isActive ? '4px solid var(--primary)' : 'none',
              paddingLeft: isMobile && isActive ? '1rem' : '0',
              transition: 'all 0.2s ease',
              opacity: isActive ? 1 : 0.8,
              letterSpacing: '0.05em'
            }}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

