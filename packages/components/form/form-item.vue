<template>
  <div
    ref="formItemRef"
    class="form-item"
    :class="{
      'is-success': success,
      'is-error': error,
    }"
  >
    <LabelWrap
      :is-auto-width="labelStyle && labelStyle.width === 'auto'"
      :update-all="labelWidthCom === 'auto'"
      :label-position="labelPositionCom"
    >
      <label
        v-if="label || slots.label"
        class="form-item__label"
        :title="label"
        :for="labelFor"
        :class="`form-item__label--${labelPositionCom}`"
        :style="labelStyle"
      >
        <slot name="label">{{ label }}</slot>
      </label>
    </LabelWrap>
    <div class="form-item__content" :style="contentStyle">
      <slot></slot>
    </div>
    <transition name="form-item-error">
      <div v-if="error" class="form-item__error" :style="contentStyle">{{ validateMessage }}</div>
    </transition>
    <div v-if="slots.extra" class="form-item__extra" :style="contentStyle">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, inject, useSlots, useTemplateRef, useId } from 'vue'
// import Schema from 'async-validator'
import LabelWrap from './label-wrap.vue'
import type {
  FormExpose,
  IFormContext,
  IFormItemContext,
  IFormItemProps,
  IFormItemRule,
} from './interface'
import { FormContextKey, FormItemContextKey } from './interface'

defineOptions({
  name: 'FhFormItem',
})

const props = withDefaults(defineProps<IFormItemProps>(), {
  cancelBlurValidate: false,
})
const id = useId()
const slots = useSlots()
const formItemRef = useTemplateRef('formItemRef')
const validateMessage = ref('')
const computedLabelWidth = ref('')
const result = ref<boolean | null>(null) // null表示没有进行校验，true通过，false未通过
const form = inject<IFormContext | null>(FormContextKey, null)

const labelWidthCom = computed(() => {
  return props.labelWidth || form?.value.labelWidth
})
const labelPositionCom = computed(() => {
  return props.labelPosition || form?.value.labelPosition
})
const labelStyle = computed(() => {
  const ret: { width?: string } = {}
  if (labelPositionCom.value === 'top') return ret
  if (labelWidthCom.value) {
    ret.width = labelWidthCom.value
  }
  return ret
})
const contentStyle = computed(() => {
  const ret: { marginLeft?: string } = {}
  if (labelPositionCom.value === 'top') return ret
  if (labelWidthCom.value === 'auto') {
    if (props.labelWidth === 'auto') {
      ret.marginLeft = computedLabelWidth.value
    } else if (form?.value.labelWidth === 'auto') {
      ret.marginLeft = form?.value.autoLabelWidth
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

const updateComputedLabelWidth = (width: number) => {
  computedLabelWidth.value = width ? `${width}px` : ''
}
const getValueByPath = (obj: object, path: string) => {
  let tempObj: any = obj
  // // remove start dot in path
  // path = path.replace(/^\./, '')
  // // replace .=>[]
  // path = path.replace(/\.(\w+)(?=\.|\[|$)/g, '[$1]')
  // // replace start key
  // path = path.replace(/^(\w+)/, '[$1]')
  // // sometime path is empty when init, so match will get null
  // let keyArr = path.match(/(?:\[)(.*?)(?:\])/g) || []
  // // remove [|]|"|' in key
  // keyArr = keyArr.map((k) => k.replace(/(\[|\]|"|')/g, ''))
  // let i = 0
  // for (let len = keyArr.length; i < len - 1; i += 1) {
  //   if (!tempObj) break
  //   const key = keyArr[i]
  //   if (key in tempObj) {
  //     tempObj = tempObj[key]
  //   }
  // }
  // return tempObj ? tempObj[keyArr[i]] : null

  const keys = path.split('.')
  for (const k of keys) {
    if (tempObj && typeof tempObj === 'object' && k in tempObj) {
      tempObj = tempObj[k]
    } else {
      return ''
    }
  }
  return typeof tempObj !== 'object' ? tempObj : ''
}
const validate = () => {
  if (props.prop && formItemRef.value) {
    const rules: { [key: string]: any } = form?.value.rules || {}
    let validators: IFormItemRule[] = []
    if (rules[props.prop]) {
      validators = validators.concat(rules[props.prop])
    } else {
      const keys = props.prop.split('.')
      let tempObj: any = rules
      for (const k of keys) {
        tempObj = tempObj[k]
        if (tempObj && Array.isArray(tempObj) && k in tempObj) {
          validators = validators.concat(tempObj)
          break
        }
      }
    }
    if (props.rules) {
      validators = validators.concat(props.rules)
    }
    const value = getValueByPath(form?.value.model as object, props.prop)
    let flag = true
    if (validators && validators.length) {
      for (let j = 0; j < validators.length; j++) {
        const validator = validators[j] as IFormItemRule
        if (!validator.rule(value)) {
          flag = false
          validateMessage.value = validator.message
          break
        }
      }
    }
    result.value = flag
    return result.value
  }
  return true
}
const clearValidate = () => {
  result.value = null
}
const extraValidate = (validator: () => boolean, msg: string) => {
  let flag = true
  if (!validator()) {
    flag = false
    validateMessage.value = msg
  }
  result.value = flag
}

if (props.prop) {
  form?.value.registerFormItemValidation({
    validate,
    clearValidate,
  })
}

const formItemContext: IFormItemContext = computed(() => ({
  clearValidate,
  validate,
  updateComputedLabelWidth,
  label: props.label as string,
  cancelBlurValidate: props.cancelBlurValidate,
  id,
}))

provide(FormItemContextKey, formItemContext)
defineExpose<FormExpose>({
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
