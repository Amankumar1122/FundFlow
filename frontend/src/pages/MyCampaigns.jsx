import { Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import CampaignCard from '../components/common/CampaignCard'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'

export default function MyCampaigns() {
  const navigate = useNavigate()
  const { user, campaigns } = useApp()
  const mine = campaigns.filter((item) => item.organizerId === user.id)
  return <div><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Your ideas in motion</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">My campaigns</h1><p className="mt-2 text-sm text-muted">Track your community campaigns and their progress.</p></div><Link to="/dashboard/create"><Button><Plus size={16} />New campaign</Button></Link></div>
    <div className="mt-7 flex flex-wrap gap-2">{[['All', mine.length], ['Live', mine.filter((item) => item.status === 'approved').length], ['Under review', mine.filter((item) => item.status === 'pending').length]].map(([label, count]) => <span key={label} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-ink">{label} <span className="ml-1 text-muted">{count}</span></span>)}</div>
    {mine.length ? <div className="mt-5 grid gap-5 md:grid-cols-2">{mine.map((item) => <div key={item.id} className="relative"><span className={`absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-bold ${item.status === 'approved' ? 'bg-emerald-100 text-forest' : item.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'}`}>{item.status === 'approved' ? 'Live' : item.status === 'pending' ? 'Under review' : item.status}</span><CampaignCard campaign={item} /></div>)}</div> : <div className="mt-6"><EmptyState title="Your first campaign is waiting" text="Bring your community together around a cause that matters to you." action="Start a campaign" onAction={() => navigate('/dashboard/create')} /></div>}
  </div>
}
