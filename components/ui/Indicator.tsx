'use client'

import { ReactNode } from 'react'

interface IndicatorProps {
  children: ReactNode
  badge?: string | number
  className?: string
  position?: 'top-start' | 'top-center' | 'top-end' | 'middle-start' | 'middle-center' | 'middle-end' | 'bottom-start' | 'bottom-center' | 'bottom-end'
  variant?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
}

const positionClasses = {
  'top-start': 'indicator-top indicator-start',
  'top-center': 'indicator-top indicator-center',
  'top-end': 'indicator-top indicator-end',
  'middle-start': 'indicator-middle indicator-start',
  'middle-center': 'indicator-middle indicator-center',
  'middle-end': 'indicator-middle indicator-end',
  'bottom-start': 'indicator-bottom indicator-start',
  'bottom-center': 'indicator-bottom indicator-center',
  'bottom-end': 'indicator-bottom indicator-end',
}

const variantClasses = {
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
}

export function Indicator({
  children,
  badge,
  className = '',
  position = 'top-end',
  variant = 'primary'
}: IndicatorProps) {
  return (
    <div className={`indicator ${className}`}>
      {badge !== undefined && (
        <span className={`indicator-item badge badge-sm ${variantClasses[variant]} ${positionClasses[position]}`}>
          {badge}
        </span>
      )}
      {children}
    </div>
  )
}
