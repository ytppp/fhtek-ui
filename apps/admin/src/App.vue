<template>
  <FhLayout>
    <router-view :key="$route.fullPath" />
  </FhLayout>
</template>

<script lang="ts" setup>
import FhLayout from '@/components/layout/layout.vue'
import { onMounted } from 'vue'
import { setFavicon, getPublicFile, setDocTitle } from './util/tool'
import { useAppStore } from '@/stores/modules/app-store'
import type { WifiVersion } from './util/constant'

const appStore = useAppStore()

const init = () => {
  if (__APP_CUSTOMER_CONFIG__.favicon) {
    setFavicon(getPublicFile(`${__APP_CUSTOMER_CONFIG__.favicon}`))
  }
  if (__APP_CUSTOMER_CONFIG__.title) {
    setDocTitle(__APP_CUSTOMER_CONFIG__.title)
  }
  appStore.setWifiVersion(__APP_CUSTOMER_CONFIG__.wifiVersion as WifiVersion)
}

onMounted(() => {
  init()
})
</script>
