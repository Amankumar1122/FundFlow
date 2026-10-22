import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toast, notify } = useApp()
  if (!toast) return null
  const Icon = toast.type === 'error' ? AlertCircle : CheckCircle2
  return (
    <div role="status" className={`fixed bottom-5 right-5 z-[80] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-2xl border bg-white p-4 shadow-soft ${toast.type === 'error' ? 'border-rose-200' : 'border-emerald-200'}`}>
      <Icon size={19} className={toast.type === 'error' ? 'mt-0.5 text-rose-600' : 'mt-0.5 text-forest'} />
      <span className="max-w-sm text-sm leading-5 text-ink">{toast.message}</span>
      <button aria-label="Dismiss notification" onClick={() => notify(null)} className="text-muted hover:text-ink"><X size={17} /></button>
    </div>
  )
}
