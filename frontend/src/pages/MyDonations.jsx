import { ArrowUpRight, Heart, ReceiptText } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

export default function MyDonations() {
  const navigate = useNavigate()
  const { user, donations, campaigns } = useApp()
  const mine = donations.filter((item) => item.donorId === user.id)
  const total = mine.reduce((sum, donation) => sum + donation.amount, 0)
  return <div><div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Your generosity at work</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">My donations</h1><p className="mt-2 text-sm text-muted">A record of the causes you’ve supported in this demo.</p></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-xs font-semibold text-muted"><Heart size={16} className="text-forest" />Total demo contributions</div><div className="mt-3 font-display text-2xl font-extrabold text-ink">{formatCurrency(total)}</div></div><div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-2 text-xs font-semibold text-muted"><ReceiptText size={16} className="text-forest" />Causes supported</div><div className="mt-3 font-display text-2xl font-extrabold text-ink">{mine.length}</div></div></div>
    {mine.length ? <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="hidden grid-cols-[1fr_130px_120px] gap-4 border-b border-slate-100 bg-paper px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-muted sm:grid"><span>Campaign</span><span>Date</span><span className="text-right">Amount</span></div>{mine.map((donation) => { const campaign = campaigns.find((item) => item.id === donation.campaignId); return <div key={donation.id} className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[1fr_130px_120px] sm:items-center sm:gap-4"><div className="flex min-w-0 items-center gap-3"><img src={campaign?.image} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover" /><div className="min-w-0"><Link to={`/campaigns/${donation.campaignId}`} className="block truncate text-sm font-bold text-ink hover:text-forest">{campaign?.title || 'Community campaign'} <ArrowUpRight size={13} className="inline" /></Link><p className="mt-1 text-xs text-muted">Simulated donation</p></div></div><span className="text-xs text-muted">{new Date(donation.date).toLocaleDateString()}</span><span className="text-sm font-bold text-forest sm:text-right">{formatCurrency(donation.amount)}</span></div> })}<p className="bg-amber-50 px-5 py-3 text-xs text-amber-800">Demo records only. These contributions were not charged or transferred.</p></div> : <div className="mt-6"><EmptyState title="Your first act of kindness awaits" text="Explore campaigns and support a cause that matters to you." action="Explore campaigns" onAction={() => navigate('/explore')} /></div>}
  </div>
}
