'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { Resend } from 'resend'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

export interface LoginResult {
  success: boolean
  error?: string
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || '127.0.0.1'

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
  const recentAttempts = await prisma.loginAttempt.count({
    where: {
      email,
      ipAddress,
      attemptAt: { gt: fifteenMinutesAgo }
    }
  })

  if (recentAttempts >= 5) {
    return { success: false, error: 'Too many failed login attempts. Please try again in 15 minutes.' }
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!admin) {
    await prisma.loginAttempt.create({ data: { email, ipAddress } })
    return { success: false, error: 'Invalid email or password.' }
  }

  const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
  
  if (!isValidPassword) {
    await prisma.loginAttempt.create({ data: { email, ipAddress } })
    return { success: false, error: 'Invalid email or password.' }
  }

  await prisma.loginAttempt.deleteMany({
    where: { email, ipAddress }
  })

  // Generate secure session token
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  // Create 8-hour session
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 8)

  await prisma.session.create({
    data: {
      tokenHash,
      adminId: admin.id,
      expiresAt,
    },
  })

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() }
  })

  const cookieStore = await cookies()
  cookieStore.set('prepoc-admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })

  return { success: true }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get('prepoc-admin-session')?.value

  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    try {
      await prisma.session.delete({
        where: { tokenHash },
      })
    } catch (e) {
      // Ignore if already deleted or invalid
    }
  }

  cookieStore.delete('prepoc-admin-session')
  redirect('/admin/login')
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('prepoc-admin-session')?.value

  if (!token) return null

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { admin: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return {
    user: {
      id: session.admin.id,
      name: 'Admin', // Can be expanded later if a name field is added
      email: session.admin.email,
      role: session.admin.role,
      requiresPasswordChange: session.admin.requiresPasswordChange,
      createdAt: session.admin.createdAt.toISOString(),
      lastLogin: session.admin.lastLogin?.toISOString() || session.admin.createdAt.toISOString(),
      isActive: true,
    },
  }
}

export async function changePasswordAction(currentPassword: string, newPassword: string): Promise<LoginResult> {
  const session = await getSession()
  if (!session) return { success: false, error: 'Unauthorized' }

  const admin = await prisma.adminUser.findUnique({ where: { id: session.user.id } })
  if (!admin) return { success: false, error: 'User not found' }

  const isValid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!isValid) return { success: false, error: 'Invalid current password' }

  // Validate strong password
  const minLength = newPassword.length >= 12
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasLower = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
    return { success: false, error: 'New password does not meet security requirements.' }
  }

  const newHash = await bcrypt.hash(newPassword, 12)

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: {
      passwordHash: newHash,
      requiresPasswordChange: false
    }
  })

  return { success: true }
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session.user
}

