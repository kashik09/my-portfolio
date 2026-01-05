'use client'

import { useCallback, useRef, useState } from 'react'

type PendingAction = () => Promise<void>

export function usePendingAction() {
  const [isPending, setIsPending] = useState(false)
  const pendingRef = useRef(false)

  const run = useCallback(async (action: PendingAction) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setIsPending(true)
    try {
      await action()
    } finally {
      pendingRef.current = false
      setIsPending(false)
    }
  }, [])

  return { isPending, run }
}
