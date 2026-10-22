import { ArrowRight, BadgeIndianRupee, Clock3, Heart, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../hooks/useCurrency'

export default function AdminDashboard() {
  const { campaigns, donations, users } = useApp()
  const raised = campaigns.reduce((sum, item) => sum + item.raised, 0)
  const pending = campaigns.filter((item) => item.status === 'pending')
  const cards = [
    [Users, users.length, 'Registered accounts'],
    [Heart, campaigns.length, 'Total campaigns'],
    [BadgeIndianRupee, formatCurrency(raised), 'Platform capital mobilized'],
    [Clock3, pending.length, 'Awaiting moderation'],
  ]

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Administrative Console</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">Admin overview</h1>
        <p className="mt-1 text-xs text-[#667085]">Monitor platform integrity, campaign moderation queues, and user activity.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon, value, label]) => (
          <div key={label} className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
              <Icon size={17} />
            </span>
            <div className="mt-3 text-2xl font-extrabold text-[#101820] tabular-nums">{value}</div>
            <div className="mt-0.5 text-xs text-[#667085]">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-2xs">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#101820]">Campaign moderation queue</h2>
              <p className="mt-0.5 text-xs text-[#667085]">Initiatives pending verification decision</p>
            </div>
            <Link to="/admin/campaigns" className="text-xs font-bold text-[#245bdb] hover:underline">
              Manage <ArrowRight size={13} className="inline" />
            </Link>
          </div>

          {pending.length ? (
            <div className="mt-4 space-y-3">
              {pending.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border border-[#d8e3f0] bg-[#f5f7fa] p-3">
                  <img src={item.image} alt="" className="h-11 w-11 rounded-md object-cover border border-[#d8e3f0]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-[#101820]">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-[#667085]">{item.organizer} • {item.category}</p>
                  </div>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                    Review
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-[#eef3fc] border border-[#d8e3f0] p-6 text-center">
              <ShieldCheck size={22} className="mx-auto text-[#245bdb]" />
              <p className="mt-2 text-xs font-bold text-[#101820]">All caught up!</p>
              <p className="mt-0.5 text-[11px] text-[#667085]">There are no initiatives awaiting moderation right now.</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#101820]">Recent contributions</h2>
          <p className="mt-0.5 text-xs text-[#667085]">Audit feed of latest donor transactions</p>
          <div className="mt-4 space-y-3.5">
            {donations.slice(0, 6).map((donation) => (
              <div key={donation.id} className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eef3fc] text-xs font-bold text-[#245bdb]">
                  {donation.donorName[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#101820]">{donation.donorName}</p>
                  <p className="truncate text-[11px] text-[#667085]">
                    {campaigns.find((item) => String(item.id) === String(donation.campaignId))?.title || 'Campaign'}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#245bdb] tabular-nums">{formatCurrency(donation.amount)}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/donations" className="mt-4 block rounded-lg border border-[#d8e3f0] bg-[#f5f7fa] px-3.5 py-2 text-center text-xs font-bold text-[#245bdb] hover:bg-[#eef3fc]">
            View full donation audit ledger
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-[#d8e3f0] bg-white p-3.5 text-xs leading-5 text-[#667085]">
        <strong className="text-[#101820]">Governance Mode:</strong> Administrative actions directly update database records via Spring Boot REST controllers with role-based checks.
      </div>
    </div>
  )
}
