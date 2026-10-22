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
    notify('Thanks for reaching out! Your message was submitted successfully.')
    event.currentTarget.reset()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-md border border-[#d8e3f0] bg-[#eef3fc] px-3 py-1 text-xs font-bold text-[#245bdb]">
          COMMUNICATION & INQUIRIES
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#101820] sm:text-4xl">
          Get in touch with FundFlow.
        </h1>
        <p className="mt-2 text-xs leading-6 text-[#667085] sm:text-sm">
          Have an inquiry about platform integration, organizing an initiative, or technical questions? Send our team a note.
        </p>
      </div>

      <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3.5">
          {[
            [Mail, 'Technical & General Inquiries', 'hello@fundflow.demo'],
            [MessageCircle, 'Campaign Review Support', 'Direct moderation and validation inquiries'],
            [MapPin, 'Operational Coverage', 'Across India, supporting community initiatives'],
          ].map(([Icon, label, content]) => (
            <div key={label} className="flex gap-3.5 rounded-xl border border-[#d8e3f0] bg-white p-4.5 shadow-2xs">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
                <Icon size={18} />
              </span>
              <div>
                <h2 className="text-xs font-bold text-[#101820]">{label}</h2>
                <p className="mt-0.5 text-xs text-[#667085]">{content}</p>
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-[#d8e3f0] bg-[#f5f7fa] p-4 text-xs leading-5 text-[#667085]">
            <Phone size={14} className="mr-1.5 inline text-[#245bdb]" />
            Demo inquiry form: Submissions trigger immediate toast confirmations without dispatching remote SMTP emails.
          </div>
        </div>

        <form onSubmit={submit} className="rounded-xl border border-[#d8e3f0] bg-white p-6 shadow-card">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <FormField id="name" label="Your name" required minLength="2" placeholder="e.g. Alex Morgan" />
            <FormField id="email" label="Email address" type="email" required placeholder="you@example.com" />
          </div>
          <FormField
            className="mt-3.5"
            id="subject"
            label="Inquiry Topic"
            as="select"
            options={['Campaign verification inquiry', 'API & technical integration', 'Platform assistance', 'General inquiry']}
          />
          <FormField
            className="mt-3.5"
            id="message"
            label="Message Details"
            as="textarea"
            required
            minLength="10"
            maxLength="1000"
            placeholder="Describe your inquiry or platform feedback in detail..."
          />
          <Button type="submit" className="mt-4 w-full">
            {sent ? 'Send another message' : 'Submit message'}
          </Button>
          <p className="mt-3 text-center text-[11px] text-[#667085]">
            Demo communication channel • Form actions are preserved locally.
          </p>
        </form>
      </div>
    </div>
  )
}
