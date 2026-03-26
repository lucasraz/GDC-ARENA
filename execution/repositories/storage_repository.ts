import { createClient } from '@/lib/supabase/server'

export const storageRepository = {
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error } = await supabase.storage
      .from('profiles')
      .upload(filePath, file)

    if (error) {
      // If bucket doesn't exist, this might fail. In a real app we'd ensure it exists.
      throw new Error(`Storage Error: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    return publicUrl
  }
}
