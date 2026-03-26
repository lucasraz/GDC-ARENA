import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth_actions'
import { userRepository } from '@execution/repositories/user_repository'
import HeaderLinks from './HeaderLinks'

export default async function Header() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'
  
  const profile = user ? await userRepository.findById(user.id, TENANT_ID) : null

  return (
    <nav className="glass-nav">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/noticias" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Image 
              src="/logo.png" 
              alt="GDC ARENA Logo" 
              width={85} 
              height={85} 
              style={{ borderRadius: '4px' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 className="shimmer-text" style={{ fontSize: '1.25rem', letterSpacing: '0', fontWeight: 900, lineHeight: 1 }}>GDC ARENA</h2>
              <p style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 700, letterSpacing: '0.05em', marginTop: '0.2rem' }}>GIGANTES DA CERVA</p>
            </div>

          </Link>

          <a 
            href="https://www.instagram.com/gigantesdacervaa?igsh=MWJ6Njg2YnRrMGFjdA==" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s', textDecoration: 'none', color: 'inherit' }}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" 
              alt="Instagram" 
              style={{ width: '22px', height: '22px' }}
            />
            <span className="label" style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.05em' }}>INSTAGRAM</span>
          </a>

        </div>

        
        <HeaderLinks userLoggedIn={!!user} />


        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user && profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--outline-variant)' }}>
              <div style={{ textAlign: 'right' }}>
                 <p style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '0.1rem' }}>BEM-VINDO(A)</p>
                 <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>{profile.full_name?.split(' ')[0] || 'NAVEGADOR'}</p>
              </div>
              <a href="/profile" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--primary)', background: 'var(--surface)' }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.75rem' }}>
                    {profile.full_name?.[0] || 'U'}
                  </div>
                )}
              </a>
              <form action={logout}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ 
                    background: 'transparent', 
                    border: '1px solid var(--primary)', 
                    color: 'var(--primary)',
                    fontSize: '0.65rem', 
                    padding: '0.4rem 0.8rem' 
                  }}
                >
                  SAIR
                </button>
              </form>
            </div>
          ) : (
            <a href="/login" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}>
              Entrar
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}
