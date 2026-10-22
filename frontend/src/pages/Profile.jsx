import { CheckCircle2, UserRound } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useApp } from '../context/AppContext'

export default function Profile() {
  const { user, updateProfile, notify } = useApp()
  const [form, setForm] = useState({ name: user.name, location: user.location || '', bio: user.bio || '' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const change = (event) => { setForm({ ...form, [event.target.name]: event.target.value }); setSaved(false) }
  const submit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) { setError('Please enter a name with at least 2 characters.'); return }
    setError('')
    try { updateProfile(form); setSaved(true) } catch (err) { setError(err.message); notify(err.message, 'error') }
  }
  return <div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">A little more about you</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Profile & settings</h1><p className="mt-2 text-sm text-muted">Update your demo profile and how you show up in the community.</p>
    <form onSubmit={submit} className="mt-7 max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-6"><span className="grid h-14 w-14 place-items-center rounded-full bg-mint text-forest"><UserRound size={25} /></span><div><p className="font-bold text-ink">{user.name}</p><p className="mt-1 text-xs text-muted">{user.email}</p><p className="mt-1 text-[11px] text-muted">Demo account · stored only in this browser</p></div></div>
      {error && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      <div className="space-y-5"><FormField id="name" name="name" label="Display name" required maxLength="60" value={form.name} onChange={change} /><FormField id="email" label="Email address" type="email" value={user.email} disabled hint="Email changes are not available in the demo." /><FormField id="location" name="location" label="Location" maxLength="80" value={form.location} onChange={change} placeholder="Your city or community" /><FormField id="bio" name="bio" label="A little about you" as="textarea" maxLength="240" value={form.bio} onChange={change} placeholder="What causes matter to you?" /></div>
      <div className="mt-6 flex flex-wrap items-center gap-3"><Button type="submit">Save changes</Button>{saved && <span role="status" className="flex items-center gap-1.5 text-xs font-semibold text-forest"><CheckCircle2 size={16} />Saved to this browser</span>}</div>
    </form>
  </div>
}
