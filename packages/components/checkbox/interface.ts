import type { InjectionKey, Ref } from 'vue'

type CheckboxGroupDirection = 'horizontal' | 'vertical'
export type CheckboxValuaType = boolean | string | number

export interface ICheckboxGroupProps {
  modelValue: CheckboxValuaType[]
  circle?: boolean
  direction?: CheckboxGroupDirection
  disabled?: boolean
}

export interface ICheckboxGroupEmits {
  (e: 'update:modelValue', value: CheckboxValuaType[]): void
  (e: 'change', value: CheckboxValuaType[]): void
}

export interface ICheckboxProps {
  modelValue?: CheckboxValuaType
  circle?: boolean
  label?: string
  disabled?: boolean
  checked?: boolean
  name?: string
  id?: string
  value?: CheckboxValuaType
  trueValue?: CheckboxValuaType
  falseValue?: CheckboxValuaType
}

export interface ICheckboxEmits {
  (e: 'update:modelValue', value: CheckboxValuaType): void
  (e: 'change', value: CheckboxValuaType, event: Event): void
}

export type ICheckboxGroupContext = {
  modelValue: Ref<CheckboxValuaType[]>
  circle?: boolean
  direction?: CheckboxGroupDirection
  disabled?: boolean
  handleChange: (value: CheckboxValuaType) => void
}

export const CheckboxGroupContextKey: InjectionKey<ICheckboxGroupContext> =
  Symbol('CheckboxGroupContextKey')
