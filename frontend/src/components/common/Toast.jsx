import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toast, notify } = useApp()
  if (!toast) return null
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2

  return (
    <div
      role="status"
      className={`fixed bottom-5 right-5 z-[80] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-xl border bg-white p-3.5 shadow-card ${
        toast.type === 'error' ? 'border-rose-200' : 'border-emerald-200'
      }`}
    >
      <Icon
        size={17}
        className={toast.type === 'error' ? 'mt-0.5 shrink-0 text-rose-600' : 'mt-0.5 shrink-0 text-emerald-600'}
      />
      <span className="max-w-sm text-xs leading-5 text-[#101820]">{toast.message}</span>
      <button
        aria-label="Dismiss notification"
        onClick={() => notify(null)}
        className="ml-auto text-[#667085] hover:text-[#101820]"
      >
        <X size={15} />
      </button>
    </div>
  )
}
