<template>
  <fh-popup ref="popupRef" :is-manual="true">
    <div class="dialog">
      <div v-if="title" class="dialog__title">{{ title }}</div>
      <div class="dialog__message">{{ message }}</div>
      <div class="dialog__buttons">
        <fh-button size="small" v-if="dialogType !== 'info'" @click="cancel">
          {{ cancelText }}
        </fh-button>
        <fh-button size="small" @click="ok">{{ okText }}</fh-button>
      </div>
    </div>
  </fh-popup>
</template>

<script lang="ts" setup>
import { useTemplateRef, withDefaults } from 'vue'
import FhButton from '@fhtek-ui/components/button'
import FhPopup from '@fhtek-ui/components/popup'
import type { IDialogProps } from './interface'

defineOptions({
  name: 'FhDialog',
})

export interface IDialogEmits {
  (e: 'ok'): void
  (e: 'cancel'): void
}

withDefaults(defineProps<IDialogProps>(), {
  dialogType: 'info',
  message: '',
  title: '',
  okText: 'ok',
  cancelText: 'cancel',
})
let timer: ReturnType<typeof setTimeout> | undefined
const popupRef = useTemplateRef<typeof FhPopup>('popupRef')
const emits = defineEmits<IDialogEmits>()

const ok = () => {
  startTimer(() => {
    emits('ok')
    clearTimer()
  })
}
const cancel = () => {
  startTimer(() => {
    emits('cancel')
    clearTimer()
  })
}
const startTimer = (fn: () => void) => {
  if (!popupRef.value) return
  popupRef.value.close()
  timer = setTimeout(fn, 310)
}
const clearTimer = () => {
  clearTimeout(timer)
  timer = undefined
}
</script>

<style lang="less">
.dialog {
  text-align: center;
  background: #fff;
  padding: 20px 20px 30px 20px;
  border-radius: 5px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 @dialog-box-shadow-color;
  transition: all 0.3s ease;
  .dialog__buttons {
    display: flex;
    justify-content: center;
    button {
      width: auto;
      height: 38px;
      margin-left: 30px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .dialog__title {
    font-size: 16px;
    line-height: 1;
    color: @dialog-title-color;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }
  .dialog__message {
    color: @dialog-content-color;
    margin-bottom: 45px;
    text-align: center;
    font-size: 14px;
  }
  @media screen and (min-width: 769px) {
    width: 430px;
  }
  @media screen and (max-width: 768px) {
    width: 90%;
    .dialog__buttons {
      flex-direction: column;
      button {
        width: 100%;
        display: block;
        margin: 0;
        margin-top: 20px;
        &:first-child {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
