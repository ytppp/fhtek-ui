<template>
  <form>
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { ref, provide, computed, withDefaults } from 'vue'
import { useProviderDisabled } from '@fhtek-ui/components/config-provider/disabled-context'
import type {
  IFormContext,
  IFormProps,
  RegisterLabelWidth,
  DeregisterLabelWidth,
  FormItemValidation,
} from './interface'
import { FormContextKey } from './interface'

defineOptions({
  name: 'FhForm',
})

const props = withDefaults(defineProps<IFormProps>(), {
  model: () => ({}),
  rules: () => ({}),
  disabled: false,
  labelPosition: 'top',
  labelWidth: '', // auto
})
const potentialLabelWidthArr = ref([])
const formItemValidations = ref<FormItemValidation[]>([])

const disabled = computed(() => props.disabled)

useProviderDisabled(disabled)

const registerFormItemValidation = (validates: FormItemValidation) => {
  formItemValidations.value.push(validates)
}
const validate = () => {
  let result = true
  formItemValidations.value.forEach((validates) => {
    result = validates.validate() && result
  })
  return result
}
const clearValidate = () => {
  formItemValidations.value.forEach((validates) => {
    validates.clearValidate()
  })
}
const getLabelWidthIndex = (width: number) => {
  const index = potentialLabelWidthArr.value.indexOf(width as never)
  if (index === -1) {
    throw new Error(`[Form]unexpected width ${width}`)
  }
  return index
}
const registerLabelWidth: RegisterLabelWidth = (val: number, oldVal: number) => {
  if (val && oldVal) {
    const index = getLabelWidthIndex(oldVal)
    potentialLabelWidthArr.value.splice(index, 1, val as never)
  } else if (val) {
    potentialLabelWidthArr.value.push(val as never)
  }
}
const deregisterLabelWidth: DeregisterLabelWidth = (val: number) => {
  const index = getLabelWidthIndex(val)
  potentialLabelWidthArr.value.splice(index, 1)
}

const formContext: IFormContext = computed(() => ({
  autoLabelWidth: `${Math.max(...potentialLabelWidthArr.value)}px`,
  labelWidth: props.labelWidth,
  labelPosition: props.labelPosition,
  rules: props.rules,
  model: props.model,
  registerLabelWidth,
  deregisterLabelWidth,
  registerFormItemValidation,
}))

provide(FormContextKey, formContext)

defineExpose<FormItemValidation>({
  validate,
  clearValidate,
})
</script>

<style lang="less"></style>
