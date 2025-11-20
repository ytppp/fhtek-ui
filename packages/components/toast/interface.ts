type ToastType = 'success' | 'error'

export interface IToastProps {
  duration?: number
  text?: string
  type?: ToastType
}

export interface IToastEmits {
  (e: 'hide'): void
}
