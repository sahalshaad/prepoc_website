'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Phase 1: Hardcoded credentials — replace with DB lookup in Phase 4
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@prepoc.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'prepoc@2024'
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || 'prepoc-admin-authenticated'

export interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResult> {
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid email or password.' }
  }

  const cookieStore = await cookies()
  cookieStore.set('prepoc-admin-session', SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return { success: true }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('prepoc-admin-session')
  redirect('/admin/login')
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('prepoc-admin-session')
  if (!session || session.value !== SESSION_TOKEN) return null
  return {
    user: {
      id: '1',
      name: 'Admin',
      email: ADMIN_EMAIL,
      role: 'super_admin' as const,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isActive: true,
    },
  }
}
