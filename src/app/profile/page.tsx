import ProfileForm from '@/components/ProfileForm'
import { updateProfile } from '@/app/actions/user_actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { userRepository } from '@execution/repositories/user_repository'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // MOCK tenant until we implement the full discovery
  const TENANT_ID = 'tenant_1'
  
  const profile = await userRepository.findById(user.id, TENANT_ID)

  // Pre-bind the action 
  const updateProfileAction = updateProfile.bind(null, user.id, TENANT_ID)

  return (
    <main className="min-h-screen">
      
      <section className="section-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '6rem' }}>
        <ProfileForm 
          onSubmit={updateProfileAction}
          initialData={{
            full_name: profile?.full_name || '',
            username: profile?.username || '',
            avatar_url: profile?.avatar_url || '',
            birth_date: profile?.birth_date || '',
            whatsapp: profile?.whatsapp || '',
            membership_type: profile?.membership_type || 'nenhum'
          }}
        />
        

      </section>
    </main>
  )
}
