'use client'

import type { ReactNode } from 'react'

export function VibeyBackdrop({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`vibey-zone ${className}`}>
      <div className="vibey-backdrop" aria-hidden="true" />
      <div className="vibey-noise" aria-hidden="true" />
      <div className="vibey-content">{children}</div>
    </div>
  )
}
