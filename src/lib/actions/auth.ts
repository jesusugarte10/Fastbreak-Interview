'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { safeAction } from './safe-action'

export async function signUpAction(formData: FormData) {
  return safeAction(async () => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) throw error
  })
}

export async function signInAction(formData: FormData) {
  return safeAction(async () => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  })
}

export async function signOutAction() {
  return safeAction(async () => {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    revalidatePath('/', 'layout')
    redirect('/login')
  })
}

export async function signInWithGoogleAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  if (data.url) {
    return { ok: true, url: data.url }
  }

  return { ok: false, error: 'No redirect URL received from OAuth provider' }
}

