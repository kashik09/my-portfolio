import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    // TODO: Style input with border, focus states
    // TODO: Add error state styling
    // TODO: Add label styling
    return (
      <div>
        {label && <label>{label}</label>}
        <input ref={ref} className={className} {...props} />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
