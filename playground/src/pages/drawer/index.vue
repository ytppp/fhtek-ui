<template>
  <div>
    <fh-button @click="visible = true">打开抽屉</fh-button>
    <fh-drawer title="Drawer" v-model="visible" append-to-body>
      <div>内容</div>
    </fh-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineOptions({
  name: 'FhDrawerDemo',
})

const visible = ref(false)
</script>
