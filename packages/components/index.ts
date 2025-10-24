import type { App } from 'vue'

import FhAlert from './alert'
import FhButton from './button'

const components = [FhAlert, FhButton]

const install = (app: App): void => {
  components.forEach((component) => {
    app.use(component)
  })
}

export { FhAlert, FhButton }

export default { install }

export type { IAlertProps } from './alert'
export type { IButtonProps } from './button'
