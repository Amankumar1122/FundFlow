import { Search } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ title = 'Nothing here yet', text = 'When there is something to show, it will appear here.', action, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest"><Search size={21} /></div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{text}</p>
      {action && <Button className="mt-5" onClick={onAction}>{action}</Button>}
    </div>
  )
}
