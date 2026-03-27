
export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer style={{ 
      background: 'var(--surface-container-low)', 
      padding: '4rem 1.5rem', 
      borderTop: '1px solid var(--outline-variant)',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '0.05em', opacity: 0.8 }}>GDC ARENA</h2>
          
          <a 
            href="https://www.instagram.com/gigantesdacervaa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
                color: 'var(--primary)', 
                opacity: 0.8, 
                transition: 'opacity 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                marginBottom: '1rem'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', fontWeight: 900, letterSpacing: '0.1em' }}>INSTAGRAM OFICIAL</span>
          </a>

          <p style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.1em', fontWeight: 500 }}>
            © {currentYear} GIGANTES DA CERVA. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div style={{ marginTop: '1rem', width: '40px', height: '2px', background: 'var(--primary)', opacity: 0.5 }}></div>
        </div>
      </div>
    </footer>
  )
}
