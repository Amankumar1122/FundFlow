import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

export default function FormField({
  label,
  id,
  hint,
  error,
  className = '',
  as = 'input',
  options,
  type = 'text',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const computedType = isPassword ? (showPassword ? 'text' : 'password') : type

  const controlClass = `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-forest focus:ring-2 focus:ring-forest/15 disabled:bg-slate-50 disabled:text-slate-400 ${
    error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : 'border-slate-200 hover:border-slate-300'
  }`

  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  const ariaDescribedBy = errorId || hintId

  return (
    <div className={`block text-left ${className}`}>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      {as === 'select' ? (
        <select
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`${controlClass} cursor-pointer`}
          {...props}
        >
          {options?.map((option) => (
            <option key={option.value ?? option} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`${controlClass} min-h-28 resize-y leading-relaxed`}
          {...props}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={computedType}
            aria-invalid={Boolean(error)}
            aria-describedby={ariaDescribedBy}
            className={`${controlClass} ${isPassword ? 'pr-10' : ''}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:outline-none"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      )}

      {error && (
        <span id={errorId} role="alert" className="mt-1 block text-xs font-medium text-rose-600">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={hintId} className="mt-1 block text-xs text-muted">
          {hint}
        </span>
      )}
    </div>
  )
}
