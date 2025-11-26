<template>
  <div
    class="dragger"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <div class="dragger__wrap" v-if="isDragOver">
      {{ $t('upload.dragger') }}
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'FhUploadDragger',
})

export interface FhUploadDraggerProps {
  disabled?: boolean
}
export interface FhUploadDraggerEmits {
  (e: 'file', files: FileList): void
}

const isDragOver = ref(false)
const props = withDefaults(defineProps<FhUploadDraggerProps>(), {
  disabled: false,
})
const emit = defineEmits<FhUploadDraggerEmits>()
const handleDragEnter = () => {
  isDragOver.value = true
}
const handleDragLeave = () => {
  isDragOver.value = false
}
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
  if (props.disabled) {
    return
  }
  // this.$parent.initUploadStatus()
  const { files } = e.dataTransfer as DataTransfer
  emit('file', files)
}
</script>

<style lang="less">
.dragger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: @form-item-max-width;
  width: 100%;
  height: 188px;
  border-radius: 8px;
  border: dashed 1px #999999;
  position: relative;
  z-index: 1;
  .dragger__wrap {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    pointer-events: none;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    width: 100%;
  }
}
</style>
