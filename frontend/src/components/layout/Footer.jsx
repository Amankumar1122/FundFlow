import { ArrowUpRight, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#d8e3f0] bg-[#101820] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#245bdb] text-white">
              <HeartHandshake size={18} />
            </span>
            <span className="font-sans text-base font-extrabold tracking-tight text-white">FundFlow</span>
          </Link>
          <p className="mt-4 max-w-sm text-xs leading-6 text-slate-400">
            Enterprise-grade crowdfunding platform connecting verified community initiatives with transparent funding capital. Engineered on Spring Boot 3, MySQL 8, and React.
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#245bdb]" />
            <span>Simulated Payment Gateway • Demonstration Platform</span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Platform</h3>
          <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-400">
            <Link to="/explore" className="hover:text-white transition-colors">Explore campaigns</Link>
            <Link to="/about" className="hover:text-white transition-colors">Platform architecture & story</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Enterprise support & inquiries</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Participation</h3>
          <div className="mt-4 flex flex-col gap-2.5 text-xs text-slate-400">
            <Link to="/register" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              Start a campaign <ArrowUpRight size={12} />
            </Link>
            <Link to="/login" className="hover:text-white transition-colors">Account login</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin review console</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} FundFlow Technologies. All rights reserved.</span>
          <span>Java 21 • Spring Boot 3.4.4 • React 18 • MySQL 8.0</span>
        </div>
      </div>
    </footer>
  )
}
