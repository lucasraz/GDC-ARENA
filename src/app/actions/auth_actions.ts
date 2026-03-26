'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, message: 'Falha no login: ' + error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/profile')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.APP_URL}/auth/callback`,
    },
  })

  if (error) {
    return { success: false, message: 'Falha no cadastro: ' + error.message }
  }

  return { success: true, message: 'Verifique seu e-mail para confirmar o cadastro!' }
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
