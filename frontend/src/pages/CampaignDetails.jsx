import { ArrowLeft, CalendarDays, CheckCircle2, Heart, MapPin, ShieldCheck, Users } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import ProgressBar from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { campaigns, donations, user, donate, notify } = useApp()
  const campaign = campaigns.find((item) => item.id === id)
  const [amount, setAmount] = useState('500')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  if (!campaign || (campaign.status !== 'approved' && campaign.organizerId !== user?.id && user?.role !== 'admin')) return <div className="mx-auto max-w-2xl px-5 py-24 text-center"><h1 className="font-display text-3xl font-extrabold text-ink">This campaign is not available</h1><p className="mt-3 text-muted">It may have ended or still be waiting for review.</p><Link to="/explore" className="mt-6 inline-block font-bold text-forest">Explore campaigns</Link></div>
  const percent = Math.min(100, Math.round(campaign.raised / campaign.goal * 100))
  const recentDonations = donations.filter((item) => item.campaignId === id).slice(0, 5)
  const handleDonate = async (event) => {
    event.preventDefault()
    if (!user) return navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } })
    setLoading(true)
    try { donate(id, amount, message); setMessage('') } catch (error) { notify(error.message, 'error') } finally { setLoading(false) }
  }
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-forest"><ArrowLeft size={16} /> All campaigns</Link>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="overflow-hidden rounded-3xl bg-slate-100"><img src={campaign.image} alt={campaign.title} className="max-h-[480px] min-h-[280px] w-full object-cover" /></div>
          <div className="mt-8"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-mint px-3 py-1.5 text-xs font-bold text-forest">{campaign.category}</span><span className="flex items-center gap-1 text-xs text-muted"><MapPin size={13} />{campaign.location}</span></div><h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">{campaign.title}</h1><p className="mt-3 text-sm text-muted">Organized by <strong className="text-ink">{campaign.organizer}</strong></p></div>
          <div className="mt-8 flex gap-7 border-y border-slate-200 py-5 text-sm"><span className="flex items-center gap-2 text-muted"><Users size={17} className="text-forest" /><strong className="text-ink">{campaign.backers}</strong> supporters</span><span className="flex items-center gap-2 text-muted"><CalendarDays size={17} className="text-forest" /><strong className="text-ink">{campaign.daysLeft}</strong> days left</span></div>
          <div className="mt-8"><h2 className="font-display text-xl font-extrabold text-ink">Why this matters</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{campaign.description}</p>{campaign.story && <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">{campaign.story}</p>}</div>
          <div className="mt-9 rounded-2xl bg-[#eef3ed] p-5 sm:p-6"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-white font-bold text-forest">{campaign.organizer.split(' ').map((part) => part[0]).join('')}</span><div><div className="text-sm font-bold text-ink">{campaign.organizer}</div><div className="text-xs text-muted">Campaign organizer · {campaign.location}</div></div><CheckCircle2 size={19} className="ml-auto text-forest" /></div></div>
          <div className="mt-9"><h2 className="font-display text-xl font-extrabold text-ink">Recent supporters</h2><div className="mt-4 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">{recentDonations.length ? recentDonations.map((item) => <div key={item.id} className="flex items-center gap-3 py-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-mint font-bold text-forest">{item.donorName[0]}</span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">{item.donorName}</p>{item.message && <p className="mt-0.5 truncate text-xs text-muted">“{item.message}”</p>}</div><span className="text-sm font-bold text-forest">{formatCurrency(item.amount)}</span></div>) : <p className="py-5 text-sm text-muted">Be the first to support this cause.</p>}</div></div>
        </div>
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-3"><div><div className="font-display text-3xl font-extrabold text-ink">{formatCurrency(campaign.raised)}</div><div className="mt-1 text-sm text-muted">raised of {formatCurrency(campaign.goal)}</div></div><span className="text-lg font-extrabold text-forest">{percent}%</span></div>
            <ProgressBar raised={campaign.raised} goal={campaign.goal} className="mt-4" />
            <p className="mt-3 flex justify-between text-xs text-muted"><span>{campaign.backers} kind people</span><span>{campaign.daysLeft} days left</span></p>
            <div className="my-6 border-t border-slate-100" />
            <div className="flex items-center gap-2 text-sm font-bold text-ink"><Heart size={17} className="text-forest" />{campaign.status === 'approved' ? 'Make a difference' : 'Campaign awaiting review'}</div>
            {campaign.status !== 'approved' && <p className="mt-2 text-xs leading-5 text-muted">This campaign is not public yet, so it cannot receive contributions.</p>}
            {campaign.status === 'approved' && <>
            <p className="mt-2 text-xs leading-5 text-muted">This is a demo donation. No payment details are collected and no money moves.</p>
            <form onSubmit={handleDonate} className="mt-5 space-y-4">
              <div className="grid grid-cols-3 gap-2">{[250, 500, 1000].map((value) => <button key={value} type="button" onClick={() => setAmount(String(value))} className={`rounded-xl border py-2.5 text-xs font-bold transition ${Number(amount) === value ? 'border-forest bg-mint text-forest' : 'border-slate-200 text-muted hover:border-forest/30'}`}>₹{value}</button>)}</div>
              <FormField id="amount" label="Your contribution (₹)" type="number" min="1" step="1" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              <FormField id="message" label="Leave a note (optional)" as="textarea" rows="2" maxLength="180" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Share a kind word..." />
              <Button type="submit" loading={loading} className="w-full">{user ? 'Add demo donation' : 'Log in to support'}</Button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted"><ShieldCheck size={14} /> Demo only. No real transactions.</div>
            </>}
          </div>
        </aside>
      </div>
    </div>
  )
}
