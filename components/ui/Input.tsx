import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-10 px-4 surface-app border border-app rounded-lg text-sm text-app focus:outline-none focus:ring-2 focus:ring-[color:rgb(var(--ring)/0.35)] transition placeholder:text-[color:rgb(var(--muted)/0.75)] ${
            error ? 'border-destructive focus:border-destructive' : 'focus:border-[color:rgb(var(--ring)/0.6)]'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-destructive text-xs font-medium">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
