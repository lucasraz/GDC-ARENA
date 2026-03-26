import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventsClient from '../../components/EventsClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'edge'

export default async function EventosPage() {

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'

  // Fetch Events with profiles and attendees (including attendee profiles and their choice)
  // We fetch without comments join first to ensure events appear even if migration hasn't run
  const { data: events, error } = await supabase
    .from('events')
    .select(`
        *, 
        author_profile:profiles(full_name, avatar_url), 
        attendees:event_attendees(
            id,
            user_id, 
            selected_beer, 
            guest_name,
            is_paid,
            profiles(full_name, avatar_url, whatsapp)
        )
    `)
    .order('event_time', { ascending: true })

  // Safely fetch comments as a second step if events were found
  let eventsWithComments = events || []
  if (events && events.length > 0) {
    const { data: allComments } = await supabase
      .from('event_comments')
      .select(`
          *,
          author_profile:profiles(full_name, avatar_url)
      `)
      .in('event_id', events.map(e => e.id))

    if (allComments) {
        eventsWithComments = events.map(event => ({
            ...event,
            comments: allComments.filter(c => c.event_id === event.id)
        }))
    }
  }

  if (error) {
      console.error('Error fetching events:', error)
  }

  return (
    <main className="min-h-screen">
      <section className="section-container" style={{ paddingTop: '6rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <header style={{ marginBottom: '3rem' }}>
              <span className="label" style={{ color: 'var(--primary)', opacity: 0.7 }}>COMUNIDADE GDC</span>
              <h1 style={{ fontSize: '3.5rem', marginTop: '0.5rem', letterSpacing: '-0.02em', fontWeight: 900 }}>EVENTOS DO GIGANTE</h1>
              <p style={{ fontSize: '1.25rem', opacity: 0.6, marginTop: '1rem', maxWidth: '600px' }}>
                Encontros, caravanas e resenhas da nossa torcida. Marque sua presença e encontre a galera.
              </p>
          </header>

          <EventsClient 
            userId={user?.id} 
            tenantId={TENANT_ID} 
            initialEvents={eventsWithComments} 
          />
        </div>
      </section>
    </main>
  )
}
