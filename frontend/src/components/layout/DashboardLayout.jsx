import { BadgeIndianRupee, CircleHelp, Compass, Heart, LayoutDashboard, Leaf, LogOut, Plus, Settings, ShieldCheck, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function DashboardLayout({ admin = false }) {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const links = admin ? [
    ['Overview', '/admin', LayoutDashboard],
    ['Campaign review', '/admin/campaigns', ShieldCheck],
    ['People', '/admin/users', Users],
    ['Donations', '/admin/donations', BadgeIndianRupee],
  ] : [
    ['Overview', '/dashboard', LayoutDashboard],
    ['My campaigns', '/dashboard/campaigns', Leaf],
    ['My donations', '/dashboard/donations', Heart],
    ['Profile & settings', '/dashboard/profile', Settings],
  ]

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8 lg:py-10">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:sticky lg:top-20">
        <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 font-bold text-forest border border-teal-100 text-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-ink">{user?.name}</div>
            <div className="truncate text-[11px] text-muted">
              {admin ? 'Platform Admin' : user?.email}
            </div>
          </div>
        </div>

        <nav className="mt-3 flex gap-1 overflow-x-auto lg:flex-col" aria-label="Sidebar navigation">
          {links.map(([label, to, Icon]) => (
            <NavLink
              end={to === '/dashboard' || to === '/admin'}
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-forest font-bold border border-teal-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {!admin && (
          <NavLink
            to="/dashboard/create"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-forest px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#115e59] transition-colors"
          >
            <Plus size={15} />
            <span>Start a campaign</span>
          </NavLink>
        )}

        <div className="mt-4 border-t border-slate-100 pt-3">
          <NavLink
            to="/explore"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-ink"
          >
            <Compass size={15} />
            <span>Discover causes</span>
          </NavLink>
          <NavLink
            to="/contact"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-ink"
          >
            <CircleHelp size={15} />
            <span>Get help</span>
          </NavLink>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  )
}
