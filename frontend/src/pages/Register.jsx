import { ArrowLeft, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useApp } from '../context/AppContext'

export default function Register() {
  const { register, notify } = useApp()
  const navigate = useNavigate()
  const [fields, setFields] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const change = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (fields.password !== fields.confirm) {
      setError('Your passwords do not match.')
      return
    }
    if (fields.password.length < 8) {
      setError('Use at least 8 characters for your password.')
      return
    }
    setLoading(true)
    try {
      await register(fields)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      {/* Left Showcase Pane */}
      <div className="hidden bg-[#e9eef2] p-12 lg:flex lg:flex-col lg:justify-between border-r border-[#d8e3f0]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#245bdb] text-white">
            <HeartHandshake size={18} />
          </span>
          <span className="font-sans text-base font-extrabold tracking-tight text-[#101820]">FundFlow</span>
        </Link>

        <div className="max-w-md">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-white text-[#245bdb] border border-[#d8e3f0] shadow-2xs">
            <ShieldCheck size={22} />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold leading-tight text-[#101820]">
            Empower local initiatives through verified fundraising.
          </h1>
          <p className="mt-3 text-xs leading-6 text-[#667085]">
            Join community organizers and backers mobilizing resources for schools, healthcare centers, clean drinking water, and environmental projects.
          </p>
          <div className="mt-6 flex -space-x-1.5">
            {['M', 'R', 'A', 'D', 'I'].map((item, i) => (
              <span
                key={item}
                className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white text-xs font-bold ${
                  i % 2 ? 'bg-[#245bdb] text-white' : 'bg-[#eef3fc] text-[#245bdb]'
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-[#667085]">© FundFlow Inc. • Production Enterprise Platform</p>
      </div>

      {/* Right Registration Card */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm rounded-xl border border-[#d8e3f0] bg-white p-7 shadow-card">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#245bdb]">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Join the Platform</p>
            <h2 className="mt-1 text-xl font-extrabold text-[#101820]">Let's do some good.</h2>
            <p className="mt-1 text-xs text-[#667085]">Create your account to organize campaigns or back causes.</p>
          </div>

          <form onSubmit={submit} className="mt-5 space-y-3.5">
            {error && (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs text-rose-700">
                {error}
              </div>
            )}

            <FormField
              id="name"
              name="name"
              label="Your name"
              required
              minLength="2"
              maxLength="60"
              autoComplete="name"
              value={fields.name}
              onChange={change}
              placeholder="e.g. Sam Rivera"
            />

            <FormField
              id="email"
              name="email"
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={fields.email}
              onChange={change}
              placeholder="you@example.com"
            />

            <FormField
              id="password"
              name="password"
              label="Create a password"
              type="password"
              required
              minLength="8"
              autoComplete="new-password"
              value={fields.password}
              onChange={change}
              placeholder="At least 8 characters"
            />

            <FormField
              id="confirm"
              name="confirm"
              label="Confirm password"
              type="password"
              required
              autoComplete="new-password"
              value={fields.confirm}
              onChange={change}
              placeholder="Re-enter your password"
            />

            <p className="text-[11px] leading-4 text-[#667085]">
              Creates a secure account session synchronized with the backend.
            </p>

            <Button type="submit" className="w-full" loading={loading}>
              Create my account
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-[#667085]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#245bdb] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
