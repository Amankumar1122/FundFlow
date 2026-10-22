import { Check, ExternalLink, MoreVertical, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import FormField from '../../components/common/FormField'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../hooks/useCurrency'

export default function CampaignManagement() {
  const { campaigns, setCampaignStatus, deleteCampaign } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [rejecting, setRejecting] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [isBatchDeleting, setIsBatchDeleting] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const menuRef = useRef(null)

  const shown = useMemo(() => campaigns.filter((item) => (status === 'all' || item.status === status) && `${item.title} ${item.organizer}`.toLowerCase().includes(query.toLowerCase())), [campaigns, query, status])

  const setStatusChoices = [
    { value: 'all', label: 'All statuses' },
    { value: 'pending', label: 'Pending review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'paused', label: 'Paused' },
  ]
  const labels = { pending: 'Pending', approved: 'Live', rejected: 'Rejected', paused: 'Paused' }
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    paused: 'bg-slate-50 text-slate-700 border border-slate-200',
  }

  // Close 3-dot menu on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Checkbox selection handlers
  const allShownSelected = shown.length > 0 && shown.every((c) => selectedIds.includes(c.id))
  const toggleSelectAll = () => {
    if (allShownSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(shown.map((c) => c.id))
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleConfirmSingleDelete = () => {
    if (deleting) {
      deleteCampaign(deleting.id)
      setSelectedIds((prev) => prev.filter((id) => id !== deleting.id))
      setDeleting(null)
    }
  }

  const handleConfirmBatchDelete = () => {
    selectedIds.forEach((id) => deleteCampaign(id))
    setSelectedIds([])
    setIsBatchDeleting(false)
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Moderation Console</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">Campaign management</h1>
          <p className="mt-1 text-xs text-[#667085]">Review submissions, moderate campaign states, or delete initiatives.</p>
        </div>
      </div>

      {/* Search, Filter, and Selection Bar */}
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <label className="relative block">
          <span className="sr-only">Search campaigns</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or organizer"
            className="w-full rounded-lg border border-[#d8e3f0] bg-white py-2 pl-10 pr-3 text-xs text-[#101820] outline-none focus:border-[#245bdb] focus:ring-2 focus:ring-[#245bdb]/15"
          />
        </label>
        <FormField id="filter-status" label="" as="select" value={status} onChange={(event) => setStatus(event.target.value)} options={setStatusChoices} />
      </div>

      {/* Batch Selection Banner */}
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#d8e3f0] bg-white px-4 py-2.5 text-xs">
        <label className="flex cursor-pointer items-center gap-2 font-semibold text-[#101820]">
          <input
            type="checkbox"
            checked={allShownSelected}
            onChange={toggleSelectAll}
            className="h-3.5 w-3.5 rounded border-slate-300 text-[#245bdb] focus:ring-[#245bdb]"
          />
          <span>Select all shown ({shown.length})</span>
        </label>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#245bdb]">{selectedIds.length} campaign{selectedIds.length > 1 ? 's' : ''} selected</span>
            <button
              type="button"
              onClick={() => setIsBatchDeleting(true)}
              className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-200"
            >
              <Trash2 size={12} /> Delete selected
            </button>
          </div>
        )}
      </div>

      {/* Campaign Cards List */}
      <div className="mt-4 space-y-3" ref={menuRef}>
        {shown.map((campaign) => {
          const isSelected = selectedIds.includes(campaign.id)
          const isMenuOpen = openMenuId === campaign.id

          return (
            <article
              key={campaign.id}
              className={`relative rounded-xl border bg-white p-4 transition-colors ${
                isSelected ? 'border-[#245bdb]/50 bg-[#eef3fc]/30' : 'border-[#d8e3f0]'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Selection Checkbox & Thumbnail */}
                <div className="relative shrink-0 sm:w-36">
                  <label className="absolute left-2 top-2 z-10 grid h-5 w-5 place-items-center rounded bg-white/90 shadow-2xs backdrop-blur-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(campaign.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#245bdb] focus:ring-[#245bdb]"
                    />
                  </label>
                  <img
                    src={campaign.image}
                    alt=""
                    className="h-32 w-full rounded-lg object-cover sm:h-24 sm:w-36 border border-[#d8e3f0]"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
                    }}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-bold text-[#101820]">{campaign.title}</h2>
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${styles[campaign.status] || styles.paused}`}>
                          {labels[campaign.status] || campaign.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#667085]">
                        By <strong className="text-[#101820]">{campaign.organizer}</strong> • {campaign.category} • Goal {formatCurrency(campaign.goal)} • Raised {formatCurrency(campaign.raised)}
                      </p>
                    </div>

                    {/* 3-Dot Kebab Actions Menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        aria-label={`Options for ${campaign.title}`}
                        onClick={() => setOpenMenuId((current) => (current === campaign.id ? null : campaign.id))}
                        className="grid h-7 w-7 place-items-center rounded-md border border-[#d8e3f0] text-[#667085] hover:border-[#245bdb]/40 hover:bg-[#f5f7fa] hover:text-[#245bdb]"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* 3-Dot Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 z-30 w-44 rounded-lg border border-[#d8e3f0] bg-white py-1 shadow-card">
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#101820] hover:bg-[#f5f7fa]"
                          >
                            <ExternalLink size={13} className="text-[#667085]" /> View public page
                          </Link>

                          {campaign.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCampaignStatus(campaign.id, 'approved')
                                setOpenMenuId(null)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-[#245bdb] hover:bg-[#eef3fc]"
                            >
                              <Check size={13} /> Approve campaign
                            </button>
                          )}

                          {campaign.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCampaignStatus(campaign.id, 'paused')
                                setOpenMenuId(null)
                              }}
                              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50"
                            >
                              <Check size={13} /> Pause campaign
                            </button>
                          )}

                          <div className="my-1 border-t border-[#e9eef2]" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              setDeleting(campaign)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-bold text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 size={13} /> Delete campaign
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#667085]">{campaign.description}</p>

                  {/* Primary Quick Actions Bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-[#d8e3f0] px-2.5 py-1 text-[11px] font-semibold text-[#101820] hover:bg-[#f5f7fa]"
                    >
                      View details <ExternalLink size={11} />
                    </Link>

                    {campaign.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setCampaignStatus(campaign.id, 'approved')}
                          className="inline-flex items-center gap-1 rounded-md bg-[#245bdb] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#1d4ed8]"
                        >
                          <Check size={12} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejecting(campaign)}
                          className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <X size={12} /> Reject
                        </button>
                      </>
                    ) : campaign.status === 'approved' ? (
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(campaign.id, 'paused')}
                        className="rounded-md border border-[#d8e3f0] px-2.5 py-1 text-[11px] font-semibold text-[#667085] hover:bg-[#f5f7fa]"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(campaign.id, campaign.status === 'rejected' ? 'pending' : 'approved')}
                        className="rounded-md bg-[#245bdb] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#1d4ed8]"
                      >
                        {campaign.status === 'rejected' ? 'Reopen review' : 'Resume campaign'}
                      </button>
                    )}

                    {/* Quick Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleting(campaign)}
                      className="inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                      title="Delete campaign"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {!shown.length && (
        <div className="mt-6 rounded-xl border border-dashed border-[#d8e3f0] p-10 text-center text-xs text-[#667085]">
          No campaigns match these filters.
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(rejecting)}
        title="Reject this campaign?"
        message={rejecting ? `“${rejecting.title}” will be hidden from the public campaign list. You can reopen its review later.` : ''}
        confirmLabel="Reject campaign"
        variant="danger"
        onCancel={() => setRejecting(null)}
        onConfirm={() => {
          setCampaignStatus(rejecting.id, 'rejected')
          setRejecting(null)
        }}
      />

      {/* Single Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={Boolean(deleting)}
        title="Delete this campaign?"
        message={deleting ? `Are you sure you want to delete “${deleting.title}”? This will remove the campaign and all its contributions from the platform. This action cannot be undone.` : ''}
        confirmLabel="Delete campaign"
        variant="danger"
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmSingleDelete}
      />

      {/* Batch Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isBatchDeleting}
        title={`Delete ${selectedIds.length} campaigns?`}
        message={`Are you sure you want to permanently delete all ${selectedIds.length} selected campaigns? This action cannot be undone.`}
        confirmLabel={`Delete ${selectedIds.length} campaigns`}
        variant="danger"
        onCancel={() => setIsBatchDeleting(false)}
        onConfirm={handleConfirmBatchDelete}
      />
    </div>
  )
}
