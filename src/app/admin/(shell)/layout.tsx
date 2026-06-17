import { AdminSidebar } from '@/components/admin/shell/AdminSidebar'
import { AdminTopbar } from '@/components/admin/shell/AdminTopbar'
import { requireAdmin } from '@/lib/admin/auth'
import { redirect } from 'next/navigation'

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch (e) {
    redirect('/admin/login')
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#09090b', color: '#F8F8F8', fontFamily: 'var(--font-inter)' }}
    >
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: '#09090b' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
