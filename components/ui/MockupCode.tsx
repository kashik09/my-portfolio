'use client'

import { ReactNode } from 'react'

interface MockupCodeProps {
  children: ReactNode
  className?: string
  prefix?: string
  dataPrefix?: string
}

export function MockupCode({
  children,
  className = '',
  prefix = '$',
  dataPrefix
}: MockupCodeProps) {
  return (
    <div className={`mockup-code ${className}`} data-prefix={dataPrefix}>
      {children}
    </div>
  )
}

interface CodeLineProps {
  children: ReactNode
  prefix?: string
  className?: string
  dataPrefix?: string
  warning?: boolean
  success?: boolean
}

export function CodeLine({
  children,
  prefix,
  className = '',
  dataPrefix,
  warning,
  success
}: CodeLineProps) {
  const bgClass = warning
    ? 'bg-warning text-warning-content'
    : success
    ? 'bg-success text-success-content'
    : ''

  return (
    <pre data-prefix={dataPrefix || prefix} className={`${bgClass} ${className}`}>
      <code>{children}</code>
    </pre>
  )
}
