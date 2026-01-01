'use client'

import { useEffect, useRef, useState } from 'react'
import { X, GripHorizontal } from 'lucide-react'
import { PreferencesPanel } from './PreferencesPanel'
import { usePreferences } from '@/lib/preferences/PreferencesContext'

export function DraggablePreferencesModal() {
  const { isModalOpen, closeModal } = usePreferences()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const dragHandleRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [centered, setCentered] = useState(true)

  useEffect(() => {
    if (!isModalOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Focus the modal
    const modal = modalRef.current
    if (modal) {
      const focusable = modal.querySelector<HTMLElement>(
        'button:not([disabled])'
      )
      focusable?.focus()
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, closeModal])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return

    setIsDragging(true)
    setCentered(false)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

  if (!isModalOpen) return null

  const modalStyle = centered
    ? {}
    : {
        transform: `translate(${position.x}px, ${position.y}px)`,
      }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-base-300/60 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preferences-title"
      onClick={closeModal}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-md rounded-3xl border border-base-300 bg-base-200 shadow-2xl ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        style={modalStyle}
        onClick={(event) => event.stopPropagation()}
        onMouseDown={handleMouseDown}
      >
        <div
          ref={dragHandleRef}
          className="flex items-center justify-center gap-2 px-8 pt-6 pb-2 cursor-grab active:cursor-grabbing"
        >
          <GripHorizontal size={20} className="text-base-content/40" />
        </div>

        <div className="px-8 pb-10">
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-5 top-5 rounded-full border border-base-300 bg-base-100/50 p-2 text-base-content transition hover:bg-base-100"
            aria-label="Close preferences"
          >
            <X size={16} />
          </button>

          <h2
            id="preferences-title"
            className="mb-6 text-2xl font-bold text-base-content"
          >
            Preferences
          </h2>

          <PreferencesPanel />
        </div>
      </div>
    </div>
  )
}
