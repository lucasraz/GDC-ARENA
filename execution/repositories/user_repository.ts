import { createClient } from '@/lib/supabase/server'

export interface UserProfile {
  id: string
  tenant_id: string
  full_name: string
  username: string
  nickname?: string
  display_name_preference?: 'full_name' | 'nickname'
  avatar_url?: string
  birth_date?: string
  whatsapp?: string
  membership_type?: 'socio_torcedor' | 'estatutario' | 'nenhum'
}


export const userRepository = {
  async findById(id: string, tenant_id: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenant_id) // Mandatory isolation
      .single()

    if (error) return null
    return data
  },

  async save(profile: UserProfile): Promise<UserProfile> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single()

    if (error) throw new Error(`Repository Error: ${error.message}`)
    return data
  },

  async findByUsername(username: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error) return null
    return data
  }
}
