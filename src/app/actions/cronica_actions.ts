'use server'

import { CronicaService } from '@backend/services/cronica_service'
import { revalidatePath } from 'next/cache'
import { Cronica, Comment } from '@execution/repositories/cronica_repository'

export async function saveCronica(authorId: string, tenantId: string, data: Partial<Cronica>) {
  try {
    await CronicaService.saveCronica(authorId, tenantId, data)
    revalidatePath('/')
    revalidatePath('/my-cronicas')
    return { success: true }
  } catch (error: any) {
    console.error('Action Error (Cronica):', error.message)
    return { success: false, message: error.message }
  }
}

export async function deleteCronica(id: string, authorId: string) {
  try {
    await CronicaService.deleteCronica(id, authorId)
    revalidatePath('/')
    revalidatePath('/my-cronicas')
    return { success: true }
  } catch (error: any) {
    console.error('Action Error (Delete Cronica):', error.message)
    return { success: false, message: error.message }
  }
}

// --- COMMENTS ---
export async function addComment(authorId: string, cronicaId: string, text: string) {
  try {
    await CronicaService.addComment(authorId, cronicaId, text)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Action Error (Add Comment):', error.message)
    return { success: false, message: error.message }
  }
}

export async function deleteComment(id: string, authorId: string) {
  try {
    await CronicaService.deleteComment(id, authorId)
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Action Error (Delete Comment):', error.message)
    return { success: false, message: error.message }
  }
}
