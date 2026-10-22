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
      <aside className="h-fit rounded-xl border border-[#d8e3f0] bg-white p-4 shadow-2xs lg:sticky lg:top-20">
        <div className="flex items-center gap-3 border-b border-[#e9eef2] px-2 pb-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef3fc] font-bold text-[#245bdb] border border-[#d8e3f0] text-xs">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-bold text-[#101820]">{user?.name}</div>
            <div className="truncate text-[11px] text-[#667085]">
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
                `flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#eef3fc] text-[#245bdb] font-bold border border-[#d8e3f0]'
                    : 'text-[#667085] hover:bg-[#f5f7fa] hover:text-[#101820]'
                }`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {!admin && (
          <NavLink
            to="/dashboard/create"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#245bdb] px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-colors"
          >
            <Plus size={14} />
            <span>Start a campaign</span>
          </NavLink>
        )}

        <div className="mt-4 border-t border-[#e9eef2] pt-3">
          <NavLink
            to="/explore"
            className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#667085] hover:bg-[#f5f7fa] hover:text-[#101820]"
          >
            <Compass size={14} />
            <span>Discover causes</span>
          </NavLink>
          <NavLink
            to="/contact"
            className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#667085] hover:bg-[#f5f7fa] hover:text-[#101820]"
          >
            <CircleHelp size={14} />
            <span>Support center</span>
          </NavLink>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={14} />
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
