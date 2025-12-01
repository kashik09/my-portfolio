import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  // TODO: Implement button variants and sizes with Tailwind classes
  // TODO: Add loading state
  // TODO: Add icon support
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
