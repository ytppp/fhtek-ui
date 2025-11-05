<template>
  <transition name="drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div ref="drawerRef" class="drawer__wrapper" tabindex="-1" v-show="modelValue">
      <div
        class="drawer__container"
        :class="modelValue && 'drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="drawer__title"
          :aria-label="title"
          class="drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${drawerSize}` : `height: ${drawerSize}`"
          role="dialog"
          tabindex="-1"
        >
          <header class="drawer__header" id="el-drawer__title" v-if="hasHeader">
            <slot name="title">
              <span role="heading" :title="title">{{ title }}</span>
            </slot>
            <fh-icon
              :aria-label="`close ${title || 'drawer'}`"
              class="drawer__close"
              name="icon-close"
              v-if="showClose"
              @click="closeDrawer"
            ></fh-icon>
          </header>
          <section class="drawer__body">
            <slot></slot>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { withDefaults, ref, computed, useTemplateRef, watch, nextTick } from 'vue'
import FhIcon from '@fhtek-ui/components/icon'

defineOptions({
  name: 'FhDrawer',
})

type DirectionType = 'ltr' | 'rtl' | 'ttb' | 'btt'

export interface IDrawerProps {
  modelValue?: boolean
  appendToBody?: boolean
  beforeClose?: () => void | boolean
  customClass?: string
  direction?: DirectionType
  showClose?: boolean
  size?: number | string
  title?: string
  wrapperClosable?: boolean
  hasHeader?: boolean
}
export interface IDrawerEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'opened'): void
  (e: 'closed'): void
}

const props = withDefaults(defineProps<IDrawerProps>(), {
  appendToBody: false,
  direction: 'ltr',
  showClose: true,
  size: '30%',
  wrapperClosable: true,
  hasHeader: true,
})
const emit = defineEmits<IDrawerEmits>()
const prevActiveElement = ref<HTMLElement | null>(null)
const overflow = ref('')
const drawerRef = useTemplateRef('drawerRef')

const isHorizontal = computed(() => props.direction === 'rtl' || props.direction === 'ltr')
const drawerSize = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const parentNode = computed(() =>
  props.appendToBody ? document.body : drawerRef.value?.parentNode,
)

watch(
  () => props.modelValue,
  (value) => {
    emit('update:modelValue', value)
    if (value) {
      if (props.appendToBody) {
        document.body.appendChild(drawerRef.value as HTMLElement)
      }
      prevActiveElement.value = document.activeElement as HTMLElement
      // desktop prevent scroll
      overflow.value = parentNode.value ? (parentNode.value as HTMLElement).style.overflow : ''
      ;(parentNode.value as HTMLElement).style.overflow = 'hidden'
      // mobile prevent scroll
      parentNode.value && parentNode.value.addEventListener('touchmove', preventDefault, false)
    } else {
      nextTick(() => {
        if (prevActiveElement.value) {
          prevActiveElement.value.focus()
          ;(parentNode.value as HTMLElement).style.overflow = overflow.value
          parentNode.value &&
            parentNode.value.removeEventListener('touchmove', preventDefault, false)
        }
      })
    }
  },
)

const preventDefault = (e: Event) => {
  e.preventDefault()
}

const afterEnter = () => {
  emit('opened')
}
const afterLeave = () => {
  emit('closed')
}
const handleWrapperClick = () => {
  if (props.wrapperClosable) {
    closeDrawer()
  }
}
const closeDrawer = () => {
  if (props.beforeClose && typeof props.beforeClose === 'function') {
    const shouldClose = props.beforeClose()
    if (shouldClose === false) {
      return
    }
  }
  hide()
}
const hide = () => {
  emit('update:modelValue', false)
  emit('closed')
}
</script>

<style lang="less">
@keyframes drawer-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@directions: ltr, rtl, ttb, btt;
@in: in;
@out: out;
.drawer-animation(@direction) {
  @animationIn: e(%('%s-drawer-%s', @direction, @in));
  @animationOut: e(%('%s-drawer-%s', @direction, @out));
  @translateIn1: if(
    @direction = ltr,
    translate(-100%, 0px),
    if(
      @direction = rtl,
      translate(100%, 0px),
      if(@direction = ttb, translate(0px, -100%), if(@direction = btt, translate(0px, 100%), ''))
    )
  );
  @translateIn2: if(
    @direction = ltr,
    translate(0px, 0px),
    if(
      @direction = rtl,
      translate(0px, 0px),
      if(@direction = ttb, translate(0px, 0px), if(@direction = btt, translate(0px, 0px), ''))
    )
  );
  @translateOut1: if(
    @direction = ltr,
    translate(0px, 0px),
    if(
      @direction = rtl,
      translate(0px, 0px),
      if(@direction = ttb, translate(0px, 0px), if(@direction = btt, translate(0px, 0px), ''))
    )
  );
  @translateOut2: if(
    @direction = ltr,
    translate(-100%, 0px),
    if(
      @direction = rtl,
      translate(100%, 0px),
      if(@direction = ttb, translate(0px, -100%), if(@direction = btt, translate(0px, 100%), ''))
    )
  );
  @keyframes @animationIn {
    0% {
      transform: @translateIn1;
    }
    100% {
      transform: @translateIn2;
    }
  }
  @keyframes @animationOut {
    0% {
      transform: @translateOut1;
    }
    100% {
      transform: @translateOut2;
    }
  }
}
each(@directions, {
  .drawer-animation(@value);
}) .animation-in(@direction) {
  .drawer__open &.@{direction} {
    animation: e(%('%s-drawer-%s .3s 1ms', @direction, @in));
  }
}
.animation-out(@direction) {
  &.@{direction} {
    animation: e(%('%s-drawer-%s .3s', @direction, @out));
  }
}
.drawer {
  position: absolute;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  outline: 0;

  each(@directions, {
    .animation-in(@value);
    .animation-out(@value);
  });
  &__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    margin: 0;
    z-index: 1002;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &__header {
    align-items: center;
    color: rgb(114, 118, 123);
    display: flex;
    margin-bottom: 32px;
    padding: 10px;
    @media screen and (max-width: 768px) {
      margin-bottom: 0;
    }
    & > :first-child {
      flex: 1;
    }
  }

  &__title {
    margin: 0;
    flex: 1;
    line-height: inherit;
    font-size: 1rem;
  }

  &__close {
    cursor: pointer;
    font-size: 22px;
  }

  &__body {
    flex: 1;
    overflow: auto;
    & > * {
      box-sizing: border-box;
    }
  }

  &.ltr,
  &.rtl {
    height: 100%;
    top: 0;
    bottom: 0;
  }

  &.ttb,
  &.btt {
    width: 100%;
    left: 0;
    right: 0;
  }

  &.ltr {
    left: 0;
  }

  &.rtl {
    right: 0;
  }

  &.ttb {
    top: 0;
  }

  &.btt {
    bottom: 0;
  }
}

.drawer__container {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}

.drawer-fade-enter-active {
  animation: drawer-fade-in 0.3s;
}

.drawer-fade-leave-active {
  animation: drawer-fade-in 0.3s reverse;
}
</style>
