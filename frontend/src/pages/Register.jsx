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
    if (fields.password !== fields.confirm) { setError('Your passwords do not match.'); return }
    if (fields.password.length < 8) { setError('Use at least 8 characters for your password.'); return }
    setLoading(true)
    try { register(fields); navigate('/dashboard') } catch (err) { setError(err.message); notify(err.message, 'error') } finally { setLoading(false) }
  }
  return (
    <div className="grid min-h-[calc(100vh-74px)] lg:grid-cols-2">
      <div className="hidden bg-[#eef3ed] p-12 lg:flex lg:flex-col lg:justify-between"><Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-ink"><HeartHandshake className="text-forest" />FundFlow</Link><div className="max-w-lg"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-forest shadow-sm"><ShieldCheck size={28} /></div><h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-ink">There's room for your good idea here.</h1><p className="mt-4 text-base leading-8 text-muted">Join people who believe that a little help, shared with care, can make a real difference in their communities.</p><div className="mt-7 flex -space-x-2">{['M', 'R', 'A', 'D', 'I'].map((item, i) => <span key={item} className={`grid h-10 w-10 place-items-center rounded-full border-2 border-[#eef3ed] font-bold ${i % 2 ? 'bg-forest text-white' : 'bg-lime text-ink'}`}>{item}</span>)}</div></div><p className="text-xs text-muted">Demo only · Your account is saved in this browser</p></div>
      <div className="flex items-center justify-center px-5 py-12 sm:px-8"><div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-forest"><ArrowLeft size={16} /> Back home</Link>
        <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Join the community</p><h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Let's do some good.</h2><p className="mt-2 text-sm text-muted">Create your demo account to get started.</p></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <FormField id="name" name="name" label="Your name" required minLength="2" maxLength="60" autoComplete="name" value={fields.name} onChange={change} placeholder="Alex Morgan" />
          <FormField id="email" name="email" label="Email address" type="email" required autoComplete="email" value={fields.email} onChange={change} placeholder="you@example.com" />
          <FormField id="password" name="password" label="Create a password" type="password" required minLength="8" autoComplete="new-password" value={fields.password} onChange={change} placeholder="At least 8 characters" />
          <FormField id="confirm" name="confirm" label="Confirm password" type="password" required autoComplete="new-password" value={fields.confirm} onChange={change} placeholder="Type it again" />
          <p className="text-xs leading-5 text-muted">This creates a local demo account in your browser. Do not use a real password.</p>
          <Button type="submit" className="w-full" loading={loading}>Create my account</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-bold text-forest hover:underline">Log in</Link></p>
      </div></div>
    </div>
  )
}
