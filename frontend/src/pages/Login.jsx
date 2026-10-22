import { ArrowLeft, HeartHandshake, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login, notify } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const signedIn = login(email, password)
      navigate(location.state?.from?.pathname || (signedIn.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
    } catch (err) { setError(err.message); notify(err.message, 'error') } finally { setLoading(false) }
  }
  return (
    <div className="grid min-h-[calc(100vh-74px)] lg:grid-cols-2">
      <div className="hidden bg-forest p-12 text-white lg:flex lg:flex-col lg:justify-between"><Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold"><HeartHandshake className="text-lime" />FundFlow</Link><div className="max-w-lg"><p className="text-xs font-bold uppercase tracking-[.2em] text-lime">A little good goes a long way</p><h1 className="mt-5 font-display text-5xl font-extrabold leading-tight">Welcome back to the good you do.</h1><p className="mt-5 text-base leading-8 text-white/70">Your community is building something meaningful. Pick up where you left off.</p></div><p className="text-xs text-white/45">FundFlow demo experience · No real money or secure authentication</p></div>
      <div className="flex items-center justify-center px-5 py-12 sm:px-8"><div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-forest"><ArrowLeft size={16} /> Back home</Link>
        <div className="mt-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Your community awaits</p><h2 className="mt-3 font-display text-3xl font-extrabold text-ink">Good to see you again.</h2><p className="mt-2 text-sm text-muted">Log in to continue your FundFlow demo experience.</p></div>
        <form onSubmit={submit} className="mt-7 space-y-5">
          {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <FormField id="email" label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          <FormField id="password" label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="current-password" />
          <div className="flex items-start gap-2 rounded-xl bg-paper p-3 text-xs leading-5 text-muted"><LockKeyhole size={15} className="mt-0.5 shrink-0 text-forest" />Demo only. Use any registered email and a password. The preloaded admin demo account is <strong>admin@fundflow.demo</strong>.</div>
          <Button type="submit" className="w-full" loading={loading}>Log in to FundFlow</Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">New to FundFlow? <Link to="/register" className="font-bold text-forest hover:underline">Create an account</Link></p>
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted"><span className="flex items-center gap-1"><Mail size={14} /> No email verification</span><span>·</span><span>Never use a real password</span></div>
      </div></div>
    </div>
  )
}
