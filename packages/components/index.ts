import type { App } from 'vue'

import { i18nPlugin, type I18nConfig } from '@fhtek-ui/locale'

import { default as FhAlert } from '@fhtek-ui/components/alert'
import { default as FhButton } from '@fhtek-ui/components/button'
import { default as FhCheckbox, FhCheckboxGroup } from '@fhtek-ui/components/checkbox'
import { default as FhDescriptions } from '@fhtek-ui/components/descriptions'
import { default as FhMarkdownPreview } from '@fhtek-ui/components/markdown-preview'
import { default as FhDrawer } from '@fhtek-ui/components/drawer'
import { default as FhForm, FhFormItem } from '@fhtek-ui/components/form'
import { default as FhInput } from '@fhtek-ui/components/input'
import { default as FhIcon } from '@fhtek-ui/components/icon'
import { default as FhMenu } from '@fhtek-ui/components/menu'
import { default as FhModal } from '@fhtek-ui/components/modal'
import { default as FhPagination } from '@fhtek-ui/components/pagination'

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
  FhDrawer,
  FhForm,
  FhFormItem,
  FhInput,
  FhIcon,
  FhMenu,
  FhModal,
  FhPagination,
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

export {
  FhAlert,
  FhButton,
  FhCheckbox,
  FhCheckboxGroup,
  FhDescriptions,
  FhMarkdownPreview,
  FhDrawer,
  FhForm,
  FhFormItem,
  FhInput,
  FhMenu,
  FhModal,
  FhPagination,
}

export type { IAlertProps } from '@fhtek-ui/components/alert'
export type { IButtonProps } from '@fhtek-ui/components/button'
export type { ICheckboxProps, ICheckboxGroupProps } from '@fhtek-ui/components/checkbox'
export type { IDescriptionsProps } from '@fhtek-ui/components/descriptions'
export type { IMarkdownPreviewProps } from '@fhtek-ui/components/markdown-preview'
export type { IDialogProps } from '@fhtek-ui/components/dialog'
export type { IModalProps } from '@fhtek-ui/components/modal'
export type { IInputProps } from '@fhtek-ui/components/input'
export type { IPaginationProps, IPaginationEmits } from '@fhtek-ui/components/pagination'
export type { IDrawerProps } from '@fhtek-ui/components/drawer'
export type {
  IFormProps,
  IFormItemProps,
  IFormContext,
  IFormItemContext,
} from '@fhtek-ui/components/form'
export type { IMenuProps } from '@fhtek-ui/components/menu'

export { FormContextKey, FormItemContextKey } from '@fhtek-ui/components/form'
