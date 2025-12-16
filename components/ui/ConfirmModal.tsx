'use client'

import { AlertTriangle, Info, HelpCircle, XCircle } from 'lucide-react'

export type ModalType = 'danger' | 'warning' | 'info' | 'question'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
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
      iconBg: 'bg-destructive/10',
      icon: <AlertTriangle className="text-destructive" size={24} />,
      button: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    },
    warning: {
      iconBg: 'bg-warning/10',
      icon: <AlertTriangle className="text-warning" size={24} />,
      button: 'bg-warning text-warning-foreground hover:bg-warning/90'
    },
    info: {
      iconBg: 'bg-info/10',
      icon: <Info className="text-info" size={24} />,
      button: 'bg-info text-info-foreground hover:bg-info/90'
    },
    question: {
      iconBg: 'bg-primary/10',
      icon: <HelpCircle className="text-primary" size={24} />,
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
              {currentStyle.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{title}</h2>
              <p className="text-sm text-foreground-muted">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-foreground mb-6">{message}</p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-card-hover border border-border text-foreground rounded-lg hover:bg-card transition font-medium"
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