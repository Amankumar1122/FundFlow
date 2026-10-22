import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'
import Button from '../components/common/Button'
import FormField from '../components/common/FormField'
import { useApp } from '../context/AppContext'

export default function Contact() {
  const { notify } = useApp()
  const [sent, setSent] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    setSent(true)
    notify('Thanks for reaching out! Your demo message is ready.')
    event.currentTarget.reset()
  }
  return <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-forest">Get in touch</p><h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">We'd love to hear from you.</h1><p className="mt-4 text-base leading-7 text-muted">Have a question, an idea, or just want to say hello? Send us a note.</p></div>
    <div className="mt-9 grid gap-7 lg:grid-cols-[1fr_1.1fr]"><div className="space-y-4">{[[Mail, 'Email', 'hello@fundflow.demo'], [MessageCircle, 'We’re here to help', 'Questions about campaigns or getting started'], [MapPin, 'Made for communities', 'Across India, wherever good ideas grow']].map(([Icon, label, content]) => <div key={label} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint text-forest"><Icon size={19} /></span><div><h2 className="text-sm font-bold text-ink">{label}</h2><p className="mt-1 text-sm text-muted">{content}</p></div></div>)}<div className="rounded-2xl bg-paper p-5 text-xs leading-6 text-muted"><Phone size={15} className="mr-1 inline text-forest" />Contact form submissions in this demo are not sent to a real inbox.</div></div>
    <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="grid gap-4 sm:grid-cols-2"><FormField id="name" label="Your name" required minLength="2" placeholder="Alex Morgan" /><FormField id="email" label="Email address" type="email" required placeholder="you@example.com" /></div><FormField className="mt-4" id="subject" label="What can we help with?" as="select" options={['Campaign question', 'Getting started', 'Something else']} /><FormField className="mt-4" id="message" label="Your message" as="textarea" required minLength="10" maxLength="1000" placeholder="Tell us a little about what’s on your mind..." /><Button type="submit" className="mt-5 w-full">{sent ? 'Send another message' : 'Send message'}</Button><p className="mt-3 text-center text-xs text-muted">Demo interaction only — your message stays in this browser.</p></form></div>
  </div>
}
