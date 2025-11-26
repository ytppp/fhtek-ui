<template>
  <div>
    <div>
      <fh-button type="primary">Primary Button</fh-button>
      <fh-button disabled>Disabled Button</fh-button>
    </div>
    <div>
      <fh-checkbox v-model="checked" label="Checkbox" />
    </div>
    <div>
      <fh-checkbox v-model="checked2" label="Checkbox2" true-value="123" false-value="456" />
      {{ checked2 }}
    </div>
    <div>
      <fh-checkbox-group v-model="checked3">
        <fh-checkbox label="Checkbox3" value="1" />
        <fh-checkbox label="Checkbox4" value="2" />
        <fh-checkbox label="Checkbox5" true-value="3" false-value="4" />
      </fh-checkbox-group>
      {{ checked3 }}
    </div>
    <div>
      <fh-radio label="Radio3" value="789" v-model="radio1" />
    </div>
    <div>
      <fh-radio-group v-model="radio">
        <fh-radio label="Radio1" value="123" />
        <fh-radio label="Radio2" value="456" />
      </fh-radio-group>
      {{ radio }}
    </div>
    <fh-pagination :total="100" :default-page-size="10" :default-current="1" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'FhButtonDemo',
})

const checked = ref(true)
const checked2 = ref('456')
const checked3 = ref(['1'])
const radio = ref('123')
const radio1 = ref('')
</script>
