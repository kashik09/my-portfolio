'use client'

import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      // Check if hovering over interactive element
      const target = e.target as HTMLElement
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [draggable="true"]')
      setIsPointer(!!interactive)
    }

    const hideCursor = () => setIsHidden(true)
    const showCursor = () => setIsHidden(false)

    window.addEventListener('mousemove', updateCursor)
    window.addEventListener('mouseleave', hideCursor)
    window.addEventListener('mouseenter', showCursor)

    return () => {
      window.removeEventListener('mousemove', updateCursor)
      window.removeEventListener('mouseleave', hideCursor)
      window.removeEventListener('mouseenter', showCursor)
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHidden ? 0 : 1,
        }}
      >
        <div
          className={`custom-cursor-dot ${isPointer ? 'is-pointer' : ''}`}
          style={{
            backgroundColor: 'oklch(var(--p) / 0.8)',
          }}
        />
      </div>

      {/* Cursor ring (follows with delay) */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isHidden ? 0 : 1,
          transform: isPointer ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
        }}
      >
        <div
          style={{
            borderColor: 'oklch(var(--p) / 0.3)',
          }}
          className="w-full h-full rounded-full border-2"
        />
      </div>

      <style jsx>{`
        .custom-cursor,
        .custom-cursor-ring {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
        }

        .custom-cursor {
          transition: opacity 200ms ease;
        }

        .custom-cursor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: transform 150ms cubic-bezier(0.22, 1, 0.36, 1),
                      background-color 200ms ease;
        }

        .custom-cursor-dot.is-pointer {
          transform: translate(-50%, -50%) scale(1.5);
        }

        .custom-cursor-ring {
          width: 32px;
          height: 32px;
          transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 200ms ease;
        }

        /* Hide default cursor on body when custom cursor is active */
        @media (pointer: fine) {
          :global(body) {
            cursor: none !important;
          }
          :global(*) {
            cursor: none !important;
          }
        }

        /* Keep default cursor on touch devices */
        @media (pointer: coarse) {
          .custom-cursor,
          .custom-cursor-ring {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
