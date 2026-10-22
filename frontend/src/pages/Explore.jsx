import { Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CampaignCard from '../components/common/CampaignCard'
import EmptyState from '../components/common/EmptyState'
import FormField from '../components/common/FormField'
import { categories } from '../data/seed'
import { useApp } from '../context/AppContext'

export default function Explore() {
  const { campaigns } = useApp()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'All causes')
  const [sort, setSort] = useState('Most supported')

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = campaigns
      .filter((campaign) => campaign.status === 'approved')
      .filter((campaign) => category === 'All causes' || campaign.category === category)
      .filter(
        (campaign) =>
          !normalized ||
          `${campaign.title} ${campaign.category} ${campaign.description} ${campaign.location}`
            .toLowerCase()
            .includes(normalized)
      )
    return filtered.sort((a, b) =>
      sort === 'Ending soon'
        ? a.daysLeft - b.daysLeft
        : sort === 'Most funded'
        ? b.raised / b.goal - a.raised / a.goal
        : b.backers - a.backers
    )
  }, [campaigns, category, query, sort])

  const updateCategory = (value) => {
    setCategory(value)
    setSearchParams(value === 'All causes' ? {} : { category: value })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-wider text-forest">Discover initiatives</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
          Explore campaigns
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
          Browse verified community causes, filter by area of impact, and support initiatives that matter.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <label className="relative block">
            <span className="sr-only">Search campaigns</span>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              aria-label="Search campaigns"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by cause, keyword, or location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
            />
          </label>
          <FormField
            id="sort"
            label="Sort by"
            as="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={['Most supported', 'Most funded', 'Ending soon']}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3.5">
          <span className="mr-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
            <SlidersHorizontal size={13} /> Category:
          </span>
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => updateCategory(item)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === item
                  ? 'bg-forest text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-ink'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-6 flex items-center justify-between">
        <p className="text-xs text-muted" aria-live="polite">
          Showing <strong className="text-ink tabular-nums">{results.length}</strong> {results.length === 1 ? 'campaign' : 'campaigns'}
        </p>
      </div>

      {results.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No campaigns found"
          text="Try another search keyword or select a different category to discover causes."
          action="Clear filters"
          onAction={() => {
            setQuery('')
            updateCategory('All causes')
          }}
        />
      )}
    </div>
  )
}
