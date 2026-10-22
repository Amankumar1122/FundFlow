import { Search, UserRound, UserRoundX } from 'lucide-react'
import { useMemo, useState } from 'react'
import ConfirmationDialog from '../../components/common/ConfirmationDialog'
import { useApp } from '../../context/AppContext'

export default function UserManagement() {
  const { users, toggleUserStatus, user } = useApp()
  const [query, setQuery] = useState('')
  const [disabling, setDisabling] = useState(null)

  const people = useMemo(
    () => users.filter((person) => `${person.name} ${person.email}`.toLowerCase().includes(query.toLowerCase())),
    [users, query]
  )

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#245bdb]">Identity & Governance</p>
      <h1 className="mt-1 text-2xl font-extrabold text-[#101820]">User management</h1>
      <p className="mt-1 text-xs text-[#667085]">Directory of registered organizers and contributors.</p>

      <label className="relative mt-6 block">
        <span className="sr-only">Search users</span>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-lg border border-[#d8e3f0] bg-white py-2 pl-10 pr-4 text-xs text-[#101820] outline-none focus:border-[#245bdb] focus:ring-2 focus:ring-[#245bdb]/15"
        />
      </label>

      <div className="mt-4 overflow-hidden rounded-xl border border-[#d8e3f0] bg-white shadow-2xs">
        {people.map((person) => (
          <div key={person.id} className="flex flex-col gap-3 border-b border-[#e9eef2] p-4 last:border-0 sm:flex-row sm:items-center">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef3fc] font-bold text-[#245bdb] border border-[#d8e3f0] text-xs">
              <UserRound size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#101820]">
                {person.name} {person.id === user.id && <span className="text-[11px] font-normal text-[#667085]">(you)</span>}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-[#667085]">
                {person.email} • {person.location || 'Location not set'}
              </p>
            </div>
            <span
              className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                person.disabled
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : person.role === 'admin'
                  ? 'border-[#d8e3f0] bg-[#eef3fc] text-[#245bdb]'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {person.disabled ? 'Disabled' : person.role === 'admin' ? 'Admin' : 'Active'}
            </span>
            {person.role !== 'admin' && (
              <button
                type="button"
                onClick={() => (person.disabled ? toggleUserStatus(person.id) : setDisabling(person))}
                className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold border transition ${
                  person.disabled
                    ? 'border-[#d8e3f0] bg-[#eef3fc] text-[#245bdb] hover:bg-[#e2ecfa]'
                    : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                <UserRoundX size={12} />
                {person.disabled ? 'Enable' : 'Disable'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-[#d8e3f0] bg-white p-3.5 text-xs leading-5 text-[#667085]">
        <strong className="text-[#101820]">Account Control:</strong> Disabling an account restricts access and synchronizes with Spring Boot user status updates.
      </div>

      <ConfirmationDialog
        open={Boolean(disabling)}
        title="Disable this account?"
        message={disabling ? `“${disabling.name}” will be restricted from logging in and accessing dashboard controls.` : ''}
        confirmLabel="Disable account"
        variant="danger"
        onCancel={() => setDisabling(null)}
        onConfirm={() => {
          toggleUserStatus(disabling.id)
          setDisabling(null)
        }}
      />
    </div>
  )
}
