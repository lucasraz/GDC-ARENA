'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveEvent(authorId: string, tenantId: string, data: any) {
  const supabase = createClient()
  
  const eventData = {
    ...data,
    author_id: authorId,
    tenant_id: tenantId,
    updated_at: new Date().toISOString()
  }

  const { data: result, error } = await supabase
    .from('events')
    .upsert(eventData)
    .select()
    .single()

  if (error) {
    console.error('Error saving event:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/eventos')
  return { success: true, data: result }
}

export async function deleteEvent(id: string, authorId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('events')
    .delete()
    .match({ id, author_id: authorId })

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/eventos')
  return { success: true }
}

export async function joinEvent(eventId: string, userId: string, beer: string = 'nenhuma', guestName?: string) {
  const supabase = createClient()
  if (!userId) return { success: false, error: 'Usuário não identificado.' }

  if (!guestName) {
    // Check if user already joined as self
    const { data: existing } = await supabase
      .from('event_attendees')
      .select('id')
      .match({ event_id: eventId, user_id: userId })
      .is('guest_name', null)
      .maybeSingle()

    if (existing) return { success: false, error: 'Você já está confirmado neste evento.' }
  }

  const data: any = { event_id: eventId, user_id: userId, selected_beer: beer }
  if (guestName) data.guest_name = guestName

  const { error } = await supabase
    .from('event_attendees')
    .insert(data)

  if (error) {
    console.error('Error joining event:', error)
    return { success: false, error: `Erro ao confirmar: ${error.message}` }
  }

  revalidatePath('/eventos')
  return { success: true }
}


export async function leaveEvent(attendanceId: string, userId: string) {
  const supabase = createClient()
  if (!userId) return { success: false, error: 'Usuário não identificado.' }

  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .match({ id: attendanceId, user_id: userId }) 

  if (error) {
    console.error('Error leaving event:', error)
    return { success: false, error: `Erro ao remover: ${error.message}` }
  }

  revalidatePath('/eventos')
  return { success: true }
}

export async function togglePaymentStatus(eventId: string, userId: string, isPaid: boolean, organizerId: string) {
  const supabase = createClient()
  if (!organizerId) return { success: false, error: 'Usuário não identificado.' }

  // Check if caller is the event author (organizer)
  const { data: event } = await supabase.from('events').select('author_id').match({ id: eventId }).single()
  if (event?.author_id !== organizerId) return { success: false, error: 'Apenas o organizador pode dar quitação.' }

  const { error } = await supabase
    .from('event_attendees')
    .update({ is_paid: isPaid })
    .match({ event_id: eventId, user_id: userId })

  if (error) {
    console.error('Error updating payment:', error)
    return { success: false, error: `Erro ao atualizar: ${error.message}` }
  }

  revalidatePath('/eventos')
  return { success: true }
}

export async function addEventComment(userId: string, eventId: string, text: string) {
  const supabase = createClient()
  if (!userId) return { success: false, error: 'Usuário não identificado.' }

  const { data, error } = await supabase
    .from('event_comments')
    .insert({
      event_id: eventId,
      author_id: userId,
      text: text
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding event comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/eventos')
  return { success: true, data }
}

export async function deleteEventComment(commentId: string, userId: string) {
  const supabase = createClient()
  if (!userId) return { success: false, error: 'Usuário não identificado.' }

  const { error } = await supabase
    .from('event_comments')
    .delete()
    .match({ id: commentId, author_id: userId })

  if (error) {
    console.error('Error deleting event comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/eventos')
  return { success: true }
}

