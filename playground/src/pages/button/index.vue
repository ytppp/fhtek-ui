<template>
  <div>
    <fh-button type="primary">Primary Button</fh-button>
    <fh-button disabled>Disabled Button</fh-button>
    <fh-checkbox v-model="checked" label="Checkbox" checked />
    <fh-checkbox v-model="checked1" label="Checkbox1" disabled />
    <fh-checkbox v-model="checked2" label="Checkbox2" true-value="123" false-value="456" />
    {{ checked2 }}
    <fh-checkbox-group v-model="checked3" direction="vertical" :circle="true">
      <fh-checkbox label="Checkbox3" value="123" checked />
      <fh-checkbox label="Checkbox4" value="456" disabled />
    </fh-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'FhButtonDemo',
})

const checked = ref(true)
const checked1 = ref(false)
const checked2 = ref('456')
const checked3 = ref(['123'])
</script>
