<template>
  <div class="time-picker" @click="open" v-clickoutside="closeStatusOpened">
    <div class="time-picker__input" ref="timePickerInputRef">
      <fh-input
        readonly
        :disabled="selectDisabled"
        :placeholder="selectPlaceholder"
        :label="currentLabel"
        v-model="value"
        :name="name"
      >
        <template v-slot:prefix v-if="$slots.prefix">
          <slot name="prefix"></slot>
        </template>
        <template v-slot:suffix>
          <fh-icon
            :class="['time-picker__caret', 'input__icon', this.opened ? 'is-reverse' : '']"
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
              @click.stop="(e) => select('h', v, e)"
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
              @click.stop="(e) => select('m', v, e)"
              :class="{ selected: time.m === v }"
            >
              {{ v }}
            </li>
          </ul>
        </div>
        <div class="time-picker__button-wrap">
          <fh-button type="text" @click.stop="close">{{ $t('trans0020') }}</fh-button>
          <fh-button type="text" @click.stop="ok">{{ $t('trans0019') }}</fh-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { computePosition, flip, shift, offset } from '@floating-ui/vue'

export default defineComponent({
  name: 'FhTimePicker',
  inject: {
    form: {
      default: '',
    },
    formItem: {
      default: '',
    },
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    name: String,
    placeholder: String,
    label: String,
  },
  data() {
    return {
      opened: false,
      hs: Array.from(new Array(24)).map((__, v) => this.formatCount(v)),
      ms: Array.from(new Array(60)).map((__, v) => this.formatCount(v)),
      time: {
        h: '',
        m: '',
      },
      distance: 0,
      animationTime: 200,
      animationEl: null,
      oldValue: '',
    }
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      },
    },
    iconClass() {
      return this.opened ? 'is-reverse' : ''
    },
    currentLabel() {
      return this.label || this.$parent.label || ''
    },
    selectPlaceholder() {
      return typeof this.placeholder !== 'undefined' ? this.placeholder : this.$t('trans0001')
    },
    selectDisabled() {
      return this.disabled || this.form?.disabled.value
    },
  },
  emits: ['input', 'update:modelValue'],
  methods: {
    updatePosition() {
      computePosition(this.$refs.timePickerInputRef, this.$refs.combo, {
        placement: 'bottom-start',
        middleware: [flip(), shift(), offset(6)],
      }).then(({ x, y }) => {
        Object.assign(this.$refs.combo.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    },
    formatCount(v) {
      return `0${v}`.slice(-2)
    },
    scrollTo(el, x, y) {
      if (el.scrollTo) {
        el.scrollTo(x, y)
      } else {
        el.scrollTop = y
      }
    },
    ok() {
      if (this.time.h && this.time.m) {
        this.$emit('input', this.value)
      }
      this.opened = false
    },
    open() {
      if (!this.opened) {
        this.opened = true
        this.oldValue = this.value
        this.time = {
          h: this.value ? this.value.split(':')[0] : '',
          m: this.value ? this.value.split(':')[1] : '',
        }
        this.$nextTick(() => {
          this.updatePosition()
          const hEl = this.$refs.h
          const mEl = this.$refs.m
          this.initScroll(hEl)
          this.initScroll(mEl)
        })
      }
    },
    closeStatusOpened() {
      this.opened = false
    },
    close() {
      if (!this.opened) {
        return
      }
      this.value = this.oldValue
      this.opened = false
    },
    initScroll(el) {
      const sEl = el.querySelector('.selected')
      if (sEl) {
        const cTop = sEl.offsetTop
        this.scrollTo(el, 0, cTop)
      }
    },
    animateScroll() {
      if (this.animationEl.scrollTop >= this.distance) {
        cancelAnimationFrame(this.animationId)
        return
      }
      let scroll = this.animationEl.scrollTop + 5
      scroll = scroll > this.distance ? this.distance : scroll
      this.scrollTo(this.animationEl, 0, scroll)
      this.animationId = requestAnimationFrame(this.animateScroll)
    },
    selectScroll(e, p) {
      const pEl = this.$refs[p]
      const sEl = e.currentTarget
      this.distance = sEl.offsetTop
      this.animationEl = pEl
      this.animateScroll()
    },
    select(type, v, e) {
      this.time[type] = v
      this.value = `${this.time.h}:${this.time.m}`
      if (this.time.h && this.time.m) {
        this.$emit('input', this.value)
      }
    },
  },
})
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
