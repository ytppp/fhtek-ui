<template>
  <div
    class="select"
    :class="{ 'is-disabled': selectDisabled }"
    @click="open"
    v-clickoutside="close"
    ref="selectRef"
  >
    <div class="select__input" ref="selectInputRef">
      <fh-input
        readonly
        :disabled="selectDisabled"
        :not-disabled="notDisabled"
        :placeholder="selectPlaceholder"
        :label="currentLabel"
        :is-select-comp-child-node="true"
        v-model="selected.text"
        @blur="inputBlurHandler"
        @focus="inputFocusHandler"
      >
        <template v-slot:prefix v-if="slots.prefix">
          <slot name="prefix"></slot>
        </template>
        <template #suffix>
          <fh-icon
            :class="['select__caret', 'input__icon', opened ? 'is-reverse' : '']"
            name="icon-down"
            @click="stopPropagation"
          ></fh-icon>
        </template>
      </fh-input>
    </div>
    <transition name="select">
      <ul class="select__popup" ref="selectPopupRef" v-show="opened">
        <template v-if="options.length">
          <li
            class="select__popup-item"
            :class="{
              'is-selected': selected.value === option.value,
            }"
            :key="option.value"
            @click.stop="select(option)"
            v-for="option in options"
          >
            <div
              v-if="option.render && typeof option.render === 'function'"
              v-html="option.render()"
            ></div>
            <span v-else>{{ option.text }}</span>
          </li>
        </template>
        <li class="select__popup-item--empty" v-else>{{ $t('select.empty') }}</li>
      </ul>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  watch,
  nextTick,
  ref,
  onMounted,
  useSlots,
  useTemplateRef,
  withDefaults,
} from 'vue'
import { useI18n } from '@fhtek-ui/locale'
import { scrollTo } from '@fhtek-ui/utils/tool'
import { computePosition, flip, shift, offset } from '@floating-ui/vue'
import { FormItemContextKey, type IFormItemContext } from '@fhtek-ui/components/form'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'

defineOptions({
  name: 'FhSelect',
})

interface ISelectOption {
  value: string | number
  text: string
  render?: () => string
}

export interface ISelectProps {
  options: ISelectOption[]
  height?: number
  disabled?: boolean
  name?: string
  placeholder?: string
  label?: string
  beforeChange?: (value: string | number) => boolean
  notDisabled?: boolean
}
export interface ISelectEmits {
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'change', value: string | number): void
}

const props = withDefaults(defineProps<ISelectProps>(), {
  options: () => [],
  height: 0,
  disabled: false,
  name: '',
  placeholder: '',
  label: '',
  notDisabled: false,
})

const { t } = useI18n()
const slots = useSlots()
const formItem = inject<IFormItemContext | null>(FormItemContextKey, null)
const emit = defineEmits<ISelectEmits>()
const model = defineModel({
  required: true,
})
const selected = ref<ISelectOption>({
  value: '',
  text: '',
})
const opened = ref(false)
const selectRef = useTemplateRef('selectRef')
const selectInputRef = useTemplateRef('selectInputRef')
const selectPopupRef = useTemplateRef('selectPopupRef')
const disabledContext = useInjectDisabled()

const currentLabel = computed(() => {
  return props.label || formItem?.value.label || ''
})
const selectPlaceholder = computed(() => {
  return typeof props.placeholder !== 'undefined' ? props.placeholder : t('select.placeholder')
})
const selectDisabled = computed(() => {
  if (props.notDisabled) return false
  return props.disabled || disabledContext.value
})

watch(opened, (val) => {
  if (val) {
    formItem?.value.clearValidate()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
  } else {
    formItem?.value.validate()
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition)
  }
})
watch(
  () => model.value,
  () => setSelected(),
)
watch(
  () => props.options,
  () => setSelected(),
  {
    deep: true,
  },
)
const stopPropagation = (event: MouseEvent) => {
  if (selectDisabled.value) event.stopPropagation()
}
const updatePosition = () => {
  if (!selectInputRef.value || !selectPopupRef.value) return
  const { width } = selectInputRef.value.getBoundingClientRect()
  computePosition(selectInputRef.value, selectPopupRef.value, {
    placement: 'bottom-start',
    middleware: [flip(), shift(), offset(6)],
  }).then(({ x, y }) => {
    if (!selectPopupRef.value) return
    Object.assign(selectPopupRef.value.style, {
      width: `${width}px`,
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}
const setSelected = () => {
  const option =
    props.options.filter((o) => o.value === model.value)[0] ||
    ({
      text: model.value,
    } as ISelectOption)
  selected.value.value = option.value
  selected.value.text = option.text
}
const scrollToSelect = () => {
  nextTick(() => {
    if (!selectRef.value) return
    const popupEl = selectRef.value.querySelector('.select__popup') as HTMLElement
    if (!popupEl) return
    const selectEl = popupEl.querySelector('li.is-selected') as HTMLElement
    if (selectEl) {
      const popupHeight = popupEl.clientHeight
      const elHeight = selectEl.clientHeight
      // 滚动到正中间的位置
      scrollTo(popupEl, 0, selectEl.offsetTop - popupHeight / 2 + elHeight / 2)
    }
  })
}
const select = (option: ISelectOption) => {
  if (model.value === option.value) return
  if (props.beforeChange && !props.beforeChange(option.value)) return
  selected.value.value = option.value
  selected.value.text = option.text
  model.value = selected.value.value
  emit('change', selected.value.value)
  opened.value = false
}
const open = () => {
  if (!props.disabled) {
    opened.value = !opened.value
    if (opened.value) {
      updatePosition()
      scrollToSelect()
    }
  }
}
const close = () => {
  opened.value = false
}
const inputBlurHandler = () => {
  emit('blur')
}
const inputFocusHandler = () => {
  emit('focus')
}
onMounted(() => {
  setSelected()
})
</script>

<style lang="less">
.select {
  width: 100%;
  &.is-disabled {
    .input {
      .input__inner {
        cursor: not-allowed;
      }
    }
  }
  .select__caret {
    transition: transform 0.2s linear;
    &.is-reverse {
      transform: rotate(180deg);
    }
  }
  .input {
    width: 100%;
    .input__inner {
      cursor: pointer;
    }
  }
  .select__popup {
    position: absolute;
    z-index: 2000;
    top: 0;
    left: 0;
    font-size: 14px;
    max-height: 238px;
    background: @select-popup-background-color;
    border-radius: 5px;
    border: 1px solid @select-popup-border-color;
    overflow: auto;
  }
  .select__popup-item {
    list-style: none;
    padding: 10px;
    line-height: 1;
    cursor: pointer;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    &:active {
      background: @select-item-active-background-color;
      color: @select-item-active-color;
    }
    &:hover {
      background: @select-item-hover-background-color;
      color: @select-item-hover-color;
    }
    &.is-selected {
      color: @select-item-selected-color;
    }
  }
  .select__popup-item--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 84px;
    font-size: 14px;
    background-color: #fff;
    color: #999;
  }
}
.select-enter-active,
.select-leave-active {
  opacity: 1;
  transform: scaleY(1);
  transition:
    transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
    opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center top;
}
.select-enter,
.select-leave-active {
  opacity: 0;
  transform: scaleY(0);
}
</style>
