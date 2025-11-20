import type { App } from 'vue'
import { toastManager } from './toast-manager'
import { type IToastProps } from './interface'

export { type IToastProps }

export function registerToast(app: App) {
  app.config.globalProperties.$toast = toastManager
  app.provide('$toast', toastManager)
}
