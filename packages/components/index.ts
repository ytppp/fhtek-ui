import type { App } from 'vue'
import registerI18n from '@fhtek-ui/components/i18n'
import { default as FhAlert } from '@fhtek-ui/components/alert'
import { default as FhButton } from '@fhtek-ui/components/button'
import { default as FhCheckbox, FhCheckboxGroup } from '@fhtek-ui/components/checkbox'
import { default as FhDescriptions } from '@fhtek-ui/components/descriptions'
import { default as FhMarkdownPreview } from '@fhtek-ui/components/markdown-preview'

import dialog from '@fhtek-ui/components/dialog'

import '@fhtek-ui/components/style/base.less'

const components = [
  FhAlert,
  FhButton,
  FhCheckbox,
  FhCheckboxGroup,
  FhDescriptions,
  FhMarkdownPreview,
]

const install = (app: App, options?: { lang?: string }): void => {
  components.forEach((component) => {
    app.use(component)
  })

  app.config.globalProperties.$dialog = dialog
  app.provide('dialog', app.config.globalProperties.$dialog)
}

export default {
  install,
  version: '0.0.1',
}

export {
  registerI18n,
  FhAlert,
  FhButton,
  FhCheckbox,
  FhCheckboxGroup,
  FhDescriptions,
  FhMarkdownPreview,
}

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
export type { ICheckboxProps, ICheckboxGroupProps } from '@fhtek-ui/components/checkbox'
export type { IDescriptionsProps } from '@fhtek-ui/components/descriptions'
export type { IMarkdownPreviewProps } from '@fhtek-ui/components/markdown-preview'
