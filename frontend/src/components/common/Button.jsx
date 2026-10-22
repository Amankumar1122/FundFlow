import { LoaderCircle } from 'lucide-react'

export default function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', type = 'button', ...props }) {
  const variants = {
    primary: 'bg-[#245bdb] text-white hover:bg-[#1d4ed8] active:bg-[#1e40af] shadow-xs',
    secondary: 'border border-[#d8e3f0] bg-white text-[#101820] hover:bg-[#f5f7fa] hover:border-[#cbd5e1] shadow-2xs',
    lime: 'bg-[#eef3fc] text-[#245bdb] border border-[#d8e3f0] hover:bg-[#e2ecfa]',
    ghost: 'text-[#667085] hover:text-[#101820] hover:bg-[#f5f7fa]',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
    md: 'px-4 py-2 text-sm font-semibold rounded-lg',
    lg: 'px-5 py-2.5 text-sm font-semibold rounded-lg',
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
