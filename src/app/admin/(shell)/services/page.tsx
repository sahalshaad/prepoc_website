'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/ui/PageHeader'
import { MediaUploader } from '@/components/admin/ui/MediaUploader'
import { GripVertical, Pencil, ToggleLeft, ToggleRight, Save, Plus, Trash2, X } from 'lucide-react'
import { ServiceCMS } from '@/types/admin'

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceCMS[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ServiceCMS> | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services')
      const json = await res.json()
      if (json.success) {
        setServices(json.data.sort((a: ServiceCMS, b: ServiceCMS) => (a.displayOrder || 0) - (b.displayOrder || 0)))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    setServices(updated)
    await saveBulk(updated)
  }

  const saveBulk = async (data: ServiceCMS[]) => {
    setSaving(true)
    try {
      await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: data })
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setServices(services.filter(s => s.id !== id))
        if (editingId === id) {
          setEditingId(null)
          setFormData(null)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (service: ServiceCMS) => {
    setEditingId(service.id)
    setFormData({ ...service })
  }

  const startNew = () => {
    const newService: Partial<ServiceCMS> = {
      title: '',
      desc: '',
      list: [{ text: '' }],
      buttons: [{ label: 'Learn More', href: '#', primary: true }],
      image: '',
      isActive: true,
      displayOrder: services.length + 1
    }
    setEditingId('new')
    setFormData(newService)
  }

  const saveEdit = async () => {
    if (!formData) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: formData })
      })
      if (res.ok) {
        await fetchServices()
        setEditingId(null)
        setFormData(null)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('index', index.toString())
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('index'))
    if (dragIndex === dropIndex) return

    const newServices = [...services]
    const [draggedItem] = newServices.splice(dragIndex, 1)
    newServices.splice(dropIndex, 0, draggedItem)

    // Update display orders
    const updated = newServices.map((s, i) => ({ ...s, displayOrder: i + 1 }))
    setServices(updated)
    await saveBulk(updated)
  }

  if (loading) return <div className="p-6">Loading services...</div>

  return (
    <div className="p-6 max-w-[860px]">
      <PageHeader
        title="Services & Features"
        description={`${services.filter(s => s.isActive).length} of ${services.length} services active`}
        action={
          <div className="flex gap-3">
            <button
              onClick={() => saveBulk(services)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150"
              style={{
                background: saved ? 'rgba(34,197,94,0.15)' : '#D4AF37',
                color: saved ? '#4ade80' : '#050505',
                fontFamily: 'var(--font-sora)',
                border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none',
              }}
            >
              <Save size={14} />
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Order'}
            </button>
            <button
              onClick={startNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black transition-all duration-150 hover:bg-neutral-200"
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              <Plus size={14} />
              Add New
            </button>
          </div>
        }
      />

      {editingId && formData && (
        <div className="mb-8 p-6 rounded-xl border" style={{ background: '#0f0f12', borderColor: '#27272a' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold" style={{ color: '#F8F8F8' }}>
              {editingId === 'new' ? 'New Service' : 'Edit Service'}
            </h2>
            <button onClick={() => { setEditingId(null); setFormData(null); }} style={{ color: '#71717a' }} className="hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#a1a1aa' }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#a1a1aa' }}>Description (HTML supported)</label>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white text-sm h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#a1a1aa' }}>Image</label>
              <MediaUploader
                value={formData.image || ''}
                onChange={(url) => setFormData({...formData, image: url})}
                category="services"
                accept="image"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#a1a1aa' }}>Features List (HTML supported)</label>
              {formData.list?.map((item, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => {
                      const newList = [...(formData.list || [])]
                      newList[idx].text = e.target.value
                      setFormData({ ...formData, list: newList })
                    }}
                    className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      const newList = formData.list?.filter((_, i) => i !== idx)
                      setFormData({ ...formData, list: newList })
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setFormData({ ...formData, list: [...(formData.list || []), { text: '' }] })}
                className="text-sm text-blue-400 hover:text-blue-300 mt-1"
              >
                + Add List Item
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#b08d29]"
              >
                {saving ? 'Saving...' : 'Save Service'}
              </button>
              <button
                onClick={() => { setEditingId(null); setFormData(null); }}
                className="border border-[#27272a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#18181b]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs mb-5" style={{ color: '#52525b' }}>
        Drag to reorder services. Toggle visibility. Click edit to update content.
      </p>

      <div className="space-y-2">
        {services.map((service, i) => (
          <div
            key={service.id}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, i)}
            className="flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-150"
            style={{
              background: '#0f0f12',
              border: '1px solid #18181b',
              opacity: service.isActive ? 1 : 0.5,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#27272a')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#18181b')}
          >
            {/* Drag handle */}
            <div className="cursor-grab hover:text-white" style={{ color: '#3f3f46' }}>
              <GripVertical size={16} />
            </div>

            {/* Order number */}
            <span className="text-xs w-5 text-center" style={{ color: '#3f3f46' }}>
              {i + 1}
            </span>

            {/* Image Preview */}
            <div className="w-12 h-12 rounded-lg bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
              {service.image && <img src={service.image} alt="" className="w-full h-full object-cover" />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#F8F8F8' }}>
                {service.title}
              </p>
              <p className="text-xs truncate max-w-[400px]" style={{ color: '#71717a' }} dangerouslySetInnerHTML={{ __html: service.desc.substring(0, 100) }} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(service.id)}
                className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded hover:bg-white/5 transition-colors duration-150"
                style={{ color: service.isActive ? '#4ade80' : '#52525b' }}
              >
                {service.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              </button>

              <button
                onClick={() => startEdit(service)}
                className="p-1.5 rounded hover:bg-blue-500/10 hover:text-blue-400 transition-colors"
                style={{ color: '#52525b' }}
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={() => handleDelete(service.id)}
                className="p-1.5 rounded hover:bg-red-500/10 hover:text-red-400 transition-colors"
                style={{ color: '#52525b' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && !loading && (
          <div className="text-center py-8 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-xl">
            No services found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  )
}
