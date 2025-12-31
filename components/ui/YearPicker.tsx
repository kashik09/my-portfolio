'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface YearPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  allowRange?: boolean
}

export function YearPicker({ value, onChange, label, placeholder = 'Select year or range', allowRange = true }: YearPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStart, setSelectedStart] = useState<number | null>(null)
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null)
  const [decade, setDecade] = useState(2020)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 12 }, (_, i) => decade + i)

  // Parse existing value on mount
  useEffect(() => {
    if (value) {
      const rangeMatch = value.match(/(\d{4})\s*[-–]\s*(\d{4}|Present)/i)
      const singleMatch = value.match(/^(\d{4})$/)

      if (rangeMatch) {
        setSelectedStart(parseInt(rangeMatch[1]))
        setSelectedEnd(rangeMatch[2] === 'Present' ? currentYear : parseInt(rangeMatch[2]))
      } else if (singleMatch) {
        setSelectedStart(parseInt(singleMatch[1]))
        setSelectedEnd(null)
      }
    }
  }, [value, currentYear])

  const applySelection = useCallback(() => {
    if (selectedStart) {
      if (selectedEnd && selectedEnd !== selectedStart) {
        const endDisplay = selectedEnd === currentYear ? 'Present' : selectedEnd
        onChange(`${selectedStart} - ${endDisplay}`)
      } else {
        onChange(selectedStart.toString())
      }
    }
    setIsOpen(false)
  }, [currentYear, onChange, selectedEnd, selectedStart])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        applySelection()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [applySelection, isOpen])

  const handleYearClick = (year: number) => {
    if (!allowRange) {
      setSelectedStart(year)
      setSelectedEnd(null)
      onChange(year.toString())
      setIsOpen(false)
      return
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Start new selection
      setSelectedStart(year)
      setSelectedEnd(null)
    } else {
      // Complete range selection
      if (year >= selectedStart) {
        setSelectedEnd(year)
      } else {
        setSelectedEnd(selectedStart)
        setSelectedStart(year)
      }
    }
  }

  const isYearSelected = (year: number) => {
    if (!selectedStart) return false
    if (!selectedEnd) return year === selectedStart
    return year >= Math.min(selectedStart, selectedEnd) && year <= Math.max(selectedStart, selectedEnd)
  }

  const isYearInRange = (year: number) => {
    if (!selectedStart || !selectedEnd) return false
    return year > Math.min(selectedStart, selectedEnd) && year < Math.max(selectedStart, selectedEnd)
  }

  const displayValue = value || placeholder

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-4 bg-muted border border-border rounded-lg text-sm text-left flex items-center justify-between hover:bg-muted/80 transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
          {displayValue}
        </span>
        <Calendar size={16} className="text-muted-foreground" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-card border border-border rounded-xl shadow-2xl shadow-black/20 p-4 space-y-4">
          {/* Decade Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setDecade(decade - 12)}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {decade} - {decade + 11}
            </span>
            <button
              type="button"
              onClick={() => setDecade(decade + 12)}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Year Grid */}
          <div className="grid grid-cols-4 gap-2">
            {years.map(year => {
              const selected = isYearSelected(year)
              const inRange = isYearInRange(year)
              const isCurrent = year === currentYear

              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearClick(year)}
                  className={`
                    relative h-9 rounded-lg text-sm font-medium transition-all
                    ${selected
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : inRange
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-foreground'
                    }
                    ${isCurrent ? 'ring-2 ring-primary/30 ring-offset-1 ring-offset-card' : ''}
                  `}
                >
                  {selected && (
                    <Check size={12} className="absolute top-0.5 right-0.5" />
                  )}
                  {year}
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setSelectedStart(null)
                setSelectedEnd(null)
                onChange('')
                setIsOpen(false)
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={applySelection}
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>

          {allowRange && (
            <p className="text-[11px] text-muted-foreground text-center">
              Click once for single year, twice for range
            </p>
          )}
        </div>
      )}
    </div>
  )
}
