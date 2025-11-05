<template>
  <div
    :class="[
      type === 'textarea' ? 'textarea' : 'input',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'input-group': slots.prepend || slots.append,
        'input-group--append': slots.append,
        'input-group--prepend': slots.prepend,
        'input--prefix': slots.prefix || prefixIcon,
        'input--suffix': slots.suffix || suffixIcon || clearable || showPassword,
      },
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="input-group__prepend" v-if="slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- :autocomplete="autocomplete" -->
      <input
        :tabindex="tabindex"
        v-bind="attrs"
        class="input__inner"
        :value="model"
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :placeholder="placeholder"
        :name="name"
        :id="id"
        :aria-label="currentLabel"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      />
      <!-- 前置内容 -->
      <span class="input__prefix" v-if="slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
      </span>
      <!-- 后置内容 -->
      <span class="input__suffix" v-if="getSuffixVisible()">
        <span class="input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="input__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
          </template>
          <fh-icon
            v-if="showClear"
            class="input__icon input__clear"
            name="icon-circle-close"
            @mousedown.prevent
            @click="clear"
          ></fh-icon>
          <fh-icon
            v-if="showPwdVisible"
            class="input__icon input__clear"
            :name="passwordVisible ? 'icon-eye' : 'icon-eye-close'"
            @mousedown.prevent
            @click="handlePasswordVisible"
          ></fh-icon>
          <span v-if="isWordLimitVisible" class="input__count">
            <span class="input__count-inner"> {{ textLength }}/{{ upperLimit }} </span>
          </span>
        </span>
      </span>
      <!-- 后置元素 -->
      <div class="input-group__append" v-if="slots.append">
        <slot name="append"></slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots, useAttrs, inject, useTemplateRef, withDefaults } from 'vue'

defineOptions({
  name: 'FhButton',
  // inheritAttrs: false,
})
export interface IInputProps {
  prefixIcon: string
  suffixIcon: string
  tabindex: string
  label: string
  name: string
  placeholder: string
  disabled: boolean
  notDisabled: boolean // Determine whether the input is not disabled. If true, it will override the disabled property.
  readonly: boolean
  type: string
  autocomplete: string
  clearable: boolean
  showPassword: boolean
  showWordLimit: boolean
  isSelectCompChildNode: boolean
}
const props = withDefaults(defineProps<IInputProps>(), {
  prefixIcon: '',
  suffixIcon: '',
  tabindex: '',
  label: '',
  name: '',
  placeholder: '',
  disabled: false,
  notDisabled: false,
  readonly: false,
  type: 'text',
  autocomplete: 'new-password',
  clearable: false,
  showPassword: false,
  showWordLimit: false,
  isSelectCompChildNode: false,
})

const slots = useSlots()
const attrs = useAttrs()
const form = inject('form', null)
const formItem = inject('formItem', null)
const model = defineModel({
  type: [String, Number],
  default: '',
})
const hovering = ref(false)
const focused = ref(false)
const isComposing = ref(false)
const passwordVisible = ref(false)
const input = useTemplateRef('input')
const emits = defineEmits(['focus', 'blur', 'change', 'input', 'clear'])

const inputDisabled = computed(() => {
  if (props.notDisabled) {
    return false
  }
  return props.disabled || form?.disabled.value
})
const currentLabel = computed(() => {
  return props.label || formItem?.label.value || ''
})
const id = computed(() => {
  return formItem?.id
})
const isWordLimitVisible = computed(() => {
  return (
    props.showWordLimit &&
    attrs.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !inputDisabled.value &&
    !props.readonly &&
    !props.showPassword
  )
})
const inputExceed = computed(() => {
  return isWordLimitVisible.value && textLength.value > upperLimit.value
})
const showClear = computed(() => {
  return (
    props.clearable && !inputDisabled.value && !props.readonly && (focused.value || hovering.value)
  )
})
const showPwdVisible = computed(() => {
  return props.showPassword && !inputDisabled.value && !props.readonly //  && focused.value
})
const upperLimit = computed(() => {
  return attrs.maxlength
})
const textLength = computed(() => {
  if (typeof model.value === 'number') {
    return String(model.value).length
  }
  return (model.value || '').length
})

