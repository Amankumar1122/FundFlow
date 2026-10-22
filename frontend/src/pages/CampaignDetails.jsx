import { ArrowLeft, CalendarDays, CheckCircle2, Heart, MapPin, ShieldCheck, Users } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import ProgressBar from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

export default function CampaignDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { campaigns, donations, user, donate, notify } = useApp()
  const campaign = campaigns.find((item) => String(item.id) === String(id))
  const [amount, setAmount] = useState('500')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  if (!campaign || (campaign.status !== 'approved' && campaign.organizerId !== user?.id && user?.role !== 'admin')) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-[#101820]">This campaign is not available</h1>
        <p className="mt-2 text-xs text-[#667085]">It may have ended or is still undergoing moderation review.</p>
        <Link to="/explore" className="mt-5 inline-block text-xs font-bold text-[#245bdb] hover:underline">
          Explore active campaigns
        </Link>
      </div>
    )
  }

  const percent = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
  const recentDonations = donations.filter((item) => String(item.campaignId) === String(id)).slice(0, 5)

  const handleDonate = async (event) => {
    event.preventDefault()
    if (!user) return navigate('/login', { state: { from: { pathname: `/campaigns/${id}` } } })
    setLoading(true)
    try {
      donate(id, amount, message)
      setMessage('')
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#245bdb]">
        <ArrowLeft size={14} /> Back to all campaigns
      </Link>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Cover Media */}
          <div className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-[#e9eef2]">
            <img
              src={campaign.image}
              alt={campaign.title}
              className="max-h-[460px] min-h-[260px] w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
              }}
            />
          </div>

          {/* Heading & Metadata */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#d8e3f0] bg-[#eef3fc] px-2.5 py-1 text-xs font-bold text-[#245bdb]">
                {campaign.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={13} /> {campaign.location}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#101820] sm:text-3xl">
              {campaign.title}
            </h1>
            <p className="mt-2 text-xs text-[#667085]">
              Organized by <strong className="text-[#101820]">{campaign.organizer}</strong>
            </p>
          </div>

          {/* Metric Bar */}
          <div className="mt-6 flex gap-8 border-y border-[#d8e3f0] py-4 text-xs">
            <span className="flex items-center gap-2 text-[#667085]">
              <Users size={16} className="text-[#245bdb]" />
              <strong className="text-[#101820] tabular-nums">{campaign.backers}</strong> supporters
            </span>
            <span className="flex items-center gap-2 text-[#667085]">
              <CalendarDays size={16} className="text-[#245bdb]" />
              <strong className="text-[#101820] tabular-nums">{campaign.daysLeft}</strong> days left
            </span>
          </div>

          {/* Narrative & Details */}
          <div className="mt-6 space-y-4">
            <h2 className="text-base font-bold text-[#101820]">Why this matters</h2>
            <p className="whitespace-pre-line text-xs leading-6 text-[#667085]">{campaign.description}</p>
            {campaign.story && (
              <p className="whitespace-pre-line text-xs leading-6 text-[#667085]">{campaign.story}</p>
            )}
          </div>

          {/* Organizer Card */}
          <div className="mt-8 rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef3fc] font-bold text-[#245bdb] border border-[#d8e3f0] text-xs">
                {campaign.organizer.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </span>
              <div>
                <div className="text-xs font-bold text-[#101820]">{campaign.organizer}</div>
                <div className="text-[11px] text-[#667085]">Campaign Organizer • {campaign.location}</div>
              </div>
              <CheckCircle2 size={18} className="ml-auto text-[#245bdb]" />
            </div>
          </div>

          {/* Recent Supporters Feed */}
          <div className="mt-8">
            <h2 className="text-base font-bold text-[#101820]">Recent supporters</h2>
            <div className="mt-3 divide-y divide-[#e9eef2] rounded-xl border border-[#d8e3f0] bg-white px-4">
              {recentDonations.length ? (
                recentDonations.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#eef3fc] font-bold text-[#245bdb] text-xs">
                      {item.donorName[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#101820]">{item.donorName}</p>
                      {item.message && <p className="mt-0.5 truncate text-[11px] text-[#667085]">“{item.message}”</p>}
                    </div>
                    <span className="text-xs font-bold text-[#245bdb] tabular-nums">{formatCurrency(item.amount)}</span>
                  </div>
                ))
              ) : (
                <p className="py-4 text-xs text-[#667085]">Be the first to support this verified initiative.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Contribution Console */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-card">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-2xl font-extrabold text-[#101820] tabular-nums">
                  {formatCurrency(campaign.raised)}
                </div>
                <div className="mt-0.5 text-xs text-[#667085]">
                  raised of <span className="tabular-nums">{formatCurrency(campaign.goal)}</span>
                </div>
              </div>
              <span className="text-base font-bold text-[#245bdb] tabular-nums">{percent}%</span>
            </div>

            <ProgressBar raised={campaign.raised} goal={campaign.goal} className="mt-3" />

            <div className="mt-2.5 flex justify-between text-[11px] text-[#667085]">
              <span><strong className="text-[#101820]">{campaign.backers}</strong> contributors</span>
              <span><strong className="text-[#101820]">{campaign.daysLeft}</strong> days left</span>
            </div>

            <div className="my-5 border-t border-[#e9eef2]" />

            <div className="flex items-center gap-2 text-xs font-bold text-[#101820]">
              <Heart size={15} className="text-[#245bdb]" />
              {campaign.status === 'approved' ? 'Make a contribution' : 'Campaign awaiting review'}
            </div>

            {campaign.status !== 'approved' && (
              <p className="mt-2 text-xs leading-relaxed text-[#667085]">
                This campaign is currently in moderation and cannot receive contributions.
              </p>
            )}

            {campaign.status === 'approved' && (
              <>
                {/* Explicit Demo Disclaimer Box */}
                <div className="mt-3 rounded-lg border border-[#d8e3f0] bg-[#eef3fc] p-3 text-[11px] leading-5 text-[#245bdb]">
                  <strong>Simulation Environment:</strong> Contributions are recorded for platform demonstration only. No real money or payment gateway charges take place.
                </div>

                <form onSubmit={handleDonate} className="mt-4 space-y-3.5">
                  <div className="grid grid-cols-3 gap-2">
                    {[250, 500, 1000].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(String(value))}
                        className={`rounded-lg border py-2 text-xs font-bold transition ${
                          Number(amount) === value
                            ? 'border-[#245bdb] bg-[#eef3fc] text-[#245bdb]'
                            : 'border-[#d8e3f0] text-[#667085] hover:border-[#cbd5e1] hover:text-[#101820]'
                        }`}
                      >
                        ₹{value}
                      </button>
                    ))}
                  </div>

                  <FormField
                    id="amount"
                    label="Your contribution (₹)"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />

                  <FormField
                    id="message"
                    label="Leave a note (optional)"
                    as="textarea"
                    rows="2"
                    maxLength="180"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a message of support..."
                  />

                  <Button type="submit" loading={loading} className="w-full">
                    {user ? 'Add demo donation' : 'Log in to support'}
                  </Button>
                </form>

                <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] text-[#667085]">
                  <ShieldCheck size={13} />
                  <span>Demonstration records only • Zero transaction fees</span>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
