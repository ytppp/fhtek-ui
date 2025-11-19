<template>
  <div class="radio-group" :class="`is-${direction}`">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, withDefaults, type Ref } from 'vue'
import {
  type RadioValuaType,
  type IRadioGroupProps,
  type IRadioGroupEmits,
  RadioGroupContextKey,
  type IRadioGroupContext,
} from './interface'

defineOptions({
  name: 'FhRadioGroup',
})

const props = withDefaults(defineProps<IRadioGroupProps>(), {
  modelValue: '',
  direction: 'horizontal',
  disabled: false,
})

const emit = defineEmits<IRadioGroupEmits>()
const radioValue: Ref<boolean | string | number> = ref(props.modelValue)
const updateModel = (value: RadioValuaType) => {
  radioValue.value = value
  emit('update:modelValue', radioValue.value)
  emit('change', radioValue.value)
}

const radioGroupContext: IRadioGroupContext = {
  modelValue: radioValue,
  direction: props.direction,
  disabled: props.disabled,
  updateModel,
}

provide(RadioGroupContextKey, radioGroupContext)
</script>

<style lang="less">
.radio-group {
  display: flex;
  &.is-vertical {
    flex-direction: column;
    .radio {
      margin-top: 20px;
      align-items: start;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  &.is-horizontal {
    flex-wrap: wrap;
    .radio {
      margin-right: 30px;
      margin-top: 6px;
    }
  }
}
</style>
