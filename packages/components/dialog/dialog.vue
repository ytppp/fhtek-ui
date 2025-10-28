<template>
  <fh-popup ref="popupRef" :is-manual="true">
    <div class="dialog">
      <div v-if="title" class="dialog__title">{{ title }}</div>
      <div class="dialog__message">{{ message }}</div>
      <div class="dialog__buttons">
        <fh-button size="small" v-if="dialogType !== DialogType.info" @click="cancel">
          {{ cancelText }}
        </fh-button>
        <fh-button size="small" @click="ok">{{ okText }}</fh-button>
      </div>
    </div>
  </fh-popup>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import FhButton from '@/components/button/button.vue'
import FhPopup from '@/components/popup/popup.vue'
import { DialogType } from './config'

defineOptions({
  name: 'FhDialog',
})
defineProps({
  dialogType: {
    type: String,
    default: DialogType.info,
  },
  message: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  okText: {
    type: String,
    default: 'ok',
  },
  cancelText: {
    type: String,
    default: 'cancel',
  },
})
const timer = ref<number | undefined>(undefined)
const popupRef = useTemplateRef('popupRef')
const emits = defineEmits(['ok', 'cancel'])

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
  popupRef.value.close()
  timer.value = setTimeout(fn, 310)
}
const clearTimer = () => {
  clearTimeout(timer.value)
  timer.value = undefined
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
