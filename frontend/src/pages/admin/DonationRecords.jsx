import { BadgeIndianRupee, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../hooks/useCurrency'

export default function DonationRecords() {
  const { donations, campaigns } = useApp()
  const [query, setQuery] = useState('')

  const records = useMemo(
    () =>
      donations.filter((item) =>
        `${item.donorName} ${campaigns.find((campaign) => String(campaign.id) === String(item.campaignId))?.title || ''}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [donations, campaigns, query]
  )

  const total = donations.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Financial Audit Feed</p>
      <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">Donation records</h1>
      <p className="mt-1 text-xs text-[#667085]">Comprehensive transaction ledger across all platform campaigns.</p>

      <div className="mt-6 rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
            <BadgeIndianRupee size={18} />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Platform capital mobilized</p>
            <p className="mt-0.5 text-xl font-extrabold text-[#101820] tabular-nums">{formatCurrency(total)}</p>
          </div>
        </div>
      </div>

      <label className="relative mt-5 block">
        <span className="sr-only">Search donation records</span>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search supporter or campaign name"
          className="w-full rounded-lg border border-[#d8e3f0] bg-white py-2 pl-10 pr-4 text-xs text-[#101820] outline-none focus:border-[#245bdb] focus:ring-2 focus:ring-[#245bdb]/15"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#d8e3f0] bg-white shadow-2xs">
        <div className="hidden grid-cols-[1fr_1.2fr_110px_110px] gap-3 border-b border-[#d8e3f0] bg-[#f5f7fa] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#667085] sm:grid">
          <span>Supporter</span>
          <span>Campaign</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>
        {records.length ? (
          records.map((item) => (
            <div key={item.id} className="grid gap-2 border-b border-[#e9eef2] px-4 py-3 last:border-0 sm:grid-cols-[1fr_1.2fr_110px_110px] sm:items-center sm:gap-3">
              <div className="text-xs font-bold text-[#101820]">{item.donorName}</div>
              <Link to={`/campaigns/${item.campaignId}`} className="truncate text-xs font-semibold text-[#245bdb] hover:underline">
                {campaigns.find((campaign) => String(campaign.id) === String(item.campaignId))?.title || 'Campaign'}
              </Link>
              <span className="text-xs text-[#667085]">{new Date(item.date).toLocaleDateString()}</span>
              <span className="text-xs font-bold text-[#101820] sm:text-right tabular-nums">{formatCurrency(item.amount)}</span>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-[#667085]">No matching donation records.</div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-[#d8e3f0] bg-[#eef3fc] p-3 text-xs text-[#245bdb]">
        <strong>Demonstration Ledger:</strong> Transactions are simulated to validate reconciliation workflows without processing live financial cardholder data.
      </div>
    </div>
  )
}
