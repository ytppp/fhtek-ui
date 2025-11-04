import type { App } from 'vue'
import { dialogManager } from './dialog-manager'
import { type IDialogProps } from './interface'

export { type IDialogProps }

const dialogMethod = {
  info(options: IDialogProps) {
    return dialogManager(options)
  },
  confirm(options: IDialogProps) {
    return dialogManager(options, 'confirm')
  },
}

export function registerDialog(app: App) {
  app.config.globalProperties.$dialog = dialogMethod
  app.provide('$dialog', dialogMethod)
}
