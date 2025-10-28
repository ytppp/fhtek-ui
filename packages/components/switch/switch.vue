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

<script setup>
import { computed, inject } from 'vue'

defineOptions({
  name: 'FhButton',
})

const form = inject('form', null)
const formItem = inject('formItem', null)

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  label: { type: String },
  value: {
    type: [Boolean, String, Number],
    default: false,
  },
  activeValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  inactiveValue: {
    type: [Boolean, String, Number],
    default: false,
  },
  name: String,
})
const model = defineModel({
  type: [Boolean, String, Number],
  default: '',
})
const emit = defineEmits(['change', 'input'])

const id = computed(() => {
  return formItem?.id
})
const checked = computed(() => {
  return model.value === props.activeValue
})
const switchDisabled = computed(() => {
  return props.disabled || form?.disabled.value
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
