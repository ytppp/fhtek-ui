<template>
  <teleport to="body" :disabled="!isAppendBody">
    <transition name="wrap">
      <div ref="wrapRef" class="wrap" v-show="visible">
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
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'FhPopup',
})

const props = defineProps({
  closeOnClickWrap: {
    type: Boolean,
    default: false,
  },
  wrapBgColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
  beforeClose: {
    type: Function,
    default: () => ({}),
  },
  isAppendBody: {
    type: Boolean,
    default: true,
  }, // When set to false, perent node must set position
  isManual: {
    type: Boolean,
    default: false,
  }, // functional component must be set true
})
const visible = ref(false)
const wrapRef = ref(null)
// const overflow = ref('')

const wrapStyleObj = computed(() => {
  return {
    backgroundColor: props.wrapBgColor,
  }
})
// const parentNode = computed(() => {
//   if (props.isAppendBody) {
//     return document.body
//   } else if (props.isManual) {
//     return wrapRef.value.parentNode.parentNode // mount-node's parent node
//   } else {
//     return wrapRef.value.parentNode
//   }
// })

watch(visible, (val) => {
  if (val) {
    wrapRef.value.style.position = props.isAppendBody ? 'fixed' : 'absolute'
    // overflow.value = parentNode.value ? parentNode.value.style.overflow : ''
    // if (parentNode.value) {
    //   parentNode.value.style.overflow = 'hidden'
    //   parentNode.value.addEventListener('touchmove', preventDefault, false)
    // }
  } else {
    // if (parentNode.value) {
    //   parentNode.value.style.overflow = overflow.value
    //   parentNode.value.removeEventListener('touchmove', preventDefault, false)
    // }
  }
})

// const preventDefault = (e) => {
//   e.preventDefault()
// }
const wrapClose = () => {
  if (!props.closeOnClickWrap) {
    return
  }
  close()
}
const close = () => {
  if (props.beforeClose) {
    props.beforeClose()
  }
  visible.value = false
}
const open = () => {
  visible.value = true
}

onMounted(() => {
  // prevent auto open
  if (props.isManual) {
    visible.value = true
  }
})

onUnmounted(() => {
  visible.value = false
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
  &.wrap-enter-from,
  &.wrap-leave-to {
    opacity: 0;
  }
  &.wrap-enter-from .modal,
  &.wrap-leave-to .modal {
    transform: scale(1.1);
  }
  &.wrap-enter-from .dialog,
  &.wrap-leave-to .dialog {
    transform: scale(1.1);
  }
  &.wrap-enter-from .upgrade,
  &.wrap-leave-to .upgrade {
    transform: scale(1.1);
  }
  .wrap__mask {
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
