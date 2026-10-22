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
  const styles = { pending: 'bg-amber-100 text-amber-800', approved: 'bg-emerald-100 text-forest', rejected: 'bg-rose-100 text-rose-700', paused: 'bg-slate-100 text-slate-600' }

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
          <p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Keep things moving</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Campaign management</h1>
          <p className="mt-2 text-sm text-muted">Review submissions, moderate visibility, or delete campaigns.</p>
        </div>
      </div>

      {/* Search, Filter, and Selection Bar */}
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <label className="relative block">
          <span className="sr-only">Search campaigns</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or organizer"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-forest"
          />
        </label>
        <FormField id="filter-status" label="" as="select" value={status} onChange={(event) => setStatus(event.target.value)} options={setStatusChoices} />
      </div>

      {/* Batch Selection Banner */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs">
        <label className="flex cursor-pointer items-center gap-2 font-semibold text-ink">
          <input
            type="checkbox"
            checked={allShownSelected}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-slate-300 text-forest focus:ring-forest"
          />
          <span>Select all shown ({shown.length})</span>
        </label>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="font-bold text-forest">{selectedIds.length} campaign{selectedIds.length > 1 ? 's' : ''} selected</span>
            <button
              type="button"
              onClick={() => setIsBatchDeleting(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 font-bold text-rose-700 hover:bg-rose-100"
            >
              <Trash2 size={13} /> Delete selected
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
              className={`relative rounded-2xl border bg-white p-4 transition-colors sm:p-5 ${
                isSelected ? 'border-forest/50 bg-mint/10' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Selection Checkbox & Thumbnail */}
                <div className="relative shrink-0 sm:w-36">
                  <label className="absolute left-2.5 top-2.5 z-10 grid h-6 w-6 place-items-center rounded-md bg-white/90 shadow-sm backdrop-blur-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(campaign.id)}
                      className="h-4 w-4 rounded border-slate-300 text-forest focus:ring-forest"
                    />
                  </label>
                  <img src={campaign.image} alt="" className="h-36 w-full rounded-xl object-cover sm:h-24 sm:w-36" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-display text-base font-extrabold text-ink">{campaign.title}</h2>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[campaign.status] || styles.paused}`}>
                          {labels[campaign.status] || campaign.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        By <strong className="text-ink">{campaign.organizer}</strong> · {campaign.category} · Goal {formatCurrency(campaign.goal)} · Raised {formatCurrency(campaign.raised)}
                      </p>
                    </div>

                    {/* 3-Dot Kebab Actions Menu */}
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        aria-label={`Options for ${campaign.title}`}
                        onClick={() => setOpenMenuId((current) => (current === campaign.id ? null : campaign.id))}
                        className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:border-forest/40 hover:bg-paper hover:text-forest"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* 3-Dot Dropdown Menu */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-soft">
                          <Link
                            to={`/campaigns/${campaign.id}`}
                            onClick={() => setOpenMenuId(null)}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-paper"
                          >
                            <ExternalLink size={14} className="text-muted" /> View public page
                          </Link>

                          {campaign.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCampaignStatus(campaign.id, 'approved')
                                setOpenMenuId(null)
                              }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-forest hover:bg-mint/30"
                            >
                              <Check size={14} /> Approve campaign
                            </button>
                          )}

                          {campaign.status === 'approved' && (
                            <button
                              type="button"
                              onClick={() => {
                                setCampaignStatus(campaign.id, 'paused')
                                setOpenMenuId(null)
                              }}
                              className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50"
                            >
                              <Check size={14} /> Pause campaign
                            </button>
                          )}

                          <div className="my-1 border-t border-slate-100" />

                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null)
                              setDeleting(campaign)
                            }}
                            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs font-bold text-rose-700 hover:bg-rose-50"
                          >
                            <Trash2 size={14} /> Delete campaign
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{campaign.description}</p>

                  {/* Primary Quick Actions Bar */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Link
                      to={`/campaigns/${campaign.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-ink hover:bg-paper"
                    >
                      View details <ExternalLink size={12} />
                    </Link>

                    {campaign.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setCampaignStatus(campaign.id, 'approved')}
                          className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#11563e]"
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejecting(campaign)}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <X size={13} /> Reject
                        </button>
                      </>
                    ) : campaign.status === 'approved' ? (
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(campaign.id, 'paused')}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-muted hover:bg-paper"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCampaignStatus(campaign.id, campaign.status === 'rejected' ? 'pending' : 'approved')}
                        className="rounded-lg bg-forest px-3 py-1.5 text-[11px] font-bold text-white"
                      >
                        {campaign.status === 'rejected' ? 'Reopen review' : 'Resume campaign'}
                      </button>
                    )}

                    {/* Quick Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeleting(campaign)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                      title="Delete campaign"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {!shown.length && <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-muted">No campaigns match these filters.</div>}

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
