'use client'

import { AlertTriangle, Info, HelpCircle } from 'lucide-react'

export type ModalType = 'danger' | 'warning' | 'info' | 'question' | 'primary'

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
      iconBg: 'bg-error/10',
      iconColor: 'text-error',
      icon: <AlertTriangle size={24} />,
      button: 'bg-error text-error-content hover:bg-error/90'
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      icon: <AlertTriangle size={24} />,
      button: 'bg-warning text-warning-content hover:bg-warning/90'
    },
    info: {
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
      icon: <Info size={24} />,
      button: 'bg-info text-info-content hover:bg-info/90'
    },
    question: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      icon: <HelpCircle size={24} />,
      button: 'bg-primary text-primary-content hover:bg-primary/90'
    },
    primary: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      icon: <Info size={24} />,
      button: 'bg-primary text-primary-content hover:bg-primary/90'
    }
  }

  const currentStyle = styles[type]

  return (
    <div
      className="fixed inset-0 bg-base-content/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl border border-border max-w-lg w-full animate-in zoom-in-95 duration-200 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-14 h-14 ${currentStyle.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <div className={currentStyle.iconColor}>
                {currentStyle.icon}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-1">{title}</h2>
              <p className="text-sm text-muted-foreground">This action cannot be undone</p>
            </div>
          </div>

          {/* Message */}
          <div className="text-foreground mb-8 leading-relaxed">
            {message}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 bg-background-secondary hover:bg-muted border border-border text-foreground rounded-xl transition-all font-semibold hover:scale-[1.02] active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm()
                onClose()
              }}
              className={`flex-1 px-6 py-3.5 rounded-xl transition-all font-semibold hover:scale-[1.02] active:scale-[0.98] ${currentStyle.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
