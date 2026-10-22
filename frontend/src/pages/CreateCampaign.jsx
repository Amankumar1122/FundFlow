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
  const preview = useMemo(() => ({ ...form, title: form.title || 'Your campaign title', category: form.category, location: form.location || 'Your community', goal: Number(form.goal) || 50000, raised: 0, backers: 0, daysLeft: 30, organizer: 'You', image: form.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80', description: form.description || 'A short description of your idea will appear here.' }), [form])
  const update = (event) => { setForm((prev) => ({ ...prev, [event.target.name]: event.target.value })); setErrors((prev) => ({ ...prev, [event.target.name]: '' })) }
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
    if (!validate()) { notify('Please check the highlighted campaign details.', 'error'); return }
    setLoading(true)
    try { const created = createCampaign({ ...form, title: form.title.trim(), location: form.location.trim(), goal: Number(form.goal) }); navigate(`/dashboard/campaigns`, { state: { createdId: created.id } }) } catch (error) { notify(error.message, 'error') } finally { setLoading(false) }
  }
  return <div><Link to="/dashboard/campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-forest"><ArrowLeft size={16} />My campaigns</Link><div className="mt-4"><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">Make your idea real</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Start a campaign</h1><p className="mt-2 text-sm text-muted">A clear story helps your community understand how to show up.</p></div>
    <div className="mt-7 grid items-start gap-6 xl:grid-cols-[1fr_340px]"><form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="flex items-start gap-3 rounded-xl bg-mint/60 p-4 text-xs leading-5 text-forest"><Info size={17} className="mt-0.5 shrink-0" /><p>This demo campaign is saved in your browser and enters a simulated review queue. No real fundraising or payments take place.</p></div>
      <FormField id="title" name="title" label="Campaign title" required maxLength="90" value={form.title} onChange={update} placeholder="What good are you bringing to life?" error={errors.title} />
      <div className="grid gap-5 sm:grid-cols-2"><FormField id="category" name="category" label="Category" as="select" value={form.category} onChange={update} options={categories.slice(1)} /><FormField id="location" name="location" label="Community or location" required maxLength="80" value={form.location} onChange={update} placeholder="Pune, Maharashtra" error={errors.location} /></div>
      <div className="grid gap-5 sm:grid-cols-2"><FormField id="goal" name="goal" label="Fundraising goal (₹)" type="number" required min="500" max="100000000" value={form.goal} onChange={update} placeholder="50000" error={errors.goal} /><FormField id="endDate" name="endDate" label="Campaign end date" type="date" required min={today} value={form.endDate} onChange={update} error={errors.endDate} /></div>
      <FormField id="image" name="image" label="Cover image URL" type="url" value={form.image} onChange={update} placeholder="https://images.unsplash.com/..." hint="Use a public image URL; leave blank to use a sample image." error={errors.image} />
      <FormField id="description" name="description" label="Campaign summary" as="textarea" required minLength="40" maxLength="400" value={form.description} onChange={update} placeholder="In a few sentences, tell people what your campaign will do." hint={`${form.description.length}/400 characters`} error={errors.description} />
      <FormField id="story" name="story" label="Why does this matter?" as="textarea" required minLength="40" maxLength="1200" value={form.story} onChange={update} placeholder="Share the story behind your idea and how support will help." hint={`${form.story.length}/1200 characters`} error={errors.story} />
      <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row"><Link to="/dashboard/campaigns" className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-muted hover:bg-paper">Cancel</Link><Button type="submit" loading={loading}>Submit for review <CheckCircle2 size={16} /></Button></div>
    </form>
      <aside className="rounded-2xl border border-slate-200 bg-white p-5 xl:sticky xl:top-24"><div className="flex items-center gap-2 text-sm font-bold text-ink"><ImagePlus size={17} className="text-forest" />Live preview</div><p className="mt-1 text-xs text-muted">This is how your campaign will look.</p><div className="mt-4 overflow-hidden rounded-2xl border border-slate-100"><img src={preview.image} alt="" onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80' }} className="h-40 w-full object-cover" /><div className="p-4"><span className="rounded-full bg-mint px-2.5 py-1 text-[10px] font-bold text-forest">{preview.category}</span><h2 className="mt-3 font-display text-base font-extrabold text-ink">{preview.title}</h2><p className="mt-2 line-clamp-3 text-xs leading-5 text-muted">{preview.description}</p><div className="mt-4 font-bold text-ink">{formatCurrency(0)} <span className="text-xs font-normal text-muted">of {formatCurrency(preview.goal)}</span></div><ProgressBar raised={0} goal={preview.goal} className="mt-2" /></div></div></aside>
    </div>
  </div>
}
