import type { InjectionKey, Ref } from 'vue'

export type RadioValuaType = boolean | string | number
type RadioGroupDirection = 'horizontal' | 'vertical'

export interface IRadioGroupProps {
  modelValue: RadioValuaType
  disabled?: boolean
  direction?: RadioGroupDirection
}

export interface IRadioGroupEmits {
  (e: 'update:modelValue', value: RadioValuaType): void
  (e: 'change', value: RadioValuaType): void
}

export interface IRadioProps {
  modelValue?: RadioValuaType
  value?: RadioValuaType
  label?: string
  disabled?: boolean
  name?: string
}

export interface IRadioEmits {
  (e: 'update:modelValue', value: RadioValuaType): void
  (e: 'change', value: RadioValuaType, event: Event): void
}

export type IRadioGroupContext = {
  modelValue: Ref<RadioValuaType>
  direction?: RadioGroupDirection
  disabled?: boolean
  updateModel: (value: RadioValuaType) => void
}

export const RadioGroupContextKey: InjectionKey<IRadioGroupContext> = Symbol('RadioGroupContextKey')
