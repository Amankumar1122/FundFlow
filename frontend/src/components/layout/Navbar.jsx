import { ArrowUpRight, HeartHandshake, Menu, UserRound, X, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-forest ${
    isActive ? 'text-forest font-semibold' : 'text-slate-600'
  }`

export default function Navbar() {
  const { user, logout, backendOnline } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 10)
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-200 ${
        scrolled
          ? 'border-slate-200 bg-white/95 shadow-xs backdrop-blur-md'
          : 'border-slate-200/80 bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white shadow-xs">
              <HeartHandshake size={20} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Fund<span className="text-forest">Flow</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <NavLink to="/explore" className={navLink}>Explore</NavLink>
            <NavLink to="/about" className={navLink}>Our story</NavLink>
            <NavLink to="/contact" className={navLink}>Contact</NavLink>
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {backendOnline && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
              <CheckCircle2 size={10} /> Live API
            </span>
          )}
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <UserRound size={15} className="text-slate-500" />
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="rounded bg-teal-100 px-1 py-0.2 text-[9px] font-bold uppercase text-teal-800">
                    Admin
                  </span>
                )}
              </Link>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-forest transition-colors">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm">
                  <span>Start a campaign</span>
                  <ArrowUpRight size={13} />
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {[
              ['Explore campaigns', '/explore'],
              ['Our story', '/about'],
              ['Contact', '/contact'],
            ].map(([label, to]) => (
              <NavLink
                onClick={closeMenu}
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-teal-50 text-forest font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-slate-100" />
            {user ? (
              <>
                <Link
                  onClick={closeMenu}
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  My dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    closeMenu()
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  onClick={closeMenu}
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link onClick={closeMenu} to="/register" className="mt-1">
                  <Button className="w-full">Create an account</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
