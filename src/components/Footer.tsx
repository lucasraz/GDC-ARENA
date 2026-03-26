
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
          <p style={{ fontSize: '0.75rem', opacity: 0.5, letterSpacing: '0.1em', fontWeight: 500 }}>
            © {currentYear} GIGANTES DA CERVA. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div style={{ marginTop: '1rem', width: '40px', height: '2px', background: 'var(--primary)', opacity: 0.5 }}></div>
        </div>
      </div>
    </footer>
  )
}
