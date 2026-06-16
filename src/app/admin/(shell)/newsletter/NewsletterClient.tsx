'use client'

import { useState, useEffect } from 'react'
import { createCampaignAction, sendCampaignAction } from '../../actions/newsletterActions'
import { Search, Download, Loader2, Send, Plus, CheckCircle, Clock } from 'lucide-react'

export default function NewsletterClient({ initialSubscribers, initialCampaigns }: { initialSubscribers: any[], initialCampaigns: any[] }) {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'campaigns'>('subscribers')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed'>('all')

  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [isCreating, setIsCreating] = useState(false)
  const [isSending, setIsSending] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const filteredSubscribers = initialSubscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Email,Status,Source,SubscribedAt\\n" 
      + filteredSubscribers.map(e => `${e.email},${e.status},${e.source},${new Date(e.subscribedAt).toISOString()}`).join("\\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "subscribers.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCreateDraft = async () => {
    setError(null)
    if (!subject || !content) {
      setError("Subject and Content are required")
      return
    }
    setIsCreating(true)
    const res = await createCampaignAction(subject, content)
    if (res.success && res.campaign) {
      setCampaigns([res.campaign, ...campaigns])
      setSubject('')
      setContent('')
    } else {
      setError(res.error)
    }
    setIsCreating(false)
  }

  const handleSendCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to send this campaign to all active subscribers?")) return
    setIsSending(id)
    const res = await sendCampaignAction(id)
    if (res.success) {
      setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: 'completed' } : c))
      alert("Campaign Sent Successfully!")
    } else {
      alert("Failed to send: " + res.error)
    }
    setIsSending(null)
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
      <div className="flex border-b" style={{ borderColor: '#18181b' }}>
        <button
          className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'subscribers' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[rgba(255,255,255,0.02)]' : 'text-[#71717a] hover:text-[#F8F8F8] hover:bg-[rgba(255,255,255,0.02)]'}`}
          onClick={() => setActiveTab('subscribers')}
        >
          Subscribers
        </button>
        <button
          className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'campaigns' ? 'text-[#D4AF37] border-b-2 border-[#D4AF37] bg-[rgba(255,255,255,0.02)]' : 'text-[#71717a] hover:text-[#F8F8F8] hover:bg-[rgba(255,255,255,0.02)]'}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'subscribers' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 w-full gap-4 items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all bg-[rgba(255,255,255,0.02)] text-[#F8F8F8] placeholder-[#71717a]"
                    style={{ border: '1px solid #18181b' }}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 rounded-lg text-sm focus:outline-none bg-[rgba(255,255,255,0.02)] text-[#F8F8F8]"
                  style={{ border: '1px solid #18181b' }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] text-[#F8F8F8] text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                style={{ border: '1px solid #18181b' }}
              >
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            <div className="rounded-xl overflow-hidden overflow-x-auto" style={{ border: '1px solid #18181b' }}>
              <div className="min-w-[800px]">
                <div className="grid px-4 py-3 text-xs font-medium"
                  style={{ color: '#52525b', background: '#0f0f12', borderBottom: '1px solid #18181b', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }}>
                  <span>Email</span>
                  <span>Status</span>
                  <span>Source</span>
                  <span>Subscribed At</span>
                </div>
                
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((sub, i) => (
                    <div key={sub.id} className="grid items-center px-4 py-4 transition-all duration-150"
                      style={{
                        gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        gap: '12px',
                        background: i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)',
                        borderBottom: i < filteredSubscribers.length - 1 ? '1px solid #18181b' : 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.02)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#0f0f12' : 'rgba(255,255,255,0.01)')}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#F8F8F8' }}>{sub.email}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: sub.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: sub.status === 'active' ? '#4ade80' : '#f87171' }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: sub.status === 'active' ? '#22c55e' : '#ef4444' }} />
                          {sub.status === 'active' ? 'Active' : 'Unsubscribed'}
                        </span>
                      </div>
                      <div className="text-xs capitalize" style={{ color: '#71717a' }}>{sub.source}</div>
                      <div className="text-xs" style={{ color: '#71717a' }}>{isMounted ? new Date(sub.subscribedAt).toLocaleDateString() : ''}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm" style={{ color: '#71717a' }}>
                    No subscribers found.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="p-6 rounded-xl space-y-4" style={{ background: '#0f0f12', border: '1px solid #18181b' }}>
              <h2 className="text-lg font-semibold flex items-center gap-2 text-[#F8F8F8]"><Plus className="w-5 h-5"/> Create New Campaign</h2>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Campaign Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all bg-[rgba(255,255,255,0.02)] text-[#F8F8F8] placeholder-[#71717a]"
                  style={{ border: '1px solid #18181b' }}
                />
                <textarea
                  placeholder="HTML Content"
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all bg-[rgba(255,255,255,0.02)] text-[#F8F8F8] placeholder-[#71717a] font-mono"
                  style={{ border: '1px solid #18181b' }}
                ></textarea>
                <button
                  onClick={handleCreateDraft}
                  disabled={isCreating}
                  className="text-black px-4 py-2 rounded-lg text-sm font-medium flex justify-center items-center gap-2 transition-colors disabled:opacity-50 w-full sm:w-auto self-start"
                  style={{ background: '#D4AF37' }}
                >
                  {isCreating ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : 'Save Draft'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F8F8F8]">Recent Campaigns</h2>
              <div className="grid gap-4">
                {campaigns.length > 0 ? (
                  campaigns.map(camp => (
                    <div key={camp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors" style={{ border: '1px solid #18181b', background: '#0f0f12' }}>
                      <div>
                        <h4 className="font-semibold text-[#F8F8F8]">{camp.subject}</h4>
                        <div className="flex items-center gap-3 text-xs text-[#71717a] mt-1">
                          <span className={`inline-flex items-center gap-1 ${camp.status === 'completed' ? 'text-[#60a5fa]' : 'text-[#f59e0b]'}`}>
                            {camp.status === 'completed' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                            {camp.status}
                          </span>
                          <span>•</span>
                          <span>{isMounted ? new Date(camp.createdAt).toLocaleDateString() : ''}</span>
                          {camp.status === 'completed' && (
                            <>
                              <span>•</span>
                              <span>{camp.sentCount} / {camp.recipientCount} Sent</span>
                            </>
                          )}
                        </div>
                      </div>
                      {camp.status === 'draft' && (
                        <button
                          onClick={() => handleSendCampaign(camp.id)}
                          disabled={isSending === camp.id}
                          className="flex items-center gap-2 text-black px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors w-full sm:w-auto justify-center"
                          style={{ background: '#D4AF37' }}
                        >
                          {isSending === camp.id ? <><Loader2 className="w-4 h-4 animate-spin"/> Sending...</> : <><Send className="w-4 h-4"/> Send Now</>}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#71717a] text-center py-8 rounded-xl border-dashed" style={{ border: '1px dashed #18181b' }}>No campaigns created yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
