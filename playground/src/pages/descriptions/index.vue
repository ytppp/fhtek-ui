<template>
  <div>
    <fh-descriptions :data="data" border />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'FhDescriptionsDemo',
})

const data = {
  model: {
    label: 'model',
    value: '123',
  },
}
</script>
