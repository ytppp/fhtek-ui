<template>
  <label
    class="checkbox"
    :class="{
      'is-disabled': isDisabled,
    }"
  >
    <span
      class="checkbox__input"
      :class="{
        'is-circle': isCircle,
        'is-checked': isChecked,
        'is-disabled': isDisabled,
      }"
    >
      <span class="checkbox__inner"></span>
      <input
        v-if="trueValue || falseValue"
        class="checkbox__original"
        type="checkbox"
        :checked="isChecked"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueValue"
        :false-value="falseValue"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <input
        v-else
        class="checkbox__original"
        type="checkbox"
        :checked="isChecked"
        :disabled="isDisabled"
        :value="value"
        :name="name"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
    </span>
    <span class="checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { ref, computed, inject, withDefaults } from 'vue'
import {
  CheckboxGroupContextKey,
  type ICheckboxEmits,
  type ICheckboxGroupContext,
  type ICheckboxProps,
} from './interface'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'

defineOptions({
  name: 'FhCheckbox',
})

const props = withDefaults(defineProps<ICheckboxProps>(), {
  modelValue: false,
  value: false, // 只有在 checkbox-group 中时有效, value of the Checkbox is used inside a checkbox-group component
  circle: false,
  label: '',
  disabled: false,
  checked: false,
  name: '',
  id: '',
  trueValue: undefined,
  falseValue: undefined,
})

const emit = defineEmits<ICheckboxEmits>()
const isFocused = ref(false)
const checkboxGroup = inject<ICheckboxGroupContext | null>(CheckboxGroupContextKey, null)
const disabledContext = useInjectDisabled()
const isChecked = computed({
  get: () => {
    if (checkboxGroup) {
      return checkboxGroup.modelValue.value.includes(props.value ?? props.trueValue) as boolean
    }
    if (props.trueValue === undefined) {
      return !!props.modelValue || props.checked
    } else {
      return props.modelValue === props.trueValue
    }
  },
  set: (value) => {
    if (checkboxGroup) {
      checkboxGroup.handleChange(props.value)
    } else {
      emit('update:modelValue', value)
    }
  },
})
const isCircle = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.circle
  }
  return props.circle
})
const isDisabled = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.disabled || props.disabled || disabledContext.value
  }
  return props.disabled || disabledContext.value
})

const handleChange = (e: Event) => {
  if (isDisabled.value) return

  const target = e.target as HTMLInputElement
  const checked = target.checked
  let value
  if (checked) {
    value = props.trueValue === undefined ? true : props.trueValue
  } else {
    value = props.falseValue === undefined ? false : props.falseValue
  }

  if (checkboxGroup) {
    const emitValue = props.value ?? value
    checkboxGroup.handleChange(emitValue)
  } else {
    emit('update:modelValue', value)
    emit('change', value, e)
  }
}
</script>

<style lang="less">
.checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  &.is-disabled {
    .checkbox__inner {
      background-color: #edf2fc;
      border-color: #dcdfe6;
      cursor: not-allowed;
      &::after {
        cursor: not-allowed;
        border-color: #c0c4cc;
      }
    }
    .checkbox__input {
      &.is-checked {
        .checkbox__inner {
          background-color: #edf2fc;
          border-color: #dcdfe6;
          &::after {
            border-color: #c0c4cc;
          }
        }
      }
    }
    .checkbox__label {
      color: #c0c4cc;
      cursor: not-allowed;
    }
  }
  .checkbox__input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
    &.is-circle {
      .checkbox__inner {
        border-radius: 50%;
      }
    }
    &.is-checked {
      .checkbox__inner {
        background: @checkbox-checked-background-color;
        border-color: @checkbox-checked-background-color;
        &::after {
          transform: rotate(45deg) scaleY(1);
        }
      }
    }
  }
  .checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid @checkbox-border-color;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background: @checkbox-background-color;
    transition:
      border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    &::after {
      box-sizing: content-box;
      content: '';
      border: 1px solid @checkbox-background-color;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
  .checkbox__original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    z-index: -1;
  }
  .checkbox__label {
    display: inline-block;
    padding-left: 10px;
    line-height: 19px;
    font-size: 14px;
    white-space: normal;
  }
}
</style>
