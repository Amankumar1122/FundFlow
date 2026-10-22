import { ArrowRight, Leaf, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

const values = [
  { icon: Users, title: 'Verified Community Leadership', text: 'Grassroots projects are initiated by local organizers who understand their community needs.' },
  { icon: ShieldCheck, title: 'Audited Financial Tracking', text: 'Campaign milestones and disbursement logs are maintained for complete transparency.' },
  { icon: Leaf, title: 'Collective Resource Mobilization', text: 'Small, distributed contributions aggregate to fund meaningful physical and digital infrastructure.' },
]

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#d8e3f0] bg-[#eef3fc] px-3 py-1 text-xs font-bold text-[#245bdb]">
            PLATFORM MISSION & ARCHITECTURE
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#101820] sm:text-4xl lg:text-5xl">
            Empowering transparent giving <span className="text-[#245bdb]">across communities.</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            FundFlow provides reliable, enterprise-grade technology to connect grassroots fundraisers with supporters. By pairing modern web interfaces with secure backend accounting, we ensure that every initiative has clear goals and transparent outcomes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/explore">
              <Button size="md">
                <span>Explore campaigns</span>
                <ArrowRight size={15} />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="md" variant="secondary">
                <span>Start a campaign</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#d8e3f0] bg-[#e9eef2] shadow-card">
          <img
            className="h-[320px] w-full object-cover sm:h-[400px]"
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1300&q=85"
            alt="Community volunteers collaborating"
          />
        </div>
      </div>

      <div className="mt-14 grid gap-6 border-y border-[#d8e3f0] py-12 md:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-[#d8e3f0] bg-white p-5 shadow-2xs">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
              <Icon size={18} />
            </span>
            <h2 className="mt-3.5 text-sm font-bold text-[#101820]">{title}</h2>
            <p className="mt-1.5 text-xs leading-5 text-[#667085]">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/10 bg-[#101820] p-8 text-white sm:p-10 shadow-card">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#245bdb]">
              Platform Architecture
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-white">Full-Stack Technology Stack</h2>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-300">
              FundFlow is engineered using Java 21, Spring Boot 3.4.4, Spring Data JPA, Hibernate, and MySQL 8.0 on the backend, paired with a React 18, Vite, and Tailwind CSS client. All financial flows shown in this demo are simulated for technical portfolio presentation.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="lime">
              <span>Contact team</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
