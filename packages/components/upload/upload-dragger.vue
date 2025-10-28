<template>
  <div
    class="dragger"
    @drop="handleDrop"
    @dragover.prevent
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
  >
    <div class="dragger__wrap" v-if="isDragOver">
      {{ $t('trans0207') }}
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FhUploadDragger',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDragOver: false,
    }
  },
  emits: ['file'],
  methods: {
    handleDragEnter() {
      this.isDragOver = true
    },
    handleDragLeave() {
      this.isDragOver = false
    },
    handleDrop(e) {
      e.preventDefault()
      this.isDragOver = false
      if (this.disabled) {
        return
      }
      this.$parent.initUploadStatus()
      const { files } = e.dataTransfer
      this.$emit('file', files)
    },
  },
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
