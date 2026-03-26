import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth_actions'
import { userRepository } from '@execution/repositories/user_repository'
import HeaderLinks from './HeaderLinks'
import MobileNavigation from './MobileNavigation'

export default async function Header() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'
  
  const profile = user ? await userRepository.findById(user.id, TENANT_ID) : null

  const displayName = profile?.display_name_preference === 'username' && profile?.username 
    ? profile.username 
    : profile?.full_name?.split(' ')[0] || 'NAVEGADOR'

  return (
    <nav className="glass-nav">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
        
        <MobileNavigation userLoggedIn={!!user} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'min(1.5rem, 3vw)', minWidth: 0 }}>
          <Link href="/noticias" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 'min(1.2rem, 3vw)', minWidth: 0 }}>
            <Image 
              src="/logo.png" 
              alt="GDC ARENA Logo" 
              width={85} 
              height={85} 
              className="desktop-only"
              style={{ borderRadius: '4px' }}
            />
            
            <Image 
              src="/logo.png" 
              alt="GDC ARENA Logo" 
              width={32} 
              height={32} 
              className="mobile-only"
              style={{ borderRadius: '4px', flexShrink: 0 }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', minWidth: 0 }}>
                <h2 className="shimmer-text" style={{ fontSize: 'clamp(0.7rem, 3vw, 1.25rem)', letterSpacing: '-0.025em', fontWeight: 900, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>GDC ARENA</h2>
                <img 
                  src="/vasco-logo.png" 
                  alt="Vasco" 
                  style={{ 
                    height: 'clamp(18px, 4.5vw, 28px)', 
                    marginLeft: '2px',
                    flexShrink: 0,
                    filter: 'drop-shadow(0px 0px 6px rgba(255,255,255,0.3)) drop-shadow(0px 4px 10px rgba(255,255,255,0.15))'
                  }} 
                />
              </div>
            </div>
          </Link>
        </div>

        <div className="desktop-only">
          <HeaderLinks userLoggedIn={!!user} />
        </div>

        <div style={{ display: 'flex', gap: 'min(1rem, 2vw)', alignItems: 'center', flexShrink: 0 }}>
          {user && profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'min(1rem, 2vw)', marginLeft: 'min(0.5rem, 2vw)', paddingLeft: 'min(1rem, 2vw)', borderLeft: '1px solid var(--outline-variant)' }}>
              <div className="desktop-only" style={{ textAlign: 'center' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.1rem' }}>BEM-VINDO(A)</p>
                 <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>{displayName}</p>
              </div>

              <a href="/profile" style={{ width: 'clamp(32px, 8vw, 40px)', height: 'clamp(32px, 8vw, 40px)', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: 'var(--surface)', flexShrink: 0 }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.7rem' }}>
                    {profile.full_name?.[0] || 'U'}
                  </div>
                )}
              </a>
              <form action={logout} className="desktop-only">
                <button type="submit" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '0.65rem', padding: '0.4rem 0.8rem' }}>SAIR</button>
              </form>
            </div>
          ) : (
            <a href="/login" className="btn-primary" style={{ fontSize: 'clamp(0.6rem, 2.8vw, 0.75rem)', padding: '0.4rem 0.7rem', flexShrink: 0, borderRadius: '4px', marginLeft: '0.25rem' }}>
              ENTRAR
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}

