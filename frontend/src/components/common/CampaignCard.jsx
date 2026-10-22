import { ArrowUpRight, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../hooks/useCurrency'
import ProgressBar from './ProgressBar'

export default function CampaignCard({ campaign, featured = false }) {
  const percent = campaign.goal > 0 ? Math.max(0, Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))) : 0
  return (
    <article className={`group flex flex-col justify-between overflow-hidden rounded-xl border border-[#d8e3f0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#245bdb]/40 hover:shadow-soft ${featured ? 'campaign-card-featured' : ''}`}>
      <div>
        <Link to={`/campaigns/${campaign.id}`} className={`relative block aspect-[1.6/1] overflow-hidden bg-[#e9eef2] ${featured ? 'campaign-card-featured-image' : ''}`}>
          <img
            src={campaign.image}
            alt={`Community campaign: ${campaign.title}`}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
            }}
          />
          <span className="absolute left-3 top-3 rounded-md border border-[#d8e3f0] bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-[#245bdb] shadow-2xs">
            {campaign.category}
          </span>
          <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-[#101820]/85 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
            <Users size={11} />
            <span className="tabular-nums">{campaign.backers}</span> supporters
          </span>
        </Link>
        <div className={`p-4.5 ${featured ? 'campaign-card-featured-content' : ''}`}>
          <div className="mb-1.5 flex items-center gap-1.5 text-xs text-[#667085]">
            <MapPin size={12} className="text-slate-400" />
            <span className="truncate">{campaign.location || 'Community-led'}</span>
          </div>
          <Link
            to={`/campaigns/${campaign.id}`}
            className="line-clamp-2 text-sm font-bold leading-snug text-[#101820] transition-colors hover:text-[#245bdb]"
          >
            {campaign.title}
          </Link>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[#667085]">{campaign.description}</p>
        </div>
      </div>

      <div className="p-4.5 pt-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-[#101820] tabular-nums">
              {formatCurrency(campaign.raised)}
            </div>
            <div className="mt-0.5 text-[11px] text-[#667085]">
              raised of <span className="tabular-nums">{formatCurrency(campaign.goal)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-[#245bdb] tabular-nums">{percent}%</div>
            <div className="text-[11px] text-[#667085] tabular-nums">{campaign.daysLeft} days left</div>
          </div>
        </div>
        <ProgressBar raised={campaign.raised} goal={campaign.goal} className="mt-2" />
        <Link
          to={`/campaigns/${campaign.id}`}
          className="mt-3.5 flex items-center justify-between border-t border-[#e9eef2] pt-2.5 text-xs font-semibold text-[#245bdb] hover:text-[#1d4ed8]"
        >
          <span>Support this cause</span>
          <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}
