import { ArrowUpRight, Heart, ReceiptText } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

export default function MyDonations() {
  const navigate = useNavigate()
  const { user, donations, campaigns } = useApp()
  const mine = donations.filter((item) => String(item.donorId) === String(user.id))
  const total = mine.reduce((sum, donation) => sum + donation.amount, 0)

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Contribution Ledger</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">My donations</h1>
        <p className="mt-1 text-xs text-[#667085]">Audit log of your contributions across verified campaigns.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
            <Heart size={15} className="text-[#245bdb]" />
            <span>Total platform contributions</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#101820] tabular-nums">{formatCurrency(total)}</div>
        </div>

        <div className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
            <ReceiptText size={15} className="text-[#245bdb]" />
            <span>Causes backed</span>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#101820] tabular-nums">{mine.length}</div>
        </div>
      </div>

      {mine.length ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-[#d8e3f0] bg-white shadow-2xs">
          <div className="hidden grid-cols-[1fr_130px_120px] gap-4 border-b border-[#d8e3f0] bg-[#f5f7fa] px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#667085] sm:grid">
            <span>Campaign</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          {mine.map((donation) => {
            const campaign = campaigns.find((item) => String(item.id) === String(donation.campaignId))
            return (
              <div key={donation.id} className="grid gap-2 border-b border-[#e9eef2] px-4 py-3.5 last:border-0 sm:grid-cols-[1fr_130px_120px] sm:items-center sm:gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={campaign?.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg object-cover border border-[#d8e3f0]"
                  />
                  <div className="min-w-0">
                    <Link to={`/campaigns/${donation.campaignId}`} className="block truncate text-xs font-bold text-[#101820] hover:text-[#245bdb]">
                      {campaign?.title || 'Community campaign'} <ArrowUpRight size={12} className="inline text-[#667085]" />
                    </Link>
                    <p className="mt-0.5 text-[11px] text-[#667085]">Verified Record</p>
                  </div>
                </div>
                <span className="text-xs text-[#667085]">{new Date(donation.date).toLocaleDateString()}</span>
                <span className="text-xs font-bold text-[#245bdb] sm:text-right tabular-nums">{formatCurrency(donation.amount)}</span>
              </div>
            )
          })}
          <div className="border-t border-[#d8e3f0] bg-[#eef3fc] px-4 py-2.5 text-[11px] font-medium text-[#245bdb]">
            Simulation records only. Contributions represent demonstration data for platform evaluation.
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Your first act of kindness awaits"
            text="Explore campaigns and support a cause that matters to you."
            action="Explore campaigns"
            onAction={() => navigate('/explore')}
          />
        </div>
      )}
    </div>
  )
}
