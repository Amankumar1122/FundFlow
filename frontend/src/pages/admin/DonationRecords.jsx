import { BadgeIndianRupee, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../hooks/useCurrency'

export default function DonationRecords() {
  const { donations, campaigns } = useApp()
  const [query, setQuery] = useState('')
  const records = useMemo(() => donations.filter((item) => `${item.donorName} ${campaigns.find((campaign) => campaign.id === item.campaignId)?.title || ''}`.toLowerCase().includes(query.toLowerCase())), [donations, campaigns, query])
  const total = donations.reduce((sum, item) => sum + item.amount, 0)
  return <div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Community activity</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Donation records</h1><p className="mt-2 text-sm text-muted">Review simulated contributions across demo campaigns.</p>
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-forest"><BadgeIndianRupee size={19} /></span><div><p className="text-xs text-muted">Simulated total</p><p className="mt-1 font-display text-xl font-extrabold text-ink">{formatCurrency(total)}</p></div></div></div>
    <label className="relative mt-5 block"><span className="sr-only">Search donation records</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search donor or campaign" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-forest" /></label>
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="hidden grid-cols-[1fr_1.2fr_110px_110px] gap-3 border-b border-slate-100 bg-paper px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted sm:grid"><span>Supporter</span><span>Campaign</span><span>Date</span><span className="text-right">Amount</span></div>{records.length ? records.map((item) => <div key={item.id} className="grid gap-2 border-b border-slate-100 px-4 py-4 last:border-0 sm:grid-cols-[1fr_1.2fr_110px_110px] sm:items-center sm:gap-3"><div className="text-sm font-bold text-ink">{item.donorName}</div><Link to={`/campaigns/${item.campaignId}`} className="truncate text-xs font-semibold text-forest hover:underline">{campaigns.find((campaign) => campaign.id === item.campaignId)?.title || 'Campaign'}</Link><span className="text-xs text-muted">{new Date(item.date).toLocaleDateString()}</span><span className="text-sm font-bold text-ink sm:text-right">{formatCurrency(item.amount)}</span></div>) : <div className="p-8 text-center text-sm text-muted">No matching donation records.</div>}</div>
    <p className="mt-4 text-xs text-muted">For demonstration only. No money was collected or transferred.</p>
  </div>
}
