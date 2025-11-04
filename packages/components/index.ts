import type { App } from 'vue'

import { i18nPlugin, type I18nConfig } from '@fhtek-ui/locale'

import { default as FhAlert } from '@fhtek-ui/components/alert'
import { default as FhButton } from '@fhtek-ui/components/button'
import { default as FhCheckbox, FhCheckboxGroup } from '@fhtek-ui/components/checkbox'
import { default as FhDescriptions } from '@fhtek-ui/components/descriptions'
import { default as FhMarkdownPreview } from '@fhtek-ui/components/markdown-preview'

// plugins
import { registerDialog } from '@fhtek-ui/components/dialog'
import { registerLoading } from '@fhtek-ui/components/loading'

// directives
import { registerVLoading } from '@fhtek-ui/components/directives/loading'

import '@fhtek-ui/components/style/base.less'

const components = [
  FhAlert,
  FhButton,
  FhCheckbox,
  FhCheckboxGroup,
  FhDescriptions,
  FhMarkdownPreview,
]

const install = (app: App, options: { i18n?: I18nConfig } = {}): void => {
  app.use(i18nPlugin, options.i18n)

  components.forEach((component) => {
    app.use(component)
  })

  registerDialog(app)
  registerLoading(app)
  registerVLoading(app)
}

export default {
  install,
  version: '__VERSION__',
}

export { FhAlert, FhButton, FhCheckbox, FhCheckboxGroup, FhDescriptions, FhMarkdownPreview }

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
export type { ICheckboxProps, ICheckboxGroupProps } from '@fhtek-ui/components/checkbox'
export type { IDescriptionsProps } from '@fhtek-ui/components/descriptions'
export type { IMarkdownPreviewProps } from '@fhtek-ui/components/markdown-preview'
export type { IDialogProps } from '@fhtek-ui/components/dialog'
