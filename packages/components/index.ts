import type { App } from 'vue'
import registerI18n from '@fhtek-ui/components/i18n'
import { default as FhAlert } from '@fhtek-ui/components/alert'
import { default as FhButton } from '@fhtek-ui/components/button'
import { default as FhCheckbox, FhCheckboxGroup } from '@fhtek-ui/components/checkbox'
import { default as FhDescriptions } from '@fhtek-ui/components/descriptions'

import '@fhtek-ui/components/style/base.less'

const components = [FhAlert, FhButton, FhCheckbox, FhCheckboxGroup, FhDescriptions]

const install = (app: App): void => {
  components.forEach((component) => {
    app.use(component)
  })
}

export default {
  install,
  version: '0.0.1',
}

export { registerI18n, FhAlert, FhButton, FhCheckbox, FhCheckboxGroup, FhDescriptions }

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
export type { ICheckboxProps, ICheckboxGroupProps } from '@fhtek-ui/components/checkbox'
export type { IDescriptionsProps } from '@fhtek-ui/components/descriptions'
