import type { App } from 'vue'
import { dialogManager, type IDialogManager } from './dialog-manager'
import { type IDialogProps } from './interface'

export { type IDialogProps, type IDialogManager, dialogManager }

export function registerDialog(app: App) {
  app.config.globalProperties.$dialog = dialogManager
}
