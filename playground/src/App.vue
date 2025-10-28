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
    {{ checked3 }}
    <fh-descriptions :data="data" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FhButton, FhCheckbox, FhCheckboxGroup, FhDescriptions } from '@fhtek-ui/components'

const checked = ref(false)
const checked1 = ref(true)
const checked2 = ref('456')
const checked3 = ref(['456'])
const data = ref([
  {
    label: '姓名',
    value: '张三',
  },
  {
    label: '年龄',
    value: '18',
  },
  {
    label: '性别',
    value: '男',
  },
])
</script>
