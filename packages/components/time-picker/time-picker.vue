<template>
  <div class="time-picker" @click="open" v-clickoutside="close">
    <div class="time-picker__input" ref="timePickerInputRef">
      <fh-input
        readonly
        :disabled="selectDisabled"
        :placeholder="selectPlaceholder"
        :label="currentLabel"
        v-model="model"
        :name="name"
      >
        <template v-slot:prefix v-if="$slots.prefix">
          <slot name="prefix"></slot>
        </template>
        <template v-slot:suffix>
          <fh-icon
            :class="['time-picker__caret', 'input__icon', opened ? 'is-reverse' : '']"
            name="icon-down"
          ></fh-icon>
        </template>
      </fh-input>
    </div>
    <transition name="select">
      <div class="time-picker__popup" ref="combo" v-show="opened">
        <div class="time-picker__popup-wrap">
          <ul class="time-picker__popup-list" ref="h">
            <li
              class="time-picker__popup-item"
              v-for="(v, i) in hs"
              :key="i"
              @click.stop="() => select('h', v)"
              :class="{ selected: time.h === v }"
            >
              {{ v }}
            </li>
          </ul>
          <ul class="time-picker__popup-list" ref="m">
            <li
              class="time-picker__popup-item"
              v-for="(v, i) in ms"
              :key="i"
              @click.stop="() => select('m', v)"
              :class="{ selected: time.m === v }"
            >
              {{ v }}
            </li>
          </ul>
        </div>
        <div class="time-picker__button-wrap">
          <fh-button type="text" @click.stop="close">{{ $t('select.cancel') }}</fh-button>
          <fh-button type="text" @click.stop="ok">{{ $t('select.confirm') }}</fh-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, useTemplateRef, inject, ref, withDefaults, nextTick } from 'vue'
import { computePosition, flip, shift, offset } from '@floating-ui/vue'
import { useI18n } from '@fhtek-ui/locale'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'
import { FormItemContextKey, type IFormItemContext } from '@fhtek-ui/components/form'
import { scrollTo } from '@fhtek-ui/utils/tool'

defineOptions({
  name: 'FhTimePicker',
})

export interface ITimePickerProps {
  modelValue: string
  disabled?: boolean
  name?: string
  placeholder?: string
  label?: string
}
interface ITime {
  h: string
  m: string
}
export interface ITimePickerEmits {
  (e: 'change', value: string): void
}

const formatCount = (v: number) => {
  return `0${v}`.slice(-2)
}

const props = withDefaults(defineProps<ITimePickerProps>(), {
  modelValue: '',
  disabled: false,
  name: '',
  placeholder: '',
  label: '',
})
const { t } = useI18n()
const disabledContext = useInjectDisabled()
const formItem = inject<IFormItemContext | null>(FormItemContextKey, null)
const timePickerInputRef = useTemplateRef<HTMLDivElement>('timePickerInputRef')
const combo = useTemplateRef<HTMLDivElement>('combo')
const emit = defineEmits<ITimePickerEmits>()
const model = defineModel<string>({
  required: true,
})
const opened = ref(false)
const hs = Array.from(new Array(24)).map((__, v) => formatCount(v))
const ms = Array.from(new Array(60)).map((__, v) => formatCount(v))
const time = ref<ITime>({
  h: '',
  m: '',
})
const oldValue = ref('')

const currentLabel = computed(() => {
  return props.label || formItem?.value.label || ''
})
const selectPlaceholder = computed(() => {
  return typeof props.placeholder !== 'undefined' ? props.placeholder : t('select.placeholder')
})
const selectDisabled = computed(() => {
  return props.disabled || disabledContext.value
})

const updatePosition = () => {
  if (!timePickerInputRef.value || !combo.value) return
  computePosition(timePickerInputRef.value, combo.value, {
    placement: 'bottom-start',
    middleware: [flip(), shift(), offset(6)],
  }).then(({ x, y }) => {
    Object.assign((combo.value as HTMLDivElement).style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  })
}
const ok = () => {
  if (time.value.h && time.value.m) {
    emit('change', `${time.value.h}:${time.value.m}`)
  }
  opened.value = false
}
const open = () => {
  if (opened.value) return
  opened.value = true
  oldValue.value = model.value
  const timeArr = model.value.split(':')
  time.value.h = timeArr[0] ?? ''
  time.value.m = timeArr[1] ?? ''
  nextTick(() => {
    updatePosition()
    const hEl = combo.value?.querySelector(
      '.time-picker__popup-list:nth-child(1)',
    ) as HTMLUListElement
    const mEl = combo.value?.querySelector(
      '.time-picker__popup-list:nth-child(2)',
    ) as HTMLUListElement
    initScroll(hEl)
    initScroll(mEl)
  })
}
const close = () => {
  if (!opened.value) return
  model.value = oldValue.value
  opened.value = false
}
const initScroll = (el: HTMLUListElement) => {
  const sEl = el.querySelector('.selected')
  if (sEl) {
    const cTop = (sEl as HTMLElement).offsetTop
    scrollTo(el, 0, cTop)
  }
}
const select = (type: keyof typeof time.value, v: string) => {
  time.value[type] = v
  model.value = `${time.value.h}:${time.value.m}`
  if (time.value.h && time.value.m) {
    emit('change', model.value)
  }
}
</script>

<style lang="less">
.time-picker {
  width: 100%;
  .time-picker__caret {
    transition: transform 0.2s linear;
    &.is-reverse {
      transform: rotate(180deg);
    }
  }
  .input {
    width: 100% !important;
    max-width: 100% !important;
    .input__inner {
      cursor: pointer;
    }
  }
  .time-picker__popup {
    position: absolute;
    z-index: 2000;
    background: @time-picker-combox-background-color;
    top: 0;
    left: 0;
    width: 100%;
    box-shadow: 0 2px 8px @time-picker-combox-shadow-color;
    background-clip: padding-box;
    overflow: hidden;
    .time-picker__popup-wrap {
      display: flex;
    }
    .time-picker__popup-list {
      position: relative;
      padding-bottom: 156px;
      flex: 1;
      height: 100px;
      overflow-y: scroll;
      border-right: 1px solid @time-picker-popup-border-color;
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: @time-picker-popup-scrollbar-color;
      }
      &:last-child {
        border-right: none;
      }
    }
    .time-picker__popup-item {
      margin: 0;
      padding: 0;
      text-decoration: none;
      list-style: none;
      text-align: left;
      padding-left: 10px;
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      &:hover {
        background: @time-picker-popup-item-hover-background-color;
        color: @time-picker-popup-item-hover-color;
      }
      &:active {
        background: @time-picker-popup-item-active-background-color;
        color: @time-picker-popup-item-active-color;
      }
      &.selected {
        color: @time-picker-popup-item-selected-color;
      }
    }
    .time-picker__button-wrap {
      border-top: 1px solid @time-picker-buttons-border-color;
      display: flex;
      button {
        height: 38px;
        width: 50%;
        border: none;
        background: @time-picker-button-background-color;
        &:hover {
          opacity: 0.8;
        }
        &:first-child {
          color: @time-picker-button-cancel-color;
        }
        &:last-child {
          color: @time-picker-button-confirm-color;
        }
      }
    }
  }
}
</style>
