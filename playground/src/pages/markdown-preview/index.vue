<template>
  <div>
    <fh-markdown-preview :content="HelpZhMd" />
  </div>
</template>

<script setup lang="ts">
import HelpZhMd from './help-zh.md?raw'

defineOptions({
  name: 'FhMarkdownPreviewDemo',
})
</script>
