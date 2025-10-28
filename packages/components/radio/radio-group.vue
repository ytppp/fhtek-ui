<template>
  <div class="radio-group" :class="`is-${direction}`">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide, computed } from 'vue'

defineOptions({
  name: 'FhRadioGroup',
  componentName: 'FhRadioGroup',
})

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
  },
  disabled: Boolean,
})

const model = defineModel({
  type: [String, Number, Boolean],
  default: '',
})
const emit = defineEmits(['change', 'input'])

const handleChange = (val) => {
  emit('change', val)
}
const handleInput = (val) => {
  emit('input', val)
}
const updateModel = (value) => {
  model.value = value
  handleChange(model.value)
}

provide('radioGroup', {
  model,
  direction: computed(() => props.direction),
  disabled: computed(() => props.disabled),
  handleInput,
  handleChange,
  updateModel,
})
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
