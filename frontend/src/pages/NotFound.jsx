import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-mint text-forest"><Compass size={30} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[.18em] text-forest">404 · Wrong turn</p><h1 className="mt-3 font-display text-4xl font-extrabold text-ink">This page wandered off.</h1><p className="mt-3 text-sm leading-7 text-muted">The page you’re looking for doesn’t exist or may have moved.</p><Link to="/" className="mt-6"><Button><ArrowLeft size={16} /> Back to the good stuff</Button></Link></div>
}
