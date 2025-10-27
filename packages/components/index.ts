import type { App } from 'vue'

import { default as FhAlert } from '@fhtek-ui/components/alert'
import { default as FhButton } from '@fhtek-ui/components/button'

const components = [FhAlert, FhButton]

const install = (app: App): void => {
  components.forEach((component) => {
    app.use(component)
  })
}

export default {
  install,
  version: '0.0.1',
}

export { FhAlert, FhButton }

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
