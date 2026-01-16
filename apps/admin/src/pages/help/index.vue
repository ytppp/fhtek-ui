<template>
  <div class="page">
    <div class="page__content">
      <fh-markdown-preview :content="helpContent" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useInactiveDetector } from '@/hooks/inactive-detector'
import { getUsb } from '@/http/api'
import { locale } from '@/i18n/index'
import HelpZhMd from '@/i18n/locales/help-zh.md?raw'
import HelpEnMd from '@/i18n/locales/help-en.md?raw'

defineOptions({
  name: 'FhHelp',
})

const helpContent = computed(() => {
  let content = ''
  switch (locale) {
    case 'zh-CN':
      content = HelpEnMd // HelpZhMd
      break
    case 'en-US':
      content = HelpEnMd
      break
    default:
      content = HelpEnMd
      break
  }
  return content
})

useInactiveDetector(() => {
  getUsb(false, false, false)
})
</script>
