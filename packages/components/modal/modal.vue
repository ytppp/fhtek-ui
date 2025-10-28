<template>
  <fh-popup
    :close-on-click-wrap="closeOnClickWrap"
    :is-append-body="isAppendBody"
    :before-close="onBeforeClose"
    :wrap-bg-color="wrapBgColor"
    ref="popupRef"
  >
    <div
      v-bind="$attrs"
      class="modal"
      :style="{ width: fullscreen ? '100%' : width, height: fullscreen ? '100%' : 'auto' }"
    >
      <div class="modal__header">
        <template v-if="slots.title || title">
          <template v-if="title">
            {{ title }}
          </template>
          <slot name="title" v-else></slot>
        </template>
        <fh-icon class="modal__close" name="icon-close" @click="close" v-if="showClose"></fh-icon>
      </div>
      <div
        class="modal__body"
        :style="`${fullscreen ? 'height: auto' : 'max-height: 80vh; overflow: auto'}`"
        v-if="slots.body"
      >
        <slot name="body"></slot>
      </div>
      <div class="modal__footer" v-if="slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </fh-popup>
</template>

<script setup>
import { ref, useSlots, watch } from 'vue'
import FhPopup from '@/components/popup/popup.vue'

defineOptions({
  name: 'FhModal',
})
const props = defineProps({
  title: String,
  width: {
    type: String,
    default: '50%',
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  beforeClose: {
    type: Function,
    default: () => ({}),
  },
  closeOnClickWrap: {
    type: Boolean,
    default: true,
  },
  isAppendBody: {
    type: Boolean,
    default: true,
  }, // When set to false, perent node must set position
  wrapBgColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.4)',
  },
})
const model = defineModel({
  type: Boolean,
  default: false,
})
const slots = useSlots()
const popupRef = ref(null)
watch(model, (val) => {
  if (val) {
    popupRef.value.open()
  } else {
    popupRef.value.close()
  }
})
const onBeforeClose = () => {
  if (props.beforeClose) {
    props.beforeClose()
  }
  model.value = false
}
const close = () => {
  model.value = false
}
</script>

<style lang="less">
.modal {
  background: @modal-content-background;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 @modal-shadow-color;
  box-sizing: border-box;
  transition: all 0.3s ease;
  .modal__header {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 20px;
    position: relative;
  }
  .modal__close {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
  .modal__body {
  }
  .modal__footer {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
    padding-top: 30px;
  }
  @media screen and (max-width: 768px) {
    width: 90% !important;
    padding: 20px;
  }
}
</style>
