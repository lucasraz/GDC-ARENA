import { createClient } from '@/lib/supabase/server'

export interface Cronica {
  id: string
  author_id: string
  tenant_id: string
  title: string
  content: string
  image_url?: string
  created_at: string
  // Virtual field loaded with .select('*, profiles(*)')
  author_profile?: {
    full_name: string
    avatar_url: string
  }
}

export interface Comment {
  id: string
  cronica_id: string
  author_id: string
  text: string
  created_at: string
  author_profile?: {
    full_name: string
    avatar_url: string
  }
}

export const cronicaRepository = {
  async findAll(tenant_id: string): Promise<Cronica[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cronicas')
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .eq('tenant_id', tenant_id)
      .order('created_at', { ascending: false })

    if (error) return []
    return data as any
  },

  async findByAuthor(author_id: string, tenant_id: string): Promise<Cronica[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cronicas')
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .eq('author_id', author_id)
      .eq('tenant_id', tenant_id)
      .order('created_at', { ascending: false })

    if (error) return []
    return data as any
  },

  async findById(id: string): Promise<Cronica | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cronicas')
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as any
  },

  async save(cronica: Partial<Cronica>): Promise<Cronica> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('cronicas')
      .upsert(cronica)
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .single()

    if (error) throw new Error(`Repository Error (Cronica): ${error.message}`)
    return data as any
  },

  async delete(id: string, author_id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('cronicas')
      .delete()
      .eq('id', id)
      .eq('author_id', author_id) // Security check

    if (error) throw new Error(`Repository Error (Delete Cronica): ${error.message}`)
  },

  // --- COMMENTS ---
  async findComments(cronica_id: string): Promise<Comment[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('comments')
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .eq('cronica_id', cronica_id)
      .order('created_at', { ascending: true })

    if (error) return []
    return data as any
  },

  async saveComment(comment: Partial<Comment>): Promise<Comment> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('comments')
      .upsert(comment)
      .select('*, author_profile:profiles(full_name, avatar_url)')
      .single()

    if (error) throw new Error(`Repository Error (Comment): ${error.message}`)
    return data as any
  },

  async deleteComment(id: string, author_id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('author_id', author_id)

    if (error) throw new Error(`Repository Error (Delete Comment): ${error.message}`)
  }
}
