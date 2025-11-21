<template>
  <div>
    <fh-button @click="openDialog">消息弹框</fh-button>
  </div>
</template>

<script setup lang="ts">
import { dialog } from '@fhtek-ui/components'

defineOptions({
  name: 'FhDialogDemo',
})

const openDialog = () => {
  dialog.info({
    title: '消息弹框',
    message: '这是一条消息弹框',
  })
}
</script>
