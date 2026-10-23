import { ArrowLeft, HeartHandshake } from 'lucide-react'
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
      const signedIn = await login(email, password)
      navigate(location.state?.from?.pathname || (signedIn.role === 'admin' ? '/admin' : '/dashboard'), { replace: true })
    } catch (err) {
      setError(err.message)
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-65px)] lg:grid-cols-2">
      {/* Enterprise Left Showcase Pane */}
      <div className="hidden bg-[#101820] p-12 text-white lg:flex lg:flex-col lg:justify-between border-r border-white/10">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#245bdb] text-white">
            <HeartHandshake size={18} />
          </span>
          <span className="font-sans text-base font-extrabold tracking-tight text-white">FundFlow</span>
        </Link>

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#245bdb]">
            Enterprise Access
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white">
            Transparent community crowdfunding console.
          </h1>
          <p className="mt-3 text-xs leading-6 text-slate-300">
            Log in to manage community campaigns, track incoming contributions, or moderate submitted platform initiatives.
          </p>

          <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#245bdb]" />
              <span>Stateless JWT authentication (Spring Security 6)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#245bdb]" />
              <span>Spring Data JPA • Hibernate ORM persistence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#245bdb]" />
              <span>Fintech-grade audit logging & real-time analytics</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">© FundFlow Inc. • Production Enterprise Platform</p>
      </div>

      {/* Right Login Card */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm rounded-xl border border-[#d8e3f0] bg-white p-7 shadow-card">
          <div className="flex items-center justify-between">
            <span className="inline-block rounded-md bg-[#eef3fc] px-2.5 py-1 text-[11px] font-bold text-[#245bdb]">
              Secure Access
            </span>
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-[#667085] hover:text-[#101820]">
              <ArrowLeft size={13} /> Back
            </Link>
          </div>

          <h2 className="mt-4 font-sans text-xl font-extrabold tracking-tight text-[#101820]">
            Good to see you again.
          </h2>
          <p className="mt-1 text-xs text-[#667085]">Sign in to access your dashboard and saved projects.</p>

          {error && (
            <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <FormField
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@domain.com"
            />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Button type="submit" variant="primary" className="w-full mt-2" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign in to FundFlow'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[#667085]">
            Need a FundFlow account?{' '}
            <Link to="/register" className="font-semibold text-[#245bdb] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
