import { ArrowRight, ArrowUpRight, BadgeIndianRupee, CirclePlus, Heart, Sparkles, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import CampaignCard from '../components/common/CampaignCard'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, campaigns, donations, activities } = useApp()
  const myCampaigns = campaigns.filter((item) => String(item.organizerId) === String(user.id))
  const myDonations = donations.filter((item) => String(item.donorId) === String(user.id))
  const donated = myDonations.reduce((total, item) => total + item.amount, 0)
  const raised = myCampaigns.reduce((total, item) => total + item.raised, 0)

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#667085]">Personal Command Center</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#101820] sm:text-3xl">
            Hello, {user.name.split(' ')[0]} <span aria-hidden="true">👋</span>
          </h1>
        </div>
        <Link to="/dashboard/create">
          <Button>
            <CirclePlus size={16} />
            <span>Start a campaign</span>
          </Button>
        </Link>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [BadgeIndianRupee, formatCurrency(donated), 'Your contributions'],
          [Heart, myDonations.length, 'Causes supported'],
          [Sparkles, myCampaigns.length, 'Your campaigns'],
          [Users, formatCurrency(raised), 'Raised for your causes'],
        ].map(([Icon, value, label]) => (
          <div key={label} className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
              <Icon size={17} />
            </span>
            <div className="mt-3 text-2xl font-extrabold text-[#101820] tabular-nums">{value}</div>
            <div className="mt-0.5 text-xs text-[#667085]">{label}</div>
          </div>
        ))}
      </div>

      {/* 2-Column Dashboard Center */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#101820]">Your recent impact</h2>
              <p className="mt-0.5 text-xs text-[#667085]">Summary of recent contributions and initiatives</p>
            </div>
            <Link to="/dashboard/donations" className="text-xs font-bold text-[#245bdb] hover:underline">
              All donations <ArrowRight size={13} className="inline" />
            </Link>
          </div>

          {myDonations.length ? (
            <div className="mt-4 divide-y divide-[#e9eef2]">
              {myDonations.slice(0, 4).map((item) => {
                const campaign = campaigns.find((candidate) => String(candidate.id) === String(item.campaignId))
                return (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb]">
                      <Heart size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/campaigns/${item.campaignId}`} className="block truncate text-xs font-bold text-[#101820] hover:text-[#245bdb]">
                        {campaign?.title || 'Community campaign'}
                      </Link>
                      <div className="mt-0.5 text-[11px] text-[#667085]">{new Date(item.date).toLocaleDateString()}</div>
                    </div>
                    <span className="text-xs font-bold text-[#245bdb] tabular-nums">{formatCurrency(item.amount)}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="Your impact starts here"
                text="Find a cause you care about and make your first demo contribution."
                action="Explore campaigns"
                onAction={() => navigate('/explore')}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-2xs">
          <h2 className="text-sm font-bold text-[#101820]">Community activity</h2>
          <p className="mt-0.5 text-xs text-[#667085]">Real-time audit log of platform actions</p>
          <div className="mt-4 space-y-4">
            {activities.slice(0, 5).map((item) => (
              <div key={item.id} className="flex gap-2.5">
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md ${
                  item.type === 'donation' ? 'bg-[#eef3fc] text-[#245bdb]' : 'bg-[#e9eef2] text-[#101820]'
                }`}>
                  {item.type === 'donation' ? <Heart size={13} /> : <Sparkles size={13} />}
                </span>
                <div>
                  <p className="text-xs leading-5 text-[#101820]">{item.text}</p>
                  <p className="mt-0.5 text-[10px] text-[#667085]">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/explore" className="mt-5 flex items-center justify-between rounded-lg bg-[#f5f7fa] p-2.5 text-xs font-bold text-[#245bdb] hover:bg-[#eef3fc]">
            <span>Discover more causes</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#101820]">Your campaigns</h2>
            <p className="mt-0.5 text-xs text-[#667085]">Initiatives you have organized</p>
          </div>
          <Link to="/dashboard/campaigns" className="text-xs font-bold text-[#245bdb] hover:underline">
            Manage <ArrowRight size={13} className="inline" />
          </Link>
        </div>
        {myCampaigns.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {myCampaigns.slice(0, 2).map((item) => (
              <CampaignCard key={item.id} campaign={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d8e3f0] bg-white p-8 text-center">
            <p className="text-sm font-bold text-[#101820]">Ready to organize a community initiative?</p>
            <p className="mt-1 text-xs text-[#667085]">Submit a campaign to connect with backers across the platform.</p>
            <Link to="/dashboard/create" className="mt-4 inline-flex">
              <Button size="sm">Create a campaign <ArrowRight size={14} /></Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
