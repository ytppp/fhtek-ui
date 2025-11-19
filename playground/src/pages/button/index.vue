<template>
  <div>
    <fh-button type="primary">Primary Button</fh-button>
    <fh-button disabled>Disabled Button</fh-button>
    <fh-checkbox v-model="checked" value="123" label="Checkbox" /> {{ checked }}
    <fh-checkbox v-model="checked1" label="Checkbox1" />
    <fh-checkbox v-model="checked2" label="Checkbox2" true-value="123" false-value="456" />
    <fh-checkbox-group v-model="checked3" direction="vertical" :circle="true">
      <fh-checkbox label="Checkbox3" value="123" checked />
      <fh-checkbox label="Checkbox4" value="456" disabled />
    </fh-checkbox-group>
    {{ checked3 }}
    <fh-radio label="Radio3" value="789" v-model="radio1" />
    {{ radio1 }}
    <fh-radio-group v-model="radio" direction="vertical">
      <fh-radio label="Radio1" value="123" />
      <!-- <fh-radio label="Radio2" value="456" /> -->
    </fh-radio-group>
    {{ radio }}
    <!-- <fh-pagination :total="100" :default-page-size="10" :default-current="1" /> -->
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
const radio = ref('123')
const radio1 = ref('')
</script>
