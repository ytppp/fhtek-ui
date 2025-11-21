import type { ComputedRef, InjectionKey, Ref } from 'vue'

type FormLabelPositionType = 'top' | 'left' | 'right'

export type RegisterLabelWidth = (val: number, oldVal: number) => void
export type DeregisterLabelWidth = (val: number) => void

export interface IFormProps {
  model?: object
  rules?: object
  disabled?: boolean
  labelPosition?: FormLabelPositionType // value: top, left, right. when set to left or right, label-width must be set
  labelWidth?: string
}

// export interface IFormItemRule {
//   message: string
//   rule: (value: string | number | boolean) => boolean
// }

export interface IFormItemRule {
  message: string
  rule: (value: string | number | boolean) => boolean
}

export interface IFormItemProps {
  label?: string
  prop?: string
  for?: string
  rules?: IFormItemRule[]
  labelPosition?: FormLabelPositionType
  labelWidth?: string
  cancelBlurValidate?: boolean
}

export interface IFormLabelWrap {
  isAutoWidth: boolean
  updateAll: boolean
  labelPosition: FormLabelPositionType
}

export interface FormValidation {
  validate: () => boolean
  clearValidate: () => void
  extraValidate?: (validator: () => boolean, msg: string) => void
}

export type FormExpose = FormValidation

export type IFormContext = ComputedRef<{
  autoLabelWidth?: string
  labelWidth?: string
  labelPosition?: FormLabelPositionType
  rules?: object
  model?: object
  registerLabelWidth: RegisterLabelWidth
  deregisterLabelWidth: DeregisterLabelWidth
  registerFormItemValidation: (validates: FormValidation) => void
}>

export type IFormItemContext = ComputedRef<{
  clearValidate: () => void
  validate: () => boolean
  updateComputedLabelWidth: (width: number) => void
  label: string
  cancelBlurValidate: boolean
  id: string
}>

export const FormContextKey: InjectionKey<IFormContext> = Symbol('FormContextKey')
export const FormItemContextKey: InjectionKey<IFormItemContext> = Symbol('FormItemContextKey')