const handleCompositionStart = () => {
  isComposing.value = true
}
const handleCompositionUpdate = () => {
  isComposing.value = true
}
const handleCompositionEnd = (event: Event) => {
  if (isComposing.value) {
    isComposing.value = false
    handleInput(event)
  }
}
const handleInput = (event: Event) => {
  if (isComposing.value) return
  model.value = event.target.value
  emits('input', model.value)
}
const handleFocus = (event: Event) => {
  focused.value = true
  emits('focus', event)
  if (!props.isSelectCompChildNode) formItem?.clearValidate()
}
const handleBlur = (event: Event) => {
  focused.value = false
  emits('blur', event)
  if (!props.isSelectCompChildNode && !formItem?.cancelBlurValidate.value) formItem?.validate()
}
const handleChange = (event: Event) => {
  model.value = event.target.value
  emits('change', model.value)
  if (!props.isSelectCompChildNode) formItem?.clearValidate()
}
const clear = (event: Event) => {
  model.value = ''
  emits('clear', event)
}
const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value
}
const getSuffixVisible = () => {
  return (
    slots.suffix ||
    props.suffixIcon ||
    props.showPassword ||
    showClear.value ||
    isWordLimitVisible.value
  )
}
</script>

<style lang="less">
.input {
  position: relative;
  display: inline-block;
  width: 100%;
  position: relative;
  .input__inner {
    font-size: @input-font-size;
    padding: 0 10px;
    height: @input-height;
    line-height: 1;
    width: 100%;
    outline: 0;
    border-radius: @input-border-radius;
    border: @input-border;
    box-sizing: border-box;
    appearance: none;
    background-color: @input-background-color;
    display: inline-block;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &::-ms-reveal {
      display: none;
    }
    &::-ms-clear {
      display: none;
      width: 0;
      height: 0;
    }
    &::placeholder {
      color: @input-placeholder-color;
    }
    &:hover {
      border-color: @input-hover-border;
    }
    &:focus {
      outline: none;
      // border-color: @input-focus-border;
    }
  }
  .input__clear {
    color: @input-icon-color;
    font-size: @input-font-size;
    cursor: pointer;
    transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    &:hover {
      color: @input-clear-hover-color;
    }
  }
  .input__count {
    height: 100%;
    display: inline-flex;
    align-items: center;
    color: @color-info;
    font-size: 12px;
    .input__count-inner {
      background: @color-white;
      line-height: initial;
      display: inline-block;
      padding: 0 5px;
    }
  }
  .input__suffix {
    position: absolute;
    height: 100%;
    right: 5px;
    top: 0;
    text-align: center;
    color: @input-icon-color;
    transition: all 0.3s;
    pointer-events: none;
  }
  .input__suffix-inner {
    pointer-events: all;
  }
  .input__prefix {
    position: absolute;
    height: 100%;
    left: 5px;
    top: 0;
    text-align: center;
    color: @input-icon-color;
    transition: all 0.3s;
  }
  .input__icon {
    height: 100%;
    width: 25px;
    text-align: center;
    transition: all 0.3s;
    line-height: @input-height;
    &:after {
      content: '';
      height: 100%;
      width: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.is-active {
    .input__inner {
      outline: none;
      border-color: @color-primary;
    }
  }
  &.is-disabled {
    .input__inner {
      background-color: @input-disabled-fill;
      border-color: @input-disabled-border;
      color: @input-disabled-color;
      cursor: not-allowed;

      &::placeholder {
        color: @input-disabled-placeholder-color;
      }
    }

    .input__icon {
      cursor: not-allowed;
    }
  }
  &.is-exceed {
    .input__inner {
      border-color: @color-danger;
    }
    .input__suffix {
      .input__count {
        color: @color-danger;
      }
    }
  }
  &.input--prefix {
    .input__inner {
      padding-left: 30px;
    }
  }
  &.input--suffix {
    .input__inner {
      padding-right: 30px;
    }
  }
}
.input-group {
  line-height: normal;
  display: inline-table;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  > .input__inner {
    vertical-align: middle;
    display: table-cell;
  }
  .input-group__append,
  .input-group__prepend {
    background-color: @input-group-background-color;
    color: @color-info;
    vertical-align: middle;
    display: table-cell;
    position: relative;
    border: @input-border;
    border-radius: @input-border-radius;
    padding: 0 5px;
    width: 1px;
    white-space: nowrap;

    &:focus {
      outline: none;
    }

    .select,
    .button {
      display: inline-block;
      margin: -10px -20px;
    }

    button.button,
    div.select .input__inner,
    div.select:hover .input__inner {
      border-color: transparent;
      background-color: transparent;
      color: inherit;
      border-top: 0;
      border-bottom: 0;
    }

    .button,
    .input {
      font-size: inherit;
    }
  }
  .input-group__prepend {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .input-group__append {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &.input-group--prepend {
    .input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .select .input.is-focus .input__inner {
      border-color: transparent;
    }
  }
  &.input-group--append {
    .input__inner {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .select .input.is-focus .input__inner {
      border-color: transparent;
    }
  }
}
</style>
