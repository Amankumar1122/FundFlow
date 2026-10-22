import { useEffect } from 'react'
import Button from './Button'

export default function ConfirmationDialog({ open, title, message, confirmLabel = 'Confirm', variant = 'primary', onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#101820]/50 p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-message" className="w-full max-w-md rounded-xl border border-[#d8e3f0] bg-white p-6 shadow-card">
        <h2 id="confirmation-title" className="text-base font-bold text-[#101820]">{title}</h2>
        <p id="confirmation-message" className="mt-2 text-xs leading-5 text-[#667085]">{message}</p>
        <div className="mt-5 flex justify-end gap-2.5">
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  )
}
