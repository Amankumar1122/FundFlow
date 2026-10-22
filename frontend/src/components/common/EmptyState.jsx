import { Search } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ title = 'Nothing here yet', text = 'When there is something to show, it will appear here.', action, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-[#d8e3f0] bg-white px-6 py-12 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
        <Search size={18} />
      </div>
      <h3 className="mt-3.5 text-base font-bold text-[#101820]">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-[#667085]">{text}</p>
      {action && <Button size="sm" className="mt-4" onClick={onAction}>{action}</Button>}
    </div>
  )
}
