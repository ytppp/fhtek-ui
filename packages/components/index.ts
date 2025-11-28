import type { App } from 'vue'

import { i18nPlugin, type I18nConfig } from '@fhtek-ui/locale'

import FhAlert from '@fhtek-ui/components/alert'
import FhButton from '@fhtek-ui/components/button'
import { default as FhCheckbox, FhCheckboxGroup } from '@fhtek-ui/components/checkbox'
import FhDescriptions from '@fhtek-ui/components/descriptions'
import FhMarkdownPreview from '@fhtek-ui/components/markdown-preview'
import FhDrawer from '@fhtek-ui/components/drawer'
import { default as FhForm, FhFormItem } from '@fhtek-ui/components/form'
import FhInput from '@fhtek-ui/components/input'
import FhIcon from '@fhtek-ui/components/icon'
import FhMenu from '@fhtek-ui/components/menu'
import FhModal from '@fhtek-ui/components/modal'
import FhPagination from '@fhtek-ui/components/pagination'
import FhPopover from '@fhtek-ui/components/popover'
import { default as FhRadio, FhRadioGroup } from '@fhtek-ui/components/radio'
import FhSelect from '@fhtek-ui/components/select'
import FhStep from '@fhtek-ui/components/step'
import FhSwitch from '@fhtek-ui/components/switch'
import FhTimePicker from '@fhtek-ui/components/time-picker'
import FhTable from '@fhtek-ui/components/table'
import FhUpload from '@fhtek-ui/components/upload'

// plugins
import { registerDialog, dialogManager as dialog } from '@fhtek-ui/components/dialog'
import { registerLoading, loadingManager as loading } from '@fhtek-ui/components/loading'
import { registerToast, toastManager as toast } from '@fhtek-ui/components/toast'

// directives
import { registerVLoading } from '@fhtek-ui/components/directives/loading'
import { registerVClickoutside } from '@fhtek-ui/components/directives/clickoutside'

import '@fhtek-ui/components/assets/style/base.less'

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
  FhPopover,
  FhRadio,
  FhRadioGroup,
  FhSelect,
  FhStep,
  FhSwitch,
  FhTimePicker,
  FhTable,
  FhUpload,
]

const install = (app: App, options: { i18n?: I18nConfig } = {}): void => {
  app.use(i18nPlugin, options.i18n)

  components.forEach((component) => {
    app.use(component)
  })

  registerDialog(app)
  registerLoading(app)
  registerToast(app)

  registerVLoading(app)
  registerVClickoutside(app)
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
  FhPopover,
  FhRadio,
  FhRadioGroup,
  FhSelect,
  FhStep,
  FhSwitch,
  FhTimePicker,
  loading,
  dialog,
  toast,
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
  FormInstance,
} from '@fhtek-ui/components/form'
export type { IMenuProps } from '@fhtek-ui/components/menu'
export { FormContextKey, FormItemContextKey } from '@fhtek-ui/components/form'
export type { IPopoverProps } from '@fhtek-ui/components/popover'
export type { IRadioProps, IRadioGroupProps } from '@fhtek-ui/components/radio'
export type { ISelectProps } from '@fhtek-ui/components/select'
export type { IStepProps } from '@fhtek-ui/components/step'
export type { ISwitchProps, ISwitchEmits } from '@fhtek-ui/components/switch'
export type { ITimePickerProps, ITimePickerEmits } from '@fhtek-ui/components/time-picker'
export type { ITableColumnProps, ITableEmits } from '@fhtek-ui/components/table'
export type { IUploadProps } from '@fhtek-ui/components/upload'
