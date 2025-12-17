'use client'

import { AlertTriangle, Info, HelpCircle } from 'lucide-react'

export type ModalType = 'danger' | 'warning' | 'info' | 'question'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  type?: ModalType
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmModalProps) {
  
  if (!isOpen) return null

  const styles = {
    danger: {
      iconBg: 'bg-red-500/10 dark:bg-red-500/20',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: <AlertTriangle size={24} />,
      button: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600'
    },
    warning: {
      iconBg: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      icon: <AlertTriangle size={24} />,
      button: 'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600'
    },
    info: {
      iconBg: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: <Info size={24} />,
      button: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
    },
    question: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      icon: <HelpCircle size={24} />,
      button: 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  }

  const currentStyle = styles[type]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card rounded-2xl border border-border max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 ${currentStyle.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <div className={currentStyle.iconColor}>
                {currentStyle.icon}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-foreground mb-6">{message}</p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-muted hover:bg-muted/80 border border-border text-foreground rounded-lg transition font-medium"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 px-6 py-3 rounded-lg transition font-medium ${currentStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}