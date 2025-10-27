import type { App } from 'vue'

import FhAlert from '@fhtek-ui/components/alert'
import FhButton from '@fhtek-ui/components/button'

const components = [FhAlert, FhButton]

const install = (app: App): void => {
  components.forEach((component) => {
    app.use(component)
  })
}

export { FhAlert, FhButton }

export default {
  install,
  version: '0.0.1',
}

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
