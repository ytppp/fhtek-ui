<template>
  <div>
    <fh-button @click="openLoading">显示加载中</fh-button>
    <fh-button @click="toggleLoading">切换loading</fh-button>
    <div style="height: 200px; width: 200px; border: solid 1px red" v-loading="uploading">
      loading
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'

defineOptions({
  name: 'FhLoadingDemo',
})

const loading = inject('$loading')
const uploading = ref(false)

const openLoading = () => {
  loading.open({
    title: '加载中',
  })
  setTimeout(() => {
    loading.close()
  }, 2000)
}

const toggleLoading = () => {
  uploading.value = !uploading.value
}
</script>
