import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

const values = [
  { icon: Users, title: 'People lead the way', text: 'The best ideas begin with the people who know their community best.' },
  { icon: ShieldCheck, title: 'Clarity builds trust', text: 'Campaigns share their goals and stories so supporters know what they are backing.' },
  { icon: Leaf, title: 'Small actions add up', text: 'A contribution of any size can help move a good idea forward.' },
]

export default function About() {
  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
    <div className="grid items-center gap-10 lg:grid-cols-[.92fr_1.08fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Our story</p><h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">Good things grow when we grow them <span className="text-forest">together.</span></h1><p className="mt-5 text-base leading-8 text-muted">FundFlow is a place for neighbors with an idea, and the people who want to help make it happen. We bring local causes and generous communities a little closer together.</p><Link to="/explore" className="mt-7 inline-flex"><Button>Find a cause <ArrowRight size={16} /></Button></Link></div><div className="overflow-hidden rounded-[2rem]"><img className="h-[330px] w-full object-cover sm:h-[440px]" src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1300&q=85" alt="Community volunteers working together" /></div></div>
    <div className="mt-16 grid gap-8 border-y border-slate-200 py-12 md:grid-cols-3">{values.map(({ icon: Icon, title, text }) => <div key={title}><span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint text-forest"><Icon size={22} /></span><h2 className="mt-4 font-display text-xl font-extrabold text-ink">{title}</h2><p className="mt-2 text-sm leading-7 text-muted">{text}</p></div>)}</div>
    <div className="mt-14 rounded-3xl bg-forest p-8 text-white sm:p-12"><div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><Sparkles size={23} className="text-lime" /><h2 className="mt-4 font-display text-3xl font-extrabold">A note about this demo</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">FundFlow currently runs entirely in your browser with sample information and simulated interactions. Accounts and contributions are for demonstration only. There are no real payments, verified identities, or secure backend authentication.</p></div><Link to="/contact"><Button variant="lime">Questions? Contact us</Button></Link></div></div>
  </div>
}
