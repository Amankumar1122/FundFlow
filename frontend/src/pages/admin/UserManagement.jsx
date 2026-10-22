import { Search, UserRound, UserRoundX } from 'lucide-react'
import { useMemo, useState } from 'react'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import { useApp } from '../../context/AppContext'

export default function UserManagement() {
  const { users, toggleUserStatus, user } = useApp()
  const [query, setQuery] = useState('')
  const [disabling, setDisabling] = useState(null)
  const people = useMemo(() => users.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(query.toLowerCase())), [users, query])
  return <div><p className="text-xs font-bold uppercase tracking-[.15em] text-forest">The people behind the good</p><h1 className="mt-2 font-display text-3xl font-extrabold text-ink">User management</h1><p className="mt-2 text-sm text-muted">View demo accounts and their local status.</p>
    <label className="relative mt-6 block"><span className="sr-only">Search users</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-forest" /></label>
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">{people.map((person) => <div key={person.id} className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-0 sm:flex-row sm:items-center"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint font-bold text-forest"><UserRound size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-ink">{person.name} {person.id === user.id && <span className="text-xs font-normal text-muted">(you)</span>}</p><p className="mt-1 truncate text-xs text-muted">{person.email} · {person.location || 'Location not set'}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${person.disabled ? 'bg-rose-100 text-rose-700' : person.role === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-forest'}`}>{person.disabled ? 'Disabled' : person.role === 'admin' ? 'Admin' : 'Active'}</span>{person.role !== 'admin' && <button onClick={() => person.disabled ? toggleUserStatus(person.id) : setDisabling(person)} className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold ${person.disabled ? 'bg-mint text-forest' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'}`}><UserRoundX size={14} />{person.disabled ? 'Enable' : 'Disable'}</button>}</div>)}</div>
    <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">Demo-only controls. User status is not enforced by authentication and must not be used for real access control.</p>
    <ConfirmationDialog open={Boolean(disabling)} title="Disable this demo account?" message={disabling ? `${disabling.name} will not be able to log in to this demo while disabled.` : ''} confirmLabel="Disable account" variant="danger" onCancel={() => setDisabling(null)} onConfirm={() => { toggleUserStatus(disabling.id); setDisabling(null) }} />
  </div>
}
