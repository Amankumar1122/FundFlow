import { ArrowDownRight, ArrowRight, ArrowUpRight, Heart, HeartHandshake, Leaf, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import CampaignCard from '../components/common/CampaignCard'
import Reveal, { useInView } from '../components/common/Reveal'
import { categories } from '../data/seed'
import { useApp } from '../context/AppContext'

const categoryIcons = {
  Education: Sparkles,
  Health: Heart,
  Community: Users,
  Animals: HeartHandshake,
  Environment: Leaf,
  Arts: Sparkles,
  Emergency: ShieldCheck,
}

function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [ref, isVisible] = useInView()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isVisible) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return undefined
    }
    let frame
    const started = performance.now()
    const duration = 750
    const animate = (now) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isVisible, value])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function Home() {
  const { campaigns, donations } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All causes')

  const approved = useMemo(() => campaigns.filter((campaign) => campaign.status === 'approved'), [campaigns])
  const total = approved.reduce((sum, campaign) => sum + campaign.raised, 0)

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return approved.filter(
      (campaign) =>
        (category === 'All causes' || campaign.category === category) &&
        (!normalized ||
          `${campaign.title} ${campaign.category} ${campaign.description} ${campaign.location}`
            .toLowerCase()
            .includes(normalized))
    )
  }, [approved, category, query])

  const featured = matches.slice(0, 3)

  return (
    <>
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-20 lg:px-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/60 px-3 py-1.5 text-xs font-bold text-forest">
              <span className="h-1.5 w-1.5 rounded-full bg-forest" />
              <span>GOOD THINGS GROW TOGETHER</span>
            </div>
            <h1 className="mt-5 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Big change starts with a <span className="text-forest">little help.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
              Meet the people turning community ideas into reality. Support verified local initiatives with transparent fundraising goals, or start a campaign for your own cause.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/explore">
                <Button size="lg">
                  <span>Explore campaigns</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary">
                  Start a campaign
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-muted">
              <ShieldCheck size={16} className="text-forest" />
              <span>Verified organizer review • Transparent progress metrics</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=85"
                alt="Children learning together in a bright classroom"
                className="h-[300px] w-full object-cover sm:h-[360px]"
                loading="eager"
              />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold text-forest border border-teal-100">
                    Featured Initiative
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Education</span>
                </div>
                <h3 className="mt-2 font-display text-base font-bold text-ink">
                  Empower Young Learners
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Creating welcoming spaces and educational resources for community programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-slate-50/60" aria-label="FundFlow impact metrics">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              [approved.length, '', 'active campaigns'],
              [donations.length, '', 'acts of kindness'],
              [Math.round(total / 1000), '₹', 'thousand raised'],
              [100, '', 'people-powered'],
            ].map(([value, prefix, label], index) => (
              <Reveal key={label} delay={index * 50} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <div className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl tabular-nums">
                  <AnimatedNumber
                    value={value}
                    prefix={prefix}
                    suffix={label === 'people-powered' ? '%' : label === 'acts of kindness' ? '+' : ''}
                  />
                </div>
                <div className="mt-1 text-xs text-muted">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest">Verified Causes</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Causes worth showing up for
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted sm:text-sm">
              Every campaign is started by a community organizer taking the first step.
            </p>
          </div>
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline">
            <span>See every campaign</span>
            <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
          <label className="relative block max-w-md">
            <span className="sr-only">Search campaigns on this page</span>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              aria-label="Search campaigns on this page"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search causes, places, or ideas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
            />
          </label>
          <div className="mt-3.5 flex flex-wrap gap-2" aria-label="Filter campaigns by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
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

        {featured.length ? (
          <>
            <p className="mb-4 mt-6 text-xs text-muted" aria-live="polite">
              Showing <strong className="text-ink tabular-nums">{featured.length}</strong>
              {matches.length > featured.length ? (
                <> of <strong className="text-ink tabular-nums">{matches.length}</strong></>
              ) : ''}{' '}
              {matches.length === 1 ? 'campaign' : 'campaigns'}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((campaign, index) => (
                <Reveal key={campaign.id} delay={index * 60}>
                  <CampaignCard campaign={campaign} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-display text-base font-bold text-ink">No causes match just yet</h3>
            <p className="mt-1 text-xs text-muted">Try another keyword or select a different category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All causes')
              }}
              className="mt-4 rounded-xl border border-forest px-4 py-2 text-xs font-semibold text-forest hover:bg-teal-50"
            >
              Clear search and filters
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to={category === 'All causes' ? '/explore' : `/explore?category=${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50"
          >
            <span>Browse all campaigns</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/60 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-forest">Categorized Giving</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">Explore causes that matter to you</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-muted">
              Choose an area of impact and connect with community initiatives.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.slice(1).map((item, index) => {
              const Icon = categoryIcons[item] || Sparkles
              return (
                <Reveal as="div" key={item} delay={index * 40}>
                  <Link
                    to={`/explore?category=${encodeURIComponent(item)}`}
                    className="category-tile group block rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all hover:-translate-y-1 hover:border-teal-300 hover:shadow-xs"
                  >
                    <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-forest transition-colors group-hover:bg-forest group-hover:text-white">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="mt-2.5 block text-xs font-bold text-ink">{item}</span>
                    <span className="mt-0.5 block text-[10px] text-muted">Explore causes</span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-teal-800 bg-slate-900 p-7 text-white lg:col-span-1 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-400">Why FundFlow</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold leading-snug">
              Good grows better together.
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Meaningful change begins when communities have a reliable platform to bring people together around the things that matter.
            </p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 hover:underline">
              <span>Learn our principles</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {[
            [
              '“I didn’t think our little idea would reach so many people. Now our students have a place to learn after school.”',
              'Maya Patel',
              'Campaign organizer',
            ],
            [
              '“It feels good knowing every contribution brings clean water a little closer to home.”',
              'Rohan Mehta',
              'Community supporter',
            ],
          ].map(([quote, name, detail], index) => (
            <Reveal
              key={name}
              delay={(index + 1) * 60}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              <div>
                <p className="text-sm font-medium leading-relaxed text-slate-700">{quote}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal-50 font-bold text-forest text-xs border border-teal-100">
                  {name[0]}
                </span>
                <div>
                  <div className="text-xs font-bold text-ink">{name}</div>
                  <div className="text-[11px] text-muted">{detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50/80 to-emerald-50/80 p-8 sm:flex-row sm:items-center sm:p-10 shadow-xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-forest">Ready to begin</p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">
              Have a community project in mind?
            </h2>
            <p className="mt-1.5 text-xs text-slate-600">
              Start your campaign in minutes and receive contributions toward your goal.
            </p>
          </div>
          <Link to="/register">
            <Button size="lg">
              <span>Start your campaign</span>
              <ArrowDownRight size={15} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
