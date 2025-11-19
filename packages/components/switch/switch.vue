<template>
  <div class="switch" @click.prevent="switchValue">
    <input
      class="switch__input"
      type="checkbox"
      @change="handleChange"
      ref="input"
      :id="id"
      :name="name"
      :true-value="activeValue"
      :false-value="inactiveValue"
      :disabled="switchDisabled"
      :value="model"
      checked
      @keydown.enter="switchValue"
    />
    <span
      class="switch__inner"
      :class="{ 'is-checked': checked, 'is-disabled': switchDisabled }"
    ></span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { FormItemContextKey, type IFormItemContext } from '@fhtek-ui/components/form'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'

defineOptions({
  name: 'FhSwitch',
})

export interface ISwitchProps {
  modelValue?: boolean | string | number
  disabled?: boolean
  label?: string
  value?: boolean | string | number
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
  name?: string
}
export interface ISwitchEmits {
  (e: 'change', value: boolean | string | number): void
  (e: 'input', value: boolean | string | number): void
}

const formItem = inject<IFormItemContext | null>(FormItemContextKey, null)
const disabledContext = useInjectDisabled()

const props = withDefaults(defineProps<ISwitchProps>(), {
  disabled: false,
  value: false,
  activeValue: true,
  inactiveValue: false,
})
const model = defineModel<boolean | string | number>({
  default: '',
})
const emit = defineEmits<ISwitchEmits>()

const id = computed(() => {
  return formItem?.value.id
})
const checked = computed(() => {
  return model.value === props.activeValue
})
const switchDisabled = computed(() => {
  return props.disabled || disabledContext.value
})

const handleChange = () => {
  const newValue = model.value === props.activeValue ? props.inactiveValue : props.activeValue
  model.value = newValue
  emit('input', newValue)
  emit('change', newValue)
}
const switchValue = () => {
  !switchDisabled.value && handleChange()
}
</script>

<style lang="less">
.switch {
  display: inline-flex;
  align-items: center;
  .switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
  }
  .switch__inner {
    cursor: pointer;
    width: 46px;
    height: 22px;
    position: relative;
    background-color: @switch-background-color;
    border-radius: 22px;
    background-clip: content-box;
    display: inline-block;
    -webkit-appearance: none;
    user-select: none;
    outline: none;
    &::before {
      content: '';
      width: 16px;
      height: 16px;
      position: absolute;
      top: 3px;
      left: 3px;
      border-radius: 16px;
      background-color: @switch-circle-color;
      transition: left 0.3s;
    }
    &.is-checked {
      border-color: @switch-checked-color;
      background-color: @switch-checked-color;
      transition:
        border ease 0.4s,
        box-shadow ease 0.4s,
        background-color ease 1.2s;
      &::before {
        left: 26px;
      }
    }
    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}
</style>
