import { getSession } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (session) {
    redirect('/admin/dashboard')
  }

  return <>{children}</>
}
