<template>
  <div>
    <fh-button @click="openDialog">消息弹框</fh-button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

defineOptions({
  name: 'FhDialogDemo',
})

const dialog = inject('$dialog')

const openDialog = () => {
  dialog.info({
    title: '消息弹框',
    message: '这是一条消息弹框',
  })
}
</script>
