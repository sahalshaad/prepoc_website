'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { Plus, Building2, Trash2, Edit2, Check, X, Eye, EyeOff } from 'lucide-react'
import { DepartmentCMS } from '@/types/admin'

type EnhancedDepartment = DepartmentCMS & { teamCount?: number; vacancyCount?: number }

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<EnhancedDepartment[]>([])
  const [loading, setLoading] = useState(true)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  
  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadDeps()
  }, [])

  async function loadDeps() {
    try {
      const res = await fetch('/api/admin/departments', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setDepartments(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDepartments([...departments, { ...data.data, teamCount: 0, vacancyCount: 0 }])
      setNewName('')
      setAddingNew(false)
    } catch (err) {
      alert('Failed to add: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName.trim() })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDepartments(departments.map(d => d.id === id ? { ...d, name: editName.trim() } : d))
      setEditingId(null)
    } catch (err) {
      alert('Failed to update: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStatus = async (dep: EnhancedDepartment) => {
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: dep.id, isActive: !dep.isActive })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDepartments(departments.map(d => d.id === dep.id ? { ...d, isActive: !dep.isActive } : d))
    } catch (err) {
      alert('Failed to toggle status: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    try {
      const res = await fetch(`/api/admin/departments?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      loadDeps()
    } catch (err) {
      alert('Failed to delete: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  const moveRow = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === departments.length - 1) return

    const newDeps = [...departments]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newDeps[index]
    newDeps[index] = newDeps[swapIndex]
    newDeps[swapIndex] = temp

    // Reassign displayOrder
    const updated = newDeps.map((d, i) => ({ ...d, displayOrder: i + 1 }))
    setDepartments(updated)

    try {
      await fetch('/api/admin/departments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', departments: updated.map(d => ({ id: d.id, displayOrder: d.displayOrder })) })
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return null

  return (
    <div className="p-6 max-w-[900px]">
      <PageHeader
        title="Departments"
        description="Manage the centralized list of departments for Team and Careers."
        action={
          <button onClick={() => setAddingNew(true)} disabled={addingNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90 disabled:opacity-50"
            style={{ background: '#D4AF37', color: '#050505', fontFamily: 'var(--font-sora)' }}>
            <Plus size={14} /> Add Department
          </button>
        }
      />

      <div className="rounded-xl overflow-hidden mt-6" style={{ border: '1px solid #18181b' }}>
        <div className="grid px-4 py-3 text-xs font-medium"
          style={{ color: '#52525b', background: '#0f0f12', borderBottom: '1px solid #18181b', gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 120px', gap: '12px' }}>
          <span />
          <span>Department</span>
          <span>Team Members</span>
          <span>Vacancies</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {addingNew && (
          <div className="grid items-center px-4 py-4" style={{ gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 120px', gap: '12px', background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid #18181b' }}>
            <div />
            <div>
              <input autoFocus type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New Department Name"
                className="w-full px-3 py-1.5 rounded-md text-sm outline-none" style={{ background: '#18181b', border: '1px solid #27272a', color: '#F8F8F8' }} />
            </div>
            <div className="text-xs text-zinc-500">0</div>
            <div className="text-xs text-zinc-500">0</div>
            <div className="text-xs text-emerald-500">Active</div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={handleAdd} disabled={saving} className="p-1.5 rounded-md hover:bg-emerald-500/10 text-emerald-500 transition-colors"><Check size={16} /></button>
              <button onClick={() => setAddingNew(false)} disabled={saving} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"><X size={16} /></button>
            </div>
          </div>
        )}

        {departments.map((dep, i) => (
          <div key={dep.id} className="grid items-center px-4 py-4 transition-colors duration-150 group"
            style={{
              gridTemplateColumns: '40px 2fr 1fr 1fr 1fr 120px', gap: '12px',
              background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
              borderBottom: i < departments.length - 1 ? '1px solid #18181b' : 'none',
            }}>
            
            <div className="flex flex-col items-center gap-1 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => moveRow(i, 'up')} disabled={i === 0} className="hover:text-zinc-300 disabled:opacity-30 leading-none">▲</button>
              <button onClick={() => moveRow(i, 'down')} disabled={i === departments.length - 1} className="hover:text-zinc-300 disabled:opacity-30 leading-none">▼</button>
            </div>

            <div>
              {editingId === dep.id ? (
                <input autoFocus type="text" value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md text-sm outline-none" style={{ background: '#18181b', border: '1px solid #27272a', color: '#F8F8F8' }} />
              ) : (
                <div className="flex items-center gap-2">
                  <Building2 size={14} style={{ color: '#D4AF37' }} />
                  <span className="text-sm font-medium" style={{ color: '#F8F8F8' }}>{dep.name}</span>
                </div>
              )}
            </div>

            <div className="text-sm" style={{ color: '#a1a1aa' }}>{dep.teamCount || 0}</div>
            <div className="text-sm" style={{ color: '#a1a1aa' }}>{dep.vacancyCount || 0}</div>

            <div>
              <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold tracking-wider"
                style={{ background: dep.isActive ? 'rgba(34,197,94,0.1)' : 'rgba(113,113,122,0.1)', color: dep.isActive ? '#4ade80' : '#71717a' }}>
                {dep.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-1">
              {editingId === dep.id ? (
                <>
                  <button onClick={() => handleSaveEdit(dep.id)} disabled={saving} className="p-1.5 rounded-md hover:bg-emerald-500/10 text-emerald-500 transition-colors"><Check size={14} /></button>
                  <button onClick={() => setEditingId(null)} disabled={saving} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => handleToggleStatus(dep)} title={dep.isActive ? 'Deactivate' : 'Activate'} className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors" style={{ color: dep.isActive ? '#4ade80' : '#71717a' }}>
                    {dep.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => { setEditingId(dep.id); setEditName(dep.name) }} className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-[#D4AF37] transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(dep.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          </div>
        ))}

        {departments.length === 0 && !addingNew && (
          <div className="px-4 py-8 text-center text-sm" style={{ color: '#71717a' }}>
            No departments found.
          </div>
        )}
      </div>
    </div>
  )
}
