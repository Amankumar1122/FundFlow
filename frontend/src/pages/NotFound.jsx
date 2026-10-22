import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0]">
        <Compass size={28} />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#245bdb]">404 • Resource Not Found</p>
      <h1 className="mt-2 text-2xl font-extrabold text-[#101820] sm:text-3xl">This page could not be located.</h1>
      <p className="mt-2 text-xs leading-6 text-[#667085]">
        The requested URL was not found on this server or may have been relocated.
      </p>
      <Link to="/" className="mt-6">
        <Button size="md">
          <ArrowLeft size={15} /> Back to platform home
        </Button>
      </Link>
    </div>
  )
}