export async function requestPasswordResetAction(rawEmail: string): Promise<LoginResult> {
  const email = rawEmail.trim().toLowerCase()
  console.log("[FORGOT_PASSWORD] STEP 1 - Request received for:", email)

  // Verify Environment Variables
  const resendKeyConfigured = !!process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  console.log("[FORGOT_PASSWORD] Env validation:", { resendKeyConfigured, fromEmail, siteUrl })
  
  if (!resendKeyConfigured) {
    console.error("[FORGOT_PASSWORD] FATAL: RESEND_API_KEY is not configured!")
  }

  const headersList = await headers()
  const ipAddress = headersList.get('cf-connecting-ip') || headersList.get('x-forwarded-for') || '127.0.0.1'
  const userAgent = headersList.get('user-agent') || 'Unknown'

  // Clean up expired tokens & old attempts
  await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  })
  const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  await prisma.resetAttempt.deleteMany({
    where: { attemptAt: { lt: thirtyDaysAgo } }
  })

  // Rate Limiting
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)
  const recentAttempts = await prisma.resetAttempt.count({
    where: { ipAddress, attemptAt: { gt: oneHourAgo } }
  })

  if (recentAttempts >= 5) {
    return { success: false, error: 'Too many requests. Please try again later.' }
  }

  await prisma.resetAttempt.create({ data: { ipAddress } })

  const admin = await prisma.adminUser.findUnique({ where: { email } })
  console.log("[FORGOT_PASSWORD] STEP 3 - Admin lookup result:", !!admin)
  const successMessage = 'If an account exists for that email address, a password reset link has been sent.'

  // Audit Logging
  await prisma.adminAuditLog.create({
    data: {
      adminUserId: admin?.id || null,
      action: 'PASSWORD_RESET_REQUESTED',
      ipAddress,
      userAgent,
      metadata: { email, source: 'forgot_password' }
    }
  })

  if (!admin) {
    // Return same message to prevent email enumeration
    return { success: true, error: successMessage }
  }

  // Clear existing tokens
  await prisma.passwordResetToken.deleteMany({
    where: { adminUserId: admin.id }
  })

  // Generate new token
  console.log("[FORGOT_PASSWORD] STEP 4 - Token generated")
  const token = crypto.randomBytes(32).toString('base64url')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  await prisma.passwordResetToken.create({
    data: {
      adminUserId: admin.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    }
  })

  const siteUrlFinal = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const resetLink = `${siteUrlFinal}/admin/login/reset?token=${token}`
  console.log("[FORGOT_PASSWORD] Reset URL generated:", resetLink)

  const finalFromEmail = process.env.RESEND_FROM_EMAIL || (process.env.NODE_ENV === 'production' ? 'noreply@prepoc.in' : 'onboarding@resend.dev')

  console.log("[FORGOT_PASSWORD] STEP 5 - Sending email from:", finalFromEmail)
  const resend = getResend()
  const { data, error } = await resend.emails.send({
    from: finalFromEmail,
    to: admin.email,
    subject: 'Password Reset Request - PREPOC',
    html: `
      <p>You requested a password reset for your PREPOC admin account.</p>
      <p>Click the link below to securely reset your password. This link expires in 1 hour.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `
  })

  console.log("[FORGOT_PASSWORD] STEP 6 - Email response received")

  if (error) {
    console.error('[RESEND_ERROR]', error)
    // We log the error but still return success to the client to avoid email enumeration
  } else {
    console.log('[RESEND_SUCCESS]', data)
  }

  return { success: true, error: successMessage }
}

export async function resetPasswordAction(token: string, newPassword: string): Promise<LoginResult> {
  const headersList = await headers()
  const ipAddress = headersList.get('cf-connecting-ip') || headersList.get('x-forwarded-for') || '127.0.0.1'
  const userAgent = headersList.get('user-agent') || 'Unknown'

  // Clean up expired tokens
  await prisma.passwordResetToken.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  })

  // Validate strong password
  const minLength = newPassword.length >= 12
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasLower = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

  if (!(minLength && hasUpper && hasLower && hasNumber && hasSpecial)) {
    return { success: false, error: 'New password does not meet security requirements. (Min 12 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)' }
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { adminUser: true }
  })

  if (!resetToken) {
    return { success: false, error: 'Invalid or expired reset link' }
  }

  const newHash = await bcrypt.hash(newPassword, 12)

  await prisma.adminUser.update({
    where: { id: resetToken.adminUserId },
    data: {
      passwordHash: newHash,
      passwordChangedAt: new Date(),
      requiresPasswordChange: false
    }
  })

  // Revoke all sessions
  await prisma.session.deleteMany({
    where: { adminId: resetToken.adminUserId }
  })
  
  const cookieStore = await cookies()
  cookieStore.delete('prepoc-admin-session')

  // Delete used token
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id }
  })

  // Audit Logging
  await prisma.adminAuditLog.create({
    data: {
      adminUserId: resetToken.adminUserId,
      action: 'PASSWORD_RESET_COMPLETED',
      ipAddress,
      userAgent,
      metadata: { reason: 'password_reset' }
    }
  })

  return { success: true }
}
