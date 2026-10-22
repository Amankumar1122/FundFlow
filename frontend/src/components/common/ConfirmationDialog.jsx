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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="confirmation-title" aria-describedby="confirmation-message" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <h2 id="confirmation-title" className="font-display text-xl font-extrabold text-ink">{title}</h2>
        <p id="confirmation-message" className="mt-2 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </section>
    </div>
  )
}
