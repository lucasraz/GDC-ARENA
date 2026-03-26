'use server'

import { UserService } from '@backend/services/user_service'
import { revalidatePath } from 'next/cache'

/**
 * Server Action to update user profile.
 * Implements Layer 2 (Orchestration) via Layer 1 Directives.
 */
export async function updateProfile(userId: string, tenantId: string, formData: FormData) {
  try {
    const full_name = formData.get('full_name') as string
    const username = formData.get('username') as string
    const display_name_preference = formData.get('display_name_preference') as any
    const birth_date = formData.get('birth_date') as string
    const whatsapp = formData.get('whatsapp') as string
    const membership_type = formData.get('membership_type') as any
    const avatarFile = formData.get('avatar') as File | null

    // Call the Orchestration Layer
    await UserService.updateProfile(userId, tenantId, {
      full_name,
      username,
      display_name_preference,
      birth_date,
      whatsapp,
      membership_type,
    }, avatarFile)



    // Revalidate the path to refresh UI
    revalidatePath('/')
    revalidatePath('/profile')
    
    return { success: true }
  } catch (error: any) {
    console.error('Action Error (updateProfile):', error.message)
    return { 
      success: false, 
      message: error.message
    }
  }
}
