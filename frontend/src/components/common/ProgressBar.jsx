import { useInView } from './Reveal'

export default function ProgressBar({ raised, goal, className = '' }) {
  const [ref, isVisible] = useInView()
  const percent = goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0
  return (
    <div ref={ref} className={className} role="progressbar" aria-label="Campaign fundraising progress" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`progress-fill h-full rounded-full bg-forest ${isVisible ? 'is-visible' : ''}`} style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
    </div>
  )
}
