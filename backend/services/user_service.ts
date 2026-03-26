import { userRepository, UserProfile } from '@execution/repositories/user_repository'
import { storageRepository } from '@execution/repositories/storage_repository'

export class UserService {
  /**
   * Orchestrates profile update.
   * Ensures business rules from directives/manage_user_profile.md
   */
  static async updateProfile(
    userId: string, 
    tenantId: string, 
    data: Partial<Omit<UserProfile, 'id' | 'tenant_id' | 'avatar_url'>>,
    avatarFile?: File | null
  ): Promise<UserProfile> {
    // 1. Validation (Orchestration responsibility)
    if (!userId || !tenantId) {
      throw new Error("Orchestration Error: User identification and Tenant ID are mandatory.")
    }

    // 2. Handle Image Upload (Optional)
    let avatar_url = undefined
    if (avatarFile) {
        avatar_url = await storageRepository.uploadAvatar(userId, avatarFile)
    }

    // 3. Format and Validate Username (Orchestration responsibility)
    if (data.username) {
      data.username = data.username.toLowerCase().replace(/[^a-z0-9]/g, '-')
      
      const existingByUsername = await userRepository.findByUsername(data.username)
      if (existingByUsername && existingByUsername.id !== userId) {
        throw new Error("Orchestration Error: This username is already taken.")
      }
    }

    // 4. Fetch existing
    const existing = await userRepository.findById(userId, tenantId)
    
    // 5. Prepare updated data
    const updatedProfile: UserProfile = {
      ...(existing || {}),
      ...data,
      id: userId,
      tenant_id: tenantId, 
      avatar_url: avatar_url || existing?.avatar_url || '',
      full_name: data.full_name || existing?.full_name || '',
      username: data.username || existing?.username || '',
      display_name_preference: data.display_name_preference || existing?.display_name_preference || 'full_name',
      birth_date: data.birth_date || existing?.birth_date || '',
      whatsapp: data.whatsapp || existing?.whatsapp || '',
      membership_type: data.membership_type || existing?.membership_type || 'nenhum',

    }


    // 6. Persistence
    return await userRepository.save(updatedProfile)
  }
}
