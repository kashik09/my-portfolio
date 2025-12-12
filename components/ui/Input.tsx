import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 transition ${
            error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent'
          } ${className}`}
          {...props}
        />
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'