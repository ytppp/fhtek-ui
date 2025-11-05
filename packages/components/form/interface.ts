import type { ComputedRef, InjectionKey, Ref } from 'vue'

type FormLabelPositionType = 'top' | 'left' | 'right'

export type RegisterLabelWidth = (val: number, oldVal: number) => void
export type DeregisterLabelWidth = (val: number) => void

export interface IFormProps {
  model: object
  rules: object
  disabled: boolean
  labelPosition: FormLabelPositionType // value: top, left, right. when set to left or right, label-width must be set
  labelWidth: string
}

export interface IFormItemProps {
  label: string
  prop: string
  for: string
  rules: object[]
  labelPosition: FormLabelPositionType
  labelWidth: string
  cancelBlurValidate: boolean
}

export interface FormItemValidation {
  validate: () => boolean
  clearValidate: () => void
}

export type IFormContext = {
  autoLabelWidth: ComputedRef<string>
  labelWidth: ComputedRef<string>
  labelPosition: ComputedRef<FormLabelPositionType>
  rules: ComputedRef<object>
  model: ComputedRef<object>
  registerLabelWidth: RegisterLabelWidth
  deregisterLabelWidth: DeregisterLabelWidth
  registerFormItemValidation: (validates: FormItemValidation) => void
}

export const FormContextKey: InjectionKey<IFormContext> = Symbol('FormContextKey')
