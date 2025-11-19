<template>
  <label
    class="radio"
    :class="{
      'is-selected': isChecked,
      'is-disabled': isDisabled,
    }"
  >
    <span
      class="radio__input"
      :class="{
        'is-selected': isChecked,
        'is-disabled': isDisabled,
      }"
    >
      <span class="radio__inner"></span>
      <input
        ref="radio"
        class="radio__original"
        :value="value"
        :checked="isChecked"
        type="radio"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
        autocomplete="off"
      />
    </span>
    <span class="radio__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import {
  RadioGroupContextKey,
  type IRadioEmits,
  type IRadioGroupContext,
  type IRadioProps,
} from './interface'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'

defineOptions({
  name: 'FhRadio',
})

const props = withDefaults(defineProps<IRadioProps>(), {
  modelValue: false,
  value: false,
  label: '',
  name: '',
})
const emit = defineEmits<IRadioEmits>()
const radioGroup = inject<IRadioGroupContext | null>(RadioGroupContextKey, null)
const disabledContext = useInjectDisabled()

const isChecked = computed({
  get: () => {
    if (radioGroup) {
      return radioGroup.modelValue.value === props.value
    }
    return props.modelValue === props.value
  },
  set: (value) => {
    if (radioGroup) {
      radioGroup.updateModel(value)
    } else {
      emit('update:modelValue', value)
    }
  },
})
const isDisabled = computed(() => {
  if (radioGroup) {
    return radioGroup.disabled || props.disabled || disabledContext.value
  }
  return props.disabled || disabledContext.value
})

const handleChange = (e: Event) => {
  if (isDisabled.value) return

  const target = e.target as HTMLInputElement
  const checked = target.checked
  const emitValue = props.value ?? checked
  if (radioGroup) {
    radioGroup.updateModel(emitValue)
  } else {
    emit('update:modelValue', emitValue)
    emit('change', emitValue, e)
  }
}
</script>

<style lang="less">
.radio {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  font-size: 14px;
  user-select: none;
  &.is-selected {
    .radio__inner {
      border-color: @radio-item-selected-color;
      position: relative;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: @radio-item-selected-color;
        border-radius: 50%;
      }
    }
  }
  &.is-disabled {
    .radio__inner {
      border-color: #e4e7ed;
      cursor: not-allowed;
      &::after {
        cursor: not-allowed;
        background-color: #f5f7fa;
      }
    }
    .radio__input {
      &.is-selected {
        .radio__inner {
          border-color: #e4e7ed;
          &::after {
            background-color: #c0c4cc;
          }
        }
      }
    }
    .radio__label {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .radio__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  }
  .radio__inner {
    cursor: pointer;
    display: inline-block;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    border-radius: 9px;
    border: 1px solid @radio-item-color;
  }
  .radio__original {
    opacity: 0;
    outline: none;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
  }
  .radio__label {
    padding-left: 12px;
    font-size: 14px;
  }
}
</style>
