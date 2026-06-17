'use client'

import { useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  GripVertical,
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  createFaqAction,
  updateFaqAction,
  deleteFaqAction,
  reorderFaqAction,
} from '../../actions/faqActions'

interface FaqItem {
  id: string
  question: string
  answer: string
  order: number
  isActive: boolean
}

interface FaqClientProps {
  initialFaqs: FaqItem[]
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all bg-[rgba(255,255,255,0.02)] text-[#F8F8F8] placeholder-[#52525b]'
const inputStyle = { border: '1px solid #27272a' }

export default function FaqClient({ initialFaqs }: FaqClientProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>(
    [...initialFaqs].sort((a, b) => a.order - b.order)
  )
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // New FAQ form state
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  // Edit state
  const [editQ, setEditQ] = useState('')
  const [editA, setEditA] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    setAddError(null)
    if (!newQ.trim() || !newA.trim()) {
      setAddError('Both question and answer are required.')
      return
    }
    setAddLoading(true)
    const nextOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order)) + 1 : 0
    const res = await createFaqAction({ question: newQ, answer: newA, order: nextOrder })
    if (res.success && res.faq) {
      setFaqs([...faqs, res.faq as FaqItem])
      setNewQ('')
      setNewA('')
      setShowAddForm(false)
    } else {
      setAddError(res.error || 'Failed to create.')
    }
    setAddLoading(false)
  }

  // ── Edit ─────────────────────────────────────────────────────────────────
  const startEdit = (faq: FaqItem) => {
    setEditingId(faq.id)
    setEditQ(faq.question)
    setEditA(faq.answer)
    setEditError(null)
  }

  const handleEdit = async (id: string) => {
    setEditError(null)
    if (!editQ.trim() || !editA.trim()) {
      setEditError('Both fields are required.')
      return
    }
    setEditLoading(true)
    const res = await updateFaqAction(id, { question: editQ, answer: editA })
    if (res.success && res.faq) {
      setFaqs(faqs.map((f) => (f.id === id ? { ...f, question: editQ, answer: editA } : f)))
      setEditingId(null)
    } else {
      setEditError(res.error || 'Failed to update.')
    }
    setEditLoading(false)
  }

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ? This cannot be undone.')) return
    setDeletingId(id)
    const res = await deleteFaqAction(id)
    if (res.success) {
      setFaqs(faqs.filter((f) => f.id !== id))
    }
    setDeletingId(null)
  }

  // ── Toggle active ────────────────────────────────────────────────────────
  const handleToggle = async (faq: FaqItem) => {
    setTogglingId(faq.id)
    const res = await updateFaqAction(faq.id, { isActive: !faq.isActive })
    if (res.success) {
      setFaqs(faqs.map((f) => (f.id === faq.id ? { ...f, isActive: !f.isActive } : f)))
    }
    setTogglingId(null)
  }

  // ── Reorder ──────────────────────────────────────────────────────────────
  const move = async (index: number, dir: 'up' | 'down') => {
    const next = [...faqs]
    const swapIdx = dir === 'up' ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    const reordered = next.map((f, i) => ({ ...f, order: i }))
    setFaqs(reordered)
    await reorderFaqAction(reordered.map(({ id, order }) => ({ id, order })))
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm)
            setAddError(null)
            setNewQ('')
            setNewA('')
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: '#D4AF37', color: '#050505' }}
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div
          className="rounded-xl p-5 space-y-4"
          style={{ background: '#0f0f12', border: '1px solid #27272a' }}
        >
          <h3 className="text-sm font-semibold" style={{ color: '#F8F8F8' }}>
            New FAQ Item
          </h3>
          {addError && <p className="text-xs text-red-400">{addError}</p>}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Question"
              value={newQ}
              onChange={(e) => setNewQ(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
            <textarea
              placeholder="Answer"
              rows={4}
              value={newA}
              onChange={(e) => setNewA(e.target.value)}
              className={inputClass + ' resize-none'}
              style={inputStyle}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={addLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
              style={{ background: '#D4AF37', color: '#050505' }}
            >
              {addLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#a1a1aa', border: '1px solid #27272a' }}
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl text-sm"
          style={{ border: '1px dashed #27272a', color: '#52525b' }}
        >
          No FAQ items yet. Click &quot;Add FAQ&quot; to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="rounded-xl overflow-hidden transition-all duration-200"
              style={{
                background: '#0f0f12',
                border: `1px solid ${editingId === faq.id ? '#D4AF37' : '#18181b'}`,
                opacity: faq.isActive ? 1 : 0.55,
              }}
            >
              {editingId === faq.id ? (
                /* ─── Edit mode ─── */
                <div className="p-5 space-y-3">
                  {editError && <p className="text-xs text-red-400">{editError}</p>}
                  <input
                    type="text"
                    value={editQ}
                    onChange={(e) => setEditQ(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <textarea
                    rows={4}
                    value={editA}
                    onChange={(e) => setEditA(e.target.value)}
                    className={inputClass + ' resize-none'}
                    style={inputStyle}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(faq.id)}
                      disabled={editLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                      style={{ background: '#D4AF37', color: '#050505' }}
                    >
                      {editLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#a1a1aa', border: '1px solid #27272a' }}
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── View mode ─── */
                <div className="flex items-start gap-3 p-4">
                  {/* Drag handle / order controls */}
                  <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                    <GripVertical size={14} style={{ color: '#3f3f46' }} />
                    <button
                      onClick={() => move(index, 'up')}
                      disabled={index === 0}
                      className="p-0.5 rounded transition-colors disabled:opacity-20"
                      style={{ color: '#52525b' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => move(index, 'down')}
                      disabled={index === faqs.length - 1}
                      className="p-0.5 rounded transition-colors disabled:opacity-20"
                      style={{ color: '#52525b' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1 truncate" style={{ color: '#F8F8F8' }}>
                      {faq.question}
                    </p>
                    <p
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ color: '#71717a' }}
                    >
                      {faq.answer}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggle(faq)}
                      disabled={togglingId === faq.id}
                      title={faq.isActive ? 'Hide from site' : 'Show on site'}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: faq.isActive ? '#4ade80' : '#52525b' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')
                      }
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {togglingId === faq.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : faq.isActive ? (
                        <Eye size={14} />
                      ) : (
                        <EyeOff size={14} />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => startEdit(faq)}
                      title="Edit"
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#71717a' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#D4AF37'
                        e.currentTarget.style.background = 'rgba(212,175,55,0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717a'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Pencil size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(faq.id)}
                      disabled={deletingId === faq.id}
                      title="Delete"
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#71717a' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f87171'
                        e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#71717a'
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {deletingId === faq.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
