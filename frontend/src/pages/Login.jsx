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
              <span>Role-based access control (Admin & User workflows)</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">FundFlow Platform Demonstration • Evaluation Environment</p>
      </div>

      {/* Right Login Card */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm rounded-xl border border-[#d8e3f0] bg-white p-7 shadow-card">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#245bdb]">
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Identity Authentication</p>
            <h2 className="mt-1 text-xl font-extrabold text-[#101820]">Good to see you again.</h2>
            <p className="mt-1 text-xs text-[#667085]">Sign in to access your dashboard controls.</p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {error && (
              <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700">
                {error}
              </div>
            )}

            <FormField
              id="email"
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <FormField
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <div className="flex items-start gap-2 rounded-lg border border-[#d8e3f0] bg-[#eef3fc] p-3 text-[11px] leading-4 text-[#245bdb]">
              <LockKeyhole size={14} className="mt-0.5 shrink-0" />
              <div>
                Demo admin credentials: <strong className="font-bold">admin@fundflow.demo</strong> (password: <strong>admin123</strong>).
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              Log in to FundFlow
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-[#667085]">
            New to FundFlow?{' '}
            <Link to="/register" className="font-bold text-[#245bdb] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
