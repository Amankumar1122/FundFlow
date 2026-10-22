import { ArrowUpRight, HeartHandshake, Menu, UserRound, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Button from '../common/Button'

const navLink = ({ isActive }) =>
  `text-xs font-semibold uppercase tracking-wider transition-colors hover:text-[#245bdb] ${
    isActive ? 'text-[#245bdb] font-bold' : 'text-[#667085]'
  }`

export default function Navbar() {
  const { user, logout, backendOnline } = useApp()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 8)
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-150 ${
        scrolled
          ? 'border-[#d8e3f0] bg-white/95 shadow-2xs backdrop-blur-md'
          : 'border-[#d8e3f0] bg-white'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#245bdb] text-white shadow-xs">
              <HeartHandshake size={18} />
            </span>
            <span className="font-sans text-base font-extrabold tracking-tight text-[#101820]">
              Fund<span className="text-[#245bdb]">Flow</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <NavLink to="/explore" className={navLink}>Explore</NavLink>
            <NavLink to="/about" className={navLink}>Our Story</NavLink>
            <NavLink to="/contact" className={navLink}>Contact</NavLink>
          </nav>
        </div>

        <div className="hidden items-center gap-3.5 md:flex">
          {backendOnline && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eef3fc] px-2.5 py-1 text-[11px] font-semibold text-[#245bdb] border border-[#d8e3f0]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live API</span>
            </span>
          )}
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 rounded-lg border border-[#d8e3f0] bg-white px-3 py-1.5 text-xs font-semibold text-[#101820] hover:bg-[#f5f7fa] transition-colors"
              >
                <UserRound size={14} className="text-[#667085]" />
                <span>{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="rounded bg-[#eef3fc] px-1 py-0.2 text-[9px] font-bold uppercase text-[#245bdb] border border-[#d8e3f0]">
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
              <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-[#667085] hover:text-[#101820] transition-colors">
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
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#d8e3f0] text-[#101820] hover:bg-[#f5f7fa] md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#d8e3f0] bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
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
                  `rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-[#eef3fc] text-[#245bdb]' : 'text-[#667085] hover:bg-[#f5f7fa] hover:text-[#101820]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="my-2 border-t border-[#d8e3f0]" />
            {user ? (
              <>
                <Link
                  onClick={closeMenu}
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#101820] hover:bg-[#f5f7fa]"
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
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#101820] hover:bg-[#f5f7fa]"
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
