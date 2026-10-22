import { Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import CampaignCard from '../components/common/CampaignCard'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'

export default function MyCampaigns() {
  const navigate = useNavigate()
  const { user, campaigns } = useApp()
  const mine = campaigns.filter((item) => String(item.organizerId) === String(user.id))

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Organizer Portfolio</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">My campaigns</h1>
          <p className="mt-1 text-xs text-[#667085]">Monitor performance, approval states, and funding progress for your initiatives.</p>
        </div>
        <Link to="/dashboard/create">
          <Button size="sm">
            <Plus size={15} />
            <span>New campaign</span>
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          ['All', mine.length],
          ['Live', mine.filter((item) => item.status === 'approved').length],
          ['Under review', mine.filter((item) => item.status === 'pending').length],
        ].map(([label, count]) => (
          <span key={label} className="rounded-lg border border-[#d8e3f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#101820]">
            {label} <span className="ml-1 text-[#667085] tabular-nums">({count})</span>
          </span>
        ))}
      </div>

      {mine.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {mine.map((item) => (
            <div key={item.id} className="relative">
              <span
                className={`absolute right-3.5 top-3.5 z-10 rounded-md px-2.5 py-0.5 text-[11px] font-bold border ${
                  item.status === 'approved'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : item.status === 'pending'
                    ? 'border-amber-200 bg-amber-50 text-amber-700'
                    : 'border-rose-200 bg-rose-50 text-rose-700'
                }`}
              >
                {item.status === 'approved' ? 'Live' : item.status === 'pending' ? 'Under review' : item.status}
              </span>
              <CampaignCard campaign={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Your first campaign is waiting"
            text="Bring your community together around a cause that matters to you."
            action="Start a campaign"
            onAction={() => navigate('/dashboard/create')}
          />
        </div>
      )}
    </div>
  )
}
