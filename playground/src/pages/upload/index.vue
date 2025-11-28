<template>
  <div>
    <fh-form ref="formRef" label-width="200px" label-position="right">
      <fh-form-item>
        <fh-upload dragable ref="uploader" :accept="accept" />
      </fh-form-item>
      <fh-form-item>
        <fh-button @click="save" block> 保存 </fh-button>
      </fh-form-item>
    </fh-form>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { type FormInstance } from '@fhtek-ui/components'

defineOptions({
  name: 'FhUploadDemo',
})

const formRef = useTemplateRef<FormInstance>('formRef')
const accept = ref('.bin')
const save = () => {
  //
}
</script>
