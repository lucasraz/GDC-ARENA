import { cronicaRepository } from '@execution/repositories/cronica_repository'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MyCronicasClient from '../../components/MyCronicasClient'

export default async function MyCronicasPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'
  
  const myCronicas = await cronicaRepository.findByAuthor(user.id, TENANT_ID)

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '6rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
                <span className="label" style={{ color: 'var(--primary)', opacity: 0.7 }}>ESPAÇO DO NAVEGADOR</span>
                <h1 style={{ fontSize: '3rem', marginTop: '0.5rem' }}>MINHAS CRÔNICAS</h1>
            </div>
          </header>

          <MyCronicasClient 
            userId={user.id} 
            tenantId={TENANT_ID} 
            initialCronicas={myCronicas} 
          />
        </div>
      </section>
    </main>
  )
}
