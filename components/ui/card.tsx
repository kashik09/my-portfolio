import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  // TODO: Style card with shadow, rounded corners, padding
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', ...props }: CardProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '', ...props }: CardProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
