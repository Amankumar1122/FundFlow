import { LoaderCircle } from 'lucide-react'

export default function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-forest text-white hover:bg-[#115e59] shadow-sm active:bg-[#0f4f4b]',
    secondary: 'border border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50 shadow-sm',
    lime: 'bg-mint text-forest border border-teal-200 hover:bg-teal-100',
    ghost: 'text-ink/80 hover:text-ink hover:bg-slate-100',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
    lg: 'px-5 py-3 text-sm font-semibold rounded-xl',
  }
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <LoaderCircle size={15} className="animate-spin" />}
      {children}
    </button>
  )
}
