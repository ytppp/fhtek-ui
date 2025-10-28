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
        <li class="select__popup-item--empty" v-else>{{ $t('trans0142') }}</li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import {
  computed,
  inject,
  watch,
  nextTick,
  reactive,
  ref,
  onMounted,
  useSlots,
  useTemplateRef,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { scrollTo } from '@/util/tool'
import { computePosition, flip, shift, offset } from '@floating-ui/vue'

defineOptions({
  name: 'FhSelect',
})

const form = inject('form', null)
const formItem = inject('formItem', null)

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  height: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  name: String,
  placeholder: String,
  label: String,
  beforeChange: {
    type: Function,
    default: () => {},
  },
  notDisabled: {
    type: Boolean,
    default: false,
  },
})
const model = defineModel({
  required: true,
})
const emit = defineEmits(['focus', 'blur', 'change'])

const { t } = useI18n()
const slots = useSlots()
const selected = reactive({
  value: '',
  text: '',
})
const opened = ref(false)
const selectRef = useTemplateRef('selectRef')
const selectInputRef = useTemplateRef('selectInputRef')
const selectPopupRef = useTemplateRef('selectPopupRef')

const currentLabel = computed(() => {
  return props.label || formItem?.label.value || ''
})
const selectPlaceholder = computed(() => {
  return typeof props.placeholder !== 'undefined' ? props.placeholder : t('trans0001')
})
const selectDisabled = computed(() => {
  if (props.notDisabled) return false
  return props.disabled || form?.disabled.value
})

watch(opened, (val) => {
  if (val) {
    formItem?.clearValidate()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)
  } else {
    formItem?.validate()
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
const stopPropagation = (event) => {
  if (selectDisabled.value) event.stopPropagation()
}
const updatePosition = () => {
  const { width } = selectInputRef.value.getBoundingClientRect()
  computePosition(selectInputRef.value, selectPopupRef.value, {
    placement: 'bottom-start',
    middleware: [flip(), shift(), offset(6)],
  }).then(({ x, y }) => {
    Object.assign(selectPopupRef.value.style, {
      width: `${width}px`,
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}
const setSelected = () => {
  const option = props.options.filter((o) => o.value === model.value)[0] || {
    text: model.value,
  }
  selected.value = option.value
  selected.text = option.text
}
const scrollToSelect = () => {
  nextTick(() => {
    const popupEl = selectRef.value.querySelector('.select__popup')
    const selectEl = popupEl.querySelector('li.is-selected')
    if (selectEl) {
      const popupHeight = popupEl.clientHeight
      const elHeight = selectEl.clientHeight
      // 滚动到正中间的位置
      scrollTo(popupEl, 0, selectEl.offsetTop - popupHeight / 2 + elHeight / 2)
    }
  })
}
const select = (option) => {
  if (model.value === option.value) return
  if (props.beforeChange) props.beforeChange()
  selected.value = option.value
  selected.text = option.text
  model.value = selected.value
  emit('change', selected.value)
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
