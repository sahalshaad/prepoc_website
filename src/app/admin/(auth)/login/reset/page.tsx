'use client'

import { useState, useTransition, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPasswordAction } from '@/lib/admin/auth'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  if (!token) {
    return (
      <div className="text-center">
        <div
          className="text-xs p-3 rounded-lg border flex items-start gap-2 mb-6 text-left"
          style={{
            background: 'rgba(239,68,68,0.1)',
            borderColor: 'rgba(239,68,68,0.2)',
            color: '#fca5a5',
            fontFamily: 'var(--font-inter)',
          }}
        >
          <div className="mt-0.5">⚠️</div>
          <div>Invalid or missing reset token.</div>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs transition-colors duration-200 hover:text-white"
          style={{ color: '#a1a1aa', fontFamily: 'var(--font-inter)' }}
        >
          Return to login
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const result = await resetPasswordAction(token, password)
      if (result.success) {
        setSuccess('Password has been successfully reset. Redirecting to login...')
        setTimeout(() => {
          router.push('/admin/login')
        }, 2000)
      } else {
        setError(result.error || 'Failed to reset password.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#a1a1aa' }}
        >
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isPending || !!success}
          className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 disabled:opacity-50"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F8F8F8',
            fontFamily: 'var(--font-inter)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(212,175,55,0.5)'
            e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)'
            e.target.style.boxShadow = 'none'
          }}
        />
        <p className="text-[10px] mt-1.5 opacity-60" style={{ fontFamily: 'var(--font-inter)', color: '#a1a1aa' }}>
          Must be at least 12 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.
        </p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#a1a1aa' }}
        >
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          disabled={isPending || !!success}
          className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-all duration-200 disabled:opacity-50"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#F8F8F8',
            fontFamily: 'var(--font-inter)',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(212,175,55,0.5)'
            e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.08)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      {/* Error message */}
      {error && (
        <div
          className="text-xs p-3 rounded-lg border flex items-start gap-2"
          style={{
            background: 'rgba(239,68,68,0.1)',
            borderColor: 'rgba(239,68,68,0.2)',
            color: '#fca5a5',
            fontFamily: 'var(--font-inter)',
          }}
        >
          <div className="mt-0.5">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div
          className="text-xs p-3 rounded-lg border flex items-start gap-2"
          style={{
            background: 'rgba(16,185,129,0.1)',
            borderColor: 'rgba(16,185,129,0.2)',
            color: '#6ee7b7',
            fontFamily: 'var(--font-inter)',
          }}
        >
          <div className="mt-0.5">✅</div>
          <div>{success}</div>
        </div>
      )}

      {!success && (
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 hover:opacity-90"
          style={{
            background:
              'linear-gradient(135deg, #D4AF37 0%, #f0d460 50%, #D4AF37 100%)',
            color: '#050505',
            fontFamily: 'var(--font-sora)',
            boxShadow: '0 4px 20px rgba(212,175,55,0.25)',
          }}
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-[#050505] border-t-transparent rounded-full animate-spin" />
          ) : (
            'Reset Password'
          )}
        </button>
      )}
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,93,71,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,93,71,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="w-full max-w-[400px] relative z-10 px-6 py-10 md:px-0">
        <div
          className="rounded-2xl p-8 relative overflow-hidden backdrop-blur-xl"
          style={{
            background: 'rgba(10,10,10,0.6)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold mb-2 tracking-tight"
              style={{
                color: '#F8F8F8',
                fontFamily: 'var(--font-sora)',
              }}
            >
              Set New Password
            </h1>
            <p
              className="text-sm"
              style={{ color: '#a1a1aa', fontFamily: 'var(--font-inter)' }}
            >
              Please enter your new password below.
            </p>
          </div>

          <Suspense fallback={<div className="text-center text-[#a1a1aa] text-sm py-4">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
