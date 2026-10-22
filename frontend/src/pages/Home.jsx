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
      {/* Enterprise SaaS Hero Section */}
      <section className="border-b border-[#d8e3f0] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-20 lg:px-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#d8e3f0] bg-[#eef3fc] px-3 py-1 text-xs font-bold text-[#245bdb]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#245bdb]" />
              <span className="tracking-wider">ENTERPRISE CROWDFUNDING INFRASTRUCTURE</span>
            </div>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-[#101820] sm:text-4xl lg:text-5xl">
              Big change starts with a <span className="text-[#245bdb]">little help.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#667085] sm:text-base">
              FundFlow provides reliable, transparent fundraising technology for verified community initiatives across India. Transparent goals, direct impact tracking, and audited disbursements.
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
            <div className="mt-8 flex items-center gap-3 text-xs text-[#667085]">
              <ShieldCheck size={16} className="text-[#245bdb]" />
              <span>Multi-tier admin verification • 100% transparent milestone tracking</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-white shadow-card">
              <img
                src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=85"
                alt="Children learning together in a bright classroom"
                className="h-[280px] w-full object-cover sm:h-[340px]"
                loading="eager"
              />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#eef3fc] px-2.5 py-1 text-[11px] font-semibold text-[#245bdb] border border-[#d8e3f0]">
                    Verified Initiative
                  </span>
                  <span className="text-xs font-semibold text-[#667085]">Education Sector</span>
                </div>
                <h3 className="mt-2 text-base font-bold text-[#101820]">
                  Empower Young Learners
                </h3>
                <p className="mt-1 text-xs text-[#667085]">
                  Deploying after-school learning infrastructure and digital books for children in community centers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise KPI Metrics Bar */}
      <section className="border-b border-[#d8e3f0] bg-[#f5f7fa]" aria-label="FundFlow impact metrics">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {[
              [approved.length, '', 'active campaigns'],
              [donations.length, '', 'acts of kindness'],
              [Math.round(total / 1000), '₹', 'thousand raised'],
              [100, '', 'people-powered'],
            ].map(([value, prefix, label], index) => (
              <Reveal key={label} delay={index * 40} className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
                <div className="text-2xl font-extrabold tracking-tight text-[#101820] sm:text-3xl tabular-nums">
                  <AnimatedNumber
                    value={value}
                    prefix={prefix}
                    suffix={label === 'people-powered' ? '%' : label === 'acts of kindness' ? '+' : ''}
                  />
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-[#667085]">{label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable Campaign Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Verified Causes</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#101820] sm:text-3xl">
              Causes worth showing up for
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#667085] sm:text-sm">
              Discover audited campaigns initiated by verified community leaders and organizations.
            </p>
          </div>
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#245bdb] hover:underline">
            <span>See every campaign</span>
            <ArrowRight size={14} />
          </Link>
        </Reveal>

        <div className="mt-6 rounded-xl border border-[#d8e3f0] bg-white p-4 shadow-2xs sm:p-5">
          <label className="relative block max-w-md">
            <span className="sr-only">Search campaigns on this page</span>
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
            <input
              aria-label="Search campaigns on this page"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search causes, places, or ideas..."
              className="w-full rounded-lg border border-[#d8e3f0] bg-[#f5f7fa] py-2 pl-10 pr-4 text-xs text-[#101820] outline-none transition focus:border-[#245bdb] focus:bg-white focus:ring-2 focus:ring-[#245bdb]/15"
            />
          </label>
          <div className="mt-3.5 flex flex-wrap gap-2" aria-label="Filter campaigns by category">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  category === item
                    ? 'bg-[#245bdb] text-white shadow-2xs'
                    : 'border border-[#d8e3f0] bg-white text-[#667085] hover:border-[#cbd5e1] hover:text-[#101820]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {featured.length ? (
          <>
            <p className="mb-4 mt-6 text-xs text-[#667085]" aria-live="polite">
              Showing <strong className="text-[#101820] tabular-nums">{featured.length}</strong>
              {matches.length > featured.length ? (
                <> of <strong className="text-[#101820] tabular-nums">{matches.length}</strong></>
              ) : ''}{' '}
              {matches.length === 1 ? 'campaign' : 'campaigns'}
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((campaign, index) => (
                <Reveal key={campaign.id} delay={index * 50}>
                  <CampaignCard campaign={campaign} />
                </Reveal>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-[#d8e3f0] bg-white p-10 text-center">
            <h3 className="text-base font-bold text-[#101820]">No causes match just yet</h3>
            <p className="mt-1 text-xs text-[#667085]">Try another keyword or select a different category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setCategory('All causes')
              }}
              className="mt-4 rounded-lg border border-[#245bdb] px-4 py-2 text-xs font-semibold text-[#245bdb] hover:bg-[#eef3fc]"
            >
              Clear search and filters
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to={category === 'All causes' ? '/explore' : `/explore?category=${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d8e3f0] bg-white px-5 py-2.5 text-xs font-semibold text-[#101820] shadow-2xs hover:bg-[#f5f7fa] hover:border-[#cbd5e1]"
          >
            <span>Browse all campaigns</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="border-y border-[#d8e3f0] bg-[#f5f7fa] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Categorized Giving</p>
            <h2 className="mt-1 text-2xl font-bold text-[#101820]">Explore causes by operational sector</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#667085]">
              Select an impact area to review verified community funding initiatives.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {categories.slice(1).map((item, index) => {
              const Icon = categoryIcons[item] || Sparkles
              return (
                <Reveal as="div" key={item} delay={index * 30}>
                  <Link
                    to={`/explore?category=${encodeURIComponent(item)}`}
                    className="category-tile group block rounded-xl border border-[#d8e3f0] bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-[#245bdb] hover:shadow-2xs"
                  >
                    <span className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] transition-colors group-hover:bg-[#245bdb] group-hover:text-white">
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="mt-2.5 block text-xs font-bold text-[#101820]">{item}</span>
                    <span className="mt-0.5 block text-[10px] text-[#667085]">Explore sector</span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Platform Capability Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-[#101820] p-7 text-white lg:col-span-1 shadow-card">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#245bdb]">
              Governance & Integrity
            </div>
            <h2 className="mt-4 text-2xl font-extrabold leading-snug">
              Built on transparency and accountability.
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Community projects thrive when backers have confidence that every rupee is directed toward verified project milestones.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#245bdb] hover:underline">
              <span>Read platform architecture</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {[
            [
              '“With FundFlow’s clear milestone tracking, our neighborhood after-school reading program reached 100% of its goal in two weeks.”',
              'Maya Patel',
              'Verified Campaign Organizer',
            ],
            [
              '“The transparent reporting and direct progress metrics give our supporters confidence in our rural drinking water installations.”',
              'Rohan Mehta',
              'Clean Water Initiative Lead',
            ],
          ].map(([quote, name, detail], index) => (
            <Reveal
              key={name}
              delay={(index + 1) * 50}
              className="flex flex-col justify-between rounded-xl border border-[#d8e3f0] bg-white p-6 shadow-2xs"
            >
              <div>
                <p className="text-xs font-medium leading-relaxed text-[#101820]">{quote}</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-[#e9eef2] pt-4">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef3fc] font-bold text-[#245bdb] text-xs border border-[#d8e3f0]">
                  {name[0]}
                </span>
                <div>
                  <div className="text-xs font-bold text-[#101820]">{name}</div>
                  <div className="text-[11px] text-[#667085]">{detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Enterprise Call to Action Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-[#d8e3f0] bg-[#eef3fc] p-8 sm:flex-row sm:items-center sm:p-10 shadow-2xs">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Ready to Launch</p>
            <h2 className="mt-1 text-xl font-extrabold text-[#101820] sm:text-2xl">
              Have a community project in mind?
            </h2>
            <p className="mt-1 text-xs text-[#667085]">
              Submit your initiative for review and begin gathering contributions in minutes.
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
