import { ArrowLeft, CheckCircle2, ImagePlus, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import ProgressBar from '../components/common/ProgressBar'
import { categories } from '../data/seed'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../hooks/useCurrency'

const blank = { title: '', category: 'Education', location: '', goal: '', endDate: '', image: '', description: '', story: '' }

export default function CreateCampaign() {
  const { createCampaign, notify } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(blank)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const preview = useMemo(() => ({
    ...form,
    title: form.title || 'Your campaign title',
    category: form.category,
    location: form.location || 'Your community',
    goal: Number(form.goal) || 50000,
    raised: 0,
    backers: 0,
    daysLeft: 30,
    organizer: 'You',
    image: form.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
    description: form.description || 'A short description of your initiative will appear here.',
  }), [form])

  const update = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setErrors((prev) => ({ ...prev, [event.target.name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (form.title.trim().length < 8) next.title = 'Give your campaign a clear title (at least 8 characters).'
    if (!form.location.trim()) next.location = 'Add the community or place this campaign supports.'
    if (Number(form.goal) < 500 || Number(form.goal) > 100000000) next.goal = 'Enter a goal between ₹500 and ₹10 crore.'
    if (!form.endDate || form.endDate <= today) next.endDate = 'Choose an end date in the future.'
    if (form.image && !/^https?:\/\/.+\..+/.test(form.image)) next.image = 'Enter a valid image URL starting with http:// or https://.'
    if (form.description.trim().length < 40) next.description = 'Tell supporters a little more (at least 40 characters).'
    if (form.story.trim().length < 40) next.story = 'Share why this matters (at least 40 characters).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      notify('Please check the highlighted campaign details.', 'error')
      return
    }
    setLoading(true)
    try {
      const created = createCampaign({
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        goal: Number(form.goal),
      })
      navigate(`/dashboard/campaigns`, { state: { createdId: created.id } })
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link to="/dashboard/campaigns" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#245bdb]">
        <ArrowLeft size={14} /> Back to my campaigns
      </Link>
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Campaign Wizard</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">Start a campaign</h1>
        <p className="mt-1 text-xs text-[#667085]">Provide clear details and an impact description to submit your initiative for moderation.</p>
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_340px]">
        <form onSubmit={submit} noValidate className="space-y-4.5 rounded-xl border border-[#d8e3f0] bg-white p-5 sm:p-6 shadow-2xs">
          <div className="flex items-start gap-2.5 rounded-lg border border-[#d8e3f0] bg-[#eef3fc] p-3.5 text-xs leading-5 text-[#245bdb]">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>Initiatives are saved to your local session and submitted to the moderation queue. Zero real funds are processed.</p>
          </div>

          <FormField
            id="title"
            name="title"
            label="Campaign title"
            required
            maxLength="90"
            value={form.title}
            onChange={update}
            placeholder="e.g. Clean drinking water filtration units for village school"
            error={errors.title}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="category"
              name="category"
              label="Category"
              as="select"
              value={form.category}
              onChange={update}
              options={categories.slice(1)}
            />
            <FormField
              id="location"
              name="location"
              label="Community or location"
              required
              maxLength="80"
              value={form.location}
              onChange={update}
              placeholder="e.g. Pune, Maharashtra"
              error={errors.location}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="goal"
              name="goal"
              label="Fundraising goal (₹)"
              type="number"
              required
              min="500"
              max="100000000"
              value={form.goal}
              onChange={update}
              placeholder="50000"
              error={errors.goal}
            />
            <FormField
              id="endDate"
              name="endDate"
              label="Campaign end date"
              type="date"
              required
              min={today}
              value={form.endDate}
              onChange={update}
              error={errors.endDate}
            />
          </div>

          <FormField
            id="image"
            name="image"
            label="Cover image URL"
            type="url"
            value={form.image}
            onChange={update}
            placeholder="https://images.unsplash.com/..."
            hint="Provide a direct public image URL; leave blank to use a default cover."
            error={errors.image}
          />

          <FormField
            id="description"
            name="description"
            label="Campaign summary"
            as="textarea"
            required
            minLength="40"
            maxLength="400"
            value={form.description}
            onChange={update}
            placeholder="Describe your initiative's target objective in 2-3 clear sentences..."
            hint={`${form.description.length}/400 characters`}
            error={errors.description}
          />

          <FormField
            id="story"
            name="story"
            label="Why does this matter?"
            as="textarea"
            required
            minLength="40"
            maxLength="1200"
            value={form.story}
            onChange={update}
            placeholder="Detail the problem, intended milestone outcomes, and how backing funds will be applied..."
            hint={`${form.story.length}/1200 characters`}
            error={errors.story}
          />

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#e9eef2] pt-4 sm:flex-row">
            <Link to="/dashboard/campaigns" className="rounded-lg border border-[#d8e3f0] px-4 py-2 text-center text-xs font-semibold text-[#667085] hover:bg-[#f5f7fa]">
              Cancel
            </Link>
            <Button type="submit" loading={loading}>
              Submit for review <CheckCircle2 size={15} />
            </Button>
          </div>
        </form>

        {/* Live Preview Console */}
        <aside className="rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs xl:sticky xl:top-20">
          <div className="flex items-center gap-2 text-xs font-bold text-[#101820]">
            <ImagePlus size={15} className="text-[#245bdb]" />
            <span>Live specification preview</span>
          </div>
          <p className="mt-1 text-[11px] text-[#667085]">This card reflects how your initiative will display in discovery.</p>
          <div className="mt-3 overflow-hidden rounded-lg border border-[#d8e3f0] bg-white">
            <img
              src={preview.image}
              alt=""
              onError={(event) => {
                event.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80'
              }}
              className="h-36 w-full object-cover"
            />
            <div className="p-3.5">
              <span className="rounded-md bg-[#eef3fc] px-2 py-0.5 text-[10px] font-bold text-[#245bdb] border border-[#d8e3f0]">
                {preview.category}
              </span>
              <h2 className="mt-2 text-xs font-bold text-[#101820] line-clamp-1">{preview.title}</h2>
              <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[#667085]">{preview.description}</p>
              <div className="mt-3 text-xs font-bold text-[#101820] tabular-nums">
                {formatCurrency(0)} <span className="text-[10px] font-normal text-[#667085]">of {formatCurrency(preview.goal)}</span>
              </div>
              <ProgressBar raised={0} goal={preview.goal} className="mt-1.5" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
