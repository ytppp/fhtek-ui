<template>
  <div
    class="form-item"
    :class="{
      'is-success': success,
      'is-error': error,
    }"
    ref="formItemRef"
  >
    <label-wrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="labelWidthCom === 'auto'"
      :label-position="labelPositionCom"
    >
      <label
        class="form-item__label"
        :title="label"
        :for="labelFor"
        :class="`form-item__label--${labelPositionCom}`"
        :style="labelStyle"
        v-if="label || slots.label"
      >
        <slot name="label">{{ label }}</slot>
      </label>
    </label-wrap>
    <div class="form-item__content" :style="contentStyle">
      <slot></slot>
    </div>
    <transition name="form-item-error">
      <div v-if="error" class="form-item__error" :style="contentStyle">{{ validateMessage }}</div>
    </transition>
    <div class="form-item__extra" :style="contentStyle" v-if="slots.extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, inject, useSlots, useTemplateRef, useId } from 'vue'
import LabelWrap from './label-wrap.vue'

defineOptions({
  name: 'FormItem',
  componentName: 'FormItem',
})

const props = defineProps({
  label: {
    type: String,
  },
  prop: {
    type: String,
  },
  for: {
    type: String,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  labelPosition: {
    type: String,
    validator: function (value) {
      return ['top', 'left', 'right'].indexOf(value) !== -1
    },
  },
  labelWidth: {
    type: String,
  },
  cancelBlurValidate: {
    type: Boolean,
    default: false,
  },
})
const id = useId()
const slots = useSlots()
const formItemRef = useTemplateRef('formItemRef')
const validateMessage = ref('')
const computedLabelWidth = ref('')
const result = ref(null) // null表示没有进行校验，true通过，false未通过
const form = inject('form', {})
const registerFormItem = inject('registerFormItem')

const labelWidthCom = computed(() => {
  return props.labelWidth || form.labelWidth.value
})
const labelPositionCom = computed(() => {
  return props.labelPosition || form.labelPosition.value
})
const labelStyle = computed(() => {
  const ret = {}
  if (labelPositionCom.value === 'top') return ret
  if (labelWidthCom.value) {
    ret.width = labelWidthCom.value
  }
  return ret
})
const contentStyle = computed(() => {
  const ret = {}
  if (labelPositionCom.value === 'top') return ret
  if (labelWidthCom.value === 'auto') {
    if (props.labelWidth === 'auto') {
      ret.marginLeft = computedLabelWidth.value
    } else if (form.labelWidth.value === 'auto') {
      ret.marginLeft = form.autoLabelWidth.value
    }
  } else {
    ret.marginLeft = labelWidthCom.value
  }
  return ret
})
const labelFor = computed(() => {
  return props.for || id
})
const error = computed(() => {
  return result.value !== null && result.value === false
})
const success = computed(() => {
  return result.value === true
})

const updateComputedLabelWidth = (width) => {
  computedLabelWidth.value = width ? `${width}px` : ''
}
const getValueByPath = (obj, path) => {
  let tempObj = obj
  // remove start dot in path
  path = path.replace(/^\./, '')
  // replace .=>[]
  path = path.replace(/\.(\w+)(?=\.|\[|$)/g, '[$1]')
  // replace start key
  path = path.replace(/^(\w+)/, '[$1]')
  // sometime path is empty when init, so match will get null
  let keyArr = path.match(/(?:\[)(.*?)(?:\])/g) || []
  // remove [|]|"|' in key
  keyArr = keyArr.map((k) => k.replace(/(\[|\]|"|')/g, ''))
  let i = 0
  for (let len = keyArr.length; i < len - 1; i += 1) {
    if (!tempObj) break
    const key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    }
  }
  return tempObj ? tempObj[keyArr[i]] : null
}
const validate = () => {
  if (props.prop && formItemRef.value) {
    const rules = form.rules.value || {}
    let validators = rules[props.prop] || []
    if (props.rules) {
      validators = validators.concat(props.rules)
    }
    const value = getValueByPath(form.model.value, props.prop)
    let this_result = true
    if (validators && validators.length) {
      for (let j = 0; j < validators.length; j++) {
        const validator = validators[j]
        if (!validator.rule(value)) {
          this_result = false
          validateMessage.value = validator.message
          break
        }
      }
    }
    result.value = this_result
    return result.value
  }
  return true
}
const clearValidate = () => {
  result.value = null
}
const extraValidate = (validator, msg, ...arg) => {
  let this_result = true
  if (!validator(...arg)) {
    this_result = false
    validateMessage.value = msg
  }
  result.value = this_result
  return result
}

registerFormItem({
  validate,
  clearValidate,
})

provide('formItem', {
  clearValidate,
  validate,
  updateComputedLabelWidth,
  label: computed(() => props.label),
  cancelBlurValidate: computed(() => props.cancelBlurValidate),
  id,
})
defineExpose({
  extraValidate,
  clearValidate,
  validate,
})
</script>

<style lang="less">
.form-item {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0 !important;
  }
  .form-item__label {
    display: inline-block;
    box-sizing: border-box;
    font-size: 16px;
    color: #000;
    font-weight: 500;
    &.form-item__label--top {
      float: none;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    &.form-item__label--left,
    &.form-item__label--right {
      float: left;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
      padding-right: 30px;
      min-height: 40px;
      display: flex;
      align-items: center;
    }
    &.form-item__label--left {
      text-align: left;
      justify-content: flex-start;
    }
    &.form-item__label--right {
      text-align: right;
      justify-content: flex-end;
    }
  }
  .form-item__content {
    position: relative;
    min-height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .form-item__error {
    color: @form-item-error-color;
    font-size: 12px;
    margin-top: 4px;
    line-height: 1;
    opacity: 1;
    transform: scaleY(1);
    &.form-item-error-enter-active,
    &.form-item-error-leave-active {
      transition: @fade-transition;
      transform-origin: center top;
    }
    &.form-item-error-enter-from,
    &.form-item-error-leave-to {
      opacity: 0;
      transform: scaleY(0);
    }
  }
  .form-item__extra {
    margin-top: 8px;
    font-size: 12px;
    color: #6e6e6e;
  }
  &.is-error {
    .input {
      .input__inner {
        border-color: @form-item-error-color !important;
        transition: border 0.3 linear;
      }
    }
  }
}
</style>
