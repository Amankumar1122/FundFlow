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

  const change = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    setSaved(false)
  }

  const submit = (event) => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      setError('Please enter a name with at least 2 characters.')
      return
    }
    setError('')
    try {
      updateProfile(form)
      setSaved(true)
    } catch (err) {
      setError(err.message)
      notify(err.message, 'error')
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Account Preferences</p>
      <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">Profile & settings</h1>
      <p className="mt-1 text-xs text-[#667085]">Manage your platform identity and communication details.</p>

      <form onSubmit={submit} className="mt-6 max-w-2xl rounded-xl border border-[#d8e3f0] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="mb-5 flex items-center gap-4 border-b border-[#e9eef2] pb-5">
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
            <UserRound size={22} />
          </span>
          <div>
            <p className="text-sm font-bold text-[#101820]">{user.name}</p>
            <p className="mt-0.5 text-xs text-[#667085]">{user.email}</p>
            <span className="mt-1 inline-block rounded bg-[#eef3fc] px-2 py-0.5 text-[10px] font-semibold text-[#245bdb] border border-[#d8e3f0]">
              {user.role === 'admin' ? 'Administrator' : 'Standard Member'}
            </span>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            id="name"
            name="name"
            label="Display name"
            required
            maxLength="60"
            value={form.name}
            onChange={change}
          />
          <FormField
            id="email"
            label="Email address"
            type="email"
            value={user.email}
            disabled
            hint="Email modification is managed via security policy."
          />
          <FormField
            id="location"
            name="location"
            label="Location"
            maxLength="80"
            value={form.location}
            onChange={change}
            placeholder="e.g. Mumbai, Maharashtra"
          />
          <FormField
            id="bio"
            name="bio"
            label="Professional / Community bio"
            as="textarea"
            maxLength="240"
            value={form.bio}
            onChange={change}
            placeholder="Share your focus areas and background in community initiatives..."
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e9eef2] pt-4">
          <Button type="submit">Save changes</Button>
          {saved && (
            <span role="status" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={15} /> Changes saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
