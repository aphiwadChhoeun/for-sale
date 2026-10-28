import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { IconClose } from './Icons'

interface ModalProps {
  labelledBy: string
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ labelledBy, onClose, children, className = '' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const timer = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ??
        panelRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
      target?.focus()
    }, 60)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(timer)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <motion.div
      className={`modal ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="modal__backdrop" onMouseDown={onClose} />
      <motion.div
        className="modal__panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <button
          className="modal__close icon-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <IconClose size={19} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}
