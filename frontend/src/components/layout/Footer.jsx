import { ArrowUpRight, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white">
              <HeartHandshake size={20} />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white">FundFlow</span>
          </Link>
          <p className="mt-4 max-w-sm text-xs leading-6 text-slate-400">
            A trusted platform connecting community fundraising initiatives with supporters. Built on a Spring Boot REST API and modern React frontend.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-400 border border-slate-700/60">
            <span>Portfolio Demo • Simulated financial records</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Discover</h3>
          <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-400">
            <Link to="/explore" className="hover:text-white transition-colors">Explore campaigns</Link>
            <Link to="/about" className="hover:text-white transition-colors">Our story & mission</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Support & Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Get Involved</h3>
          <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-400">
            <Link to="/register" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              Start a campaign <ArrowUpRight size={12} />
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign in to Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} FundFlow. All rights reserved.</span>
          <span>Powered by Java 21, Spring Boot 3 & React</span>
        </div>
      </div>
    </footer>
  )
}
