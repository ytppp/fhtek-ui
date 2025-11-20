<template>
  <teleport to="body">
    <transition name="toast" @after-leave="onAfterLeave">
      <div class="toast" :class="`toast--${type}`" v-show="visible" id="toastEl" ref="toastRef">
        <span>{{ text }}</span>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { onMounted, ref, withDefaults } from 'vue'
import type { IToastEmits, IToastProps } from './interface'

defineOptions({
  name: 'FhToast',
})

const props = withDefaults(defineProps<IToastProps>(), {
  duration: 3000,
  text: '',
  type: 'success',
})
const emit = defineEmits<IToastEmits>()
const visible = ref(false)
const timer = ref<NodeJS.Timeout | number | null>(null)

const startTimer = () => {
  timer.value = setTimeout(() => {
    visible.value = false
  }, props.duration)
}
const onAfterLeave = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
  emit('hide')
}
onMounted(() => {
  visible.value = true
  startTimer()
})
</script>

<style lang="less">
.toast {
  color: @toast-color;
  top: 0;
  padding: 10px 16px;
  border-radius: 4px;
  z-index: 1004;
  left: 50%;
  position: fixed;
  transform: translate(-50%, 50%);
  white-space: nowrap;
  text-align: center;
  display: flex;
  align-items: center;
  font-size: 14px;
  &.toast--error {
    background: @toast-error-background-color;
    border: 0.5px solid @toast-error-border-color;
    &::before {
      content: '';
      margin-right: 8px;
      flex-shrink: 0;
      display: block;
      width: 14px;
      height: 14px;
      background: url('@fhtek-ui/components/assets/images/ic_default_error.png') center no-repeat;
      background-size: 100%;
    }
  }
  &.toast--success {
    background: @toast-success-background-color;
    border: 0.5px solid @toast-success-border-color;
    &::before {
      content: '';
      margin-right: 8px;
      flex-shrink: 0;
      display: block;
      width: 14px;
      height: 14px;
      background: url('@fhtek-ui/components/assets/images/ic_default_success.png') center no-repeat;
      background-size: 100%;
    }
  }
  &.toast-enter-active {
    transition: all 0.3s ease-in;
  }
  &.toast-leave-active {
    transition: all 0.3s ease-out;
  }
  &.toast-enter-from,
  &.toast-leave-to {
    transform: translate(-50%, -100%);
  }
  @media screen and (max-width: 768px) {
    white-space: normal !important;
    padding: 10px !important;
  }
}
</style>
