<template>
  <teleport to="body" :disabled="!isAppendBody">
    <transition name="wrap">
      <div ref="wrapRef" class="wrap" v-show="visible" role="dialog" aria-modal="true">
        <div
          class="wrap__mask"
          :style="wrapStyleObj"
          @click="wrapClose"
          @touchstart="wrapClose"
        ></div>
        <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted, onUnmounted, useTemplateRef, withDefaults } from 'vue'

defineOptions({
  name: 'FhPopup',
})

export interface IPopupProps {
  closeOnClickWrap?: boolean
  wrapBgColor?: string
  beforeClose?: () => void | boolean | Promise<boolean | void>
  isAppendBody?: boolean // When set to false, parent node must set position
  isManual?: boolean // functional component must be set true
  closeOnEsc?: boolean // Whether to close when pressing ESC key
  preventScroll?: boolean // Whether to prevent body scrolling when popup is visible
}

const props = withDefaults(defineProps<IPopupProps>(), {
  closeOnClickWrap: false,
  wrapBgColor: 'rgba(0, 0, 0, 0.4)',
  beforeClose: () => {},
  isAppendBody: true,
  isManual: false,
  closeOnEsc: false,
  preventScroll: true,
})
const visible = ref(false)
const wrapRef = useTemplateRef<HTMLDivElement | null>('wrapRef')

const wrapStyleObj = computed(() => ({
  backgroundColor: props.wrapBgColor,
}))

watch(visible, (val) => {
  if (val && wrapRef.value) {
    wrapRef.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
  }

  if (props.preventScroll) {
    if (val) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }
})
const wrapClose = () => {
  if (!props.closeOnClickWrap) {
    return
  }
  close()
}

const close = async () => {
  if (props.beforeClose) {
    const result = props.beforeClose()

    if (result instanceof Promise) {
      const asyncResult = await result
      if (asyncResult === false) return
    } else if (result === false) {
      return
    }
  }

  visible.value = false
}
const open = () => {
  visible.value = true
}

const handleKeydown = (e: KeyboardEvent) => {
  if (props.closeOnEsc && e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => {
  if (props.isManual) {
    visible.value = true
  }

  if (props.closeOnEsc) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  visible.value = false

  if (props.closeOnEsc) {
    document.removeEventListener('keydown', handleKeydown)
  }

  if (props.preventScroll) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
})

defineExpose({
  close,
  open,
})
</script>

<style lang="less">
.wrap {
  z-index: 1003;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  position: fixed; // Default position

  &.wrap-enter-from,
  &.wrap-leave-to {
    opacity: 0;
  }

  // Consolidate transition styles for common components
  &.wrap-enter-from :is(.modal, .dialog, .upgrade),
  &.wrap-leave-to :is(.modal, .dialog, .upgrade) {
    transform: scale(1.1);
  }

  .wrap__mask {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // Add transition for mask
    transition: background-color 0.3s ease;
  }
}
</style>
