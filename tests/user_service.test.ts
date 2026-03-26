import { describe, it, expect, vi } from 'vitest'
import { UserService } from '@backend/services/user_service'
import { userRepository } from '@execution/repositories/user_repository'

describe('UserService - Profile Management', () => {
  it('should throw an error if userId or tenantId is missing', async () => {
    await expect(UserService.updateProfile('', '', {}))
      .rejects.toThrow("Orchestration Error")
  })

  it('should slagify the username (lowercase and replace non-alphanumeric with dashes)', async () => {
    const saveSpy = vi.spyOn(userRepository, 'save').mockResolvedValue({
      id: 'u1', tenant_id: 't1', full_name: 'John', username: 'john-doe'
    })
    vi.spyOn(userRepository, 'findById').mockResolvedValue(null)
    vi.spyOn(userRepository, 'findByUsername').mockResolvedValue(null)

    await UserService.updateProfile('u1', 't1', { username: 'John Doe!' })
    
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      username: 'john-doe-'
    }))
    saveSpy.mockRestore()
  })

  it('should throw if the username is already taken by another user', async () => {
    vi.spyOn(userRepository, 'findByUsername').mockResolvedValue({
      id: 'other-user', tenant_id: 't1', full_name: 'Other', username: 'taken'
    })

    await expect(UserService.updateProfile('my-id', 't1', { username: 'taken' }))
      .rejects.toThrow("This username is already taken.")
  })

  it('should include tenant_id in every profile update', async () => {
    const saveSpy = vi.spyOn(userRepository, 'save').mockResolvedValue({
      id: 'u-123', tenant_id: 'tenant-abc', full_name: 'Name', username: 'name'
    })
    vi.spyOn(userRepository, 'findById').mockResolvedValue(null)
    vi.spyOn(userRepository, 'findByUsername').mockResolvedValue(null)

    await UserService.updateProfile('u-123', 'tenant-abc', { full_name: 'Updated Name' })
    
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      tenant_id: 'tenant-abc'
    }))
    saveSpy.mockRestore()
  })
})
