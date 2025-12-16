'use client'

import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(7)
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastComponent({ message, type, onClose }: Toast & { onClose: () => void }) {
  const styles = {
    success: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300',
    error: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300',
    info: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300',
    warning: 'bg-yellow-500/10 dark:bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-300'
  }

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />
  }

  return (
    <div className={`min-w-[300px] px-4 py-3 rounded-lg border backdrop-blur-sm ${styles[type]} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="font-medium flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="hover:opacity-70 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}