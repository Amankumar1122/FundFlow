import { ArrowUpRight, MapPin, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../hooks/useCurrency'
import ProgressBar from './ProgressBar'

export default function CampaignCard({ campaign, featured = false }) {
  const percent = campaign.goal > 0 ? Math.max(0, Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))) : 0
  return (
    <article className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-teal-500/30 hover:shadow-soft ${featured ? 'campaign-card-featured' : ''}`}>
      <div>
        <Link to={`/campaigns/${campaign.id}`} className={`relative block aspect-[1.6/1] overflow-hidden bg-slate-100 ${featured ? 'campaign-card-featured-image' : ''}`}>
          <img
            src={campaign.image}
            alt={`Community campaign: ${campaign.title}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
            }}
          />
          <span className="absolute left-3.5 top-3.5 rounded-full border border-teal-100 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-forest shadow-xs">
            {campaign.category}
          </span>
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
            <Users size={12} />
            <span className="tabular-nums">{campaign.backers}</span> supporters
          </span>
        </Link>
        <div className={`p-5 ${featured ? 'campaign-card-featured-content' : ''}`}>
          <div className="mb-2 flex items-center gap-1.5 text-xs text-muted">
            <MapPin size={12} className="text-slate-400" />
            <span className="truncate">{campaign.location || 'Community-led'}</span>
          </div>
          <Link
            to={`/campaigns/${campaign.id}`}
            className="line-clamp-2 font-display text-base font-bold leading-snug text-ink transition-colors hover:text-forest"
          >
            {campaign.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">{campaign.description}</p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-base font-bold text-ink tabular-nums">
              {formatCurrency(campaign.raised)}
            </div>
            <div className="mt-0.5 text-[11px] text-muted">
              raised of <span className="tabular-nums">{formatCurrency(campaign.goal)}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-forest tabular-nums">{percent}%</div>
            <div className="text-[11px] text-muted tabular-nums">{campaign.daysLeft} days left</div>
          </div>
        </div>
        <ProgressBar raised={campaign.raised} goal={campaign.goal} className="mt-2.5" />
        <Link
          to={`/campaigns/${campaign.id}`}
          className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold text-forest hover:text-[#115e59]"
        >
          <span>Support this cause</span>
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  )
}
