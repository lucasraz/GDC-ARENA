'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface HeaderLinksProps {
  userLoggedIn: boolean
}

export default function HeaderLinks({ userLoggedIn }: HeaderLinksProps) {
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
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className="label" 
            style={{ 
              color: isActive ? 'var(--primary)' : 'inherit', 
              textDecoration: 'none', 
              fontSize: '0.75rem',
              fontWeight: isActive ? 900 : 500,
              paddingBottom: '0.25rem',
              borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              opacity: isActive ? 1 : 0.7
            }}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
