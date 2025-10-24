<template>
  <button :class="classes" :disabled="mergedDisabled" :type="nativeType" @click="handleClick">
    <template v-for="(node, index) in processedSlots" :key="index">
      {{ node }}
    </template>
  </button>
</template>

<script lang="ts" setup>
import { computed, useSlots, withDefaults } from 'vue'
import type { VNode } from 'vue'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar)

defineOptions({
  name: 'FhButton',
})

type ButtonSize = 'small' | 'middle'
type ButtonType = 'primary' | 'text'
type ButtonNativeType = 'button' | 'submit' | 'reset' | undefined

export interface IButtonProps {
  disabled?: boolean
  notDisabled?: boolean // Determine whether the button is not disabled. If true, it will override the disabled property.
  block?: boolean
  plain?: boolean // Determine whether it's a plain button. Refer to: https://element.eleme.cn/#/zh-CN/component/button
  size?: ButtonSize
  type?: ButtonType
  name?: string
  nativeType?: ButtonNativeType
  needInserted?: boolean // Add a space between two Chinese characters
}

// Emits 类型
export interface IButtonEmits {
  click: [e: MouseEvent]
}

const props = withDefaults(defineProps<IButtonProps>(), {
  disabled: false,
  notDisabled: false,
  block: false,
  plain: false,
  size: 'middle',
  type: 'primary',
  name: '',
  nativeType: 'button',
  needInserted: true,
})
const emit = defineEmits<IButtonEmits>()
const slots = useSlots()
const disabledContext = useInjectDisabled()
const mergedDisabled = computed(() => {
  if (props.notDisabled) {
    return false
  }
  return props.disabled || disabledContext.value
})
const classes = computed(() => [
  'btn',
  `btn--${props.type}`,
  `btn--${props.size}`,
  {
    'is-disabled': mergedDisabled.value,
    'is-block': props.block,
    'is-plain': props.type !== 'text' && props.plain,
  },
])
const processedSlots = computed(() => {
  const defaultSlots = slots.default?.() || []
  return defaultSlots.map((node) => insertSpace(node))
})

const handleClick = (event: MouseEvent) => {
  if (!mergedDisabled.value) {
    emit('click', event)
  }
}
const insertSpace = (node: VNode) => {
  if (typeof node.children === 'string') {
    let text = node.children.trim()
    if (props.needInserted && isTwoCNChar(text)) {
      text = text.split('').join(' ')
    }
    return text
  }
  return node
}
</script>

<style lang="less">
@import '../style/base.less';
.btn {
  outline: none;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  position: relative;
  border-width: 1px;
  border-style: solid;
  &.btn--primary {
    border-color: @button-primary-border-color;
    color: @button-primary-text-color;
    background-color: @button-primary-background-color;
    &:active {
      background-color: @button-primary-active-background-color;
    }
    &:hover {
      background-color: @button-primary-hover-background-color;
    }
    &.is-disabled {
      cursor: not-allowed;
      background-color: @button-disabled-background-color;
      border-color: @button-disabled-border-color;
      color: @button-disabled-text-color;
    }
    &.is-plain {
      border-color: @button-primary-plain-border-color;
      color: @button-primary-plain-text-color;
      background-color: @button-primary-plain-background-color;
      &:active {
        color: @button-primary-plain-active-text-color;
      }
      &:hover {
        border-color: @button-primary-plain-hover-border-color;
        color: @button-primary-plain-hover-text-color;
        background-color: @button-primary-plain-hover-background-color;
      }
      &.is-disabled {
        cursor: not-allowed;
        background-color: @button-disabled-plain-background-color;
        border-color: @button-disabled-plain-border-color;
        color: @button-disabled-plain-text-color;
      }
    }
    &.btn--small {
      width: auto;
      min-width: 80px;
      height: 28px;
      line-height: 1;
      padding: 5px 10px;
      font-size: 12px;
      border-radius: 4px;
    }
    &.btn--middle {
      width: auto;
      min-width: 120px;
      height: 48px;
      line-height: 1;
      padding: 12px 8px;
      font-size: 14px;
      border-radius: 4px;
    }
  }
  &.btn--text {
    padding-left: 0;
    padding-right: 0;
    border-color: @button-text-border-color;
    color: @button-text-text-color;
    background-color: @button-text-background-color;
    &:active {
      color: @button-text-active-text-color;
    }
    &:hover {
      color: @button-text-hover-text-color;
    }
    &.is-disabled {
      cursor: not-allowed;
      color: @button-text-disabled-text-color;
    }
    &.btn--small {
      padding: 5px 0;
      font-size: 12px;
    }
    &.btn--middle {
      padding: 12px 0;
      font-size: 14px;
    }
  }
  &.is-block {
    width: 100% !important;
    max-width: @form-item-max-width !important;
  }
}
</style>
