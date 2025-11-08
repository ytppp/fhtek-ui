<template>
  <div>
    <fh-button @click="visible = true">打开弹窗</fh-button>
    <fh-modal v-model="visible" title="弹窗" :before-close="handleClose">
      <template #body>
        <fh-form ref="formRef" :model="form" :rules="rules">
          <!-- <fh-form-item :label="$t('trans0166')">
            <fh-switch v-model="form.enable" />
          </fh-form-item>
          <fh-form-item :label="$t('trans0140')" prop="interface">
            <fh-select v-model="form.interface" :options="wanList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0255')">
            <fh-select v-model="form.server" :options="serverList"> </fh-select>
          </fh-form-item> -->
          <fh-form-item label="域名" prop="domain">
            <fh-input v-model="form.domain"></fh-input>
          </fh-form-item>
          <fh-form-item label="用户名" prop="username">
            <fh-input v-model="form.username"></fh-input>
          </fh-form-item>
          <fh-form-item label="密码" prop="password">
            <fh-input v-model="form.password" type="password" show-password></fh-input>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              保存
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
    </fh-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'

defineOptions({
  name: 'FhModalDemo',
})

const visible = ref(false)
const form = ref({
  domain: '',
  username: '',
  password: '',
})
const formRef = useTemplateRef<typeof FhForm>('formRef')
const rules = ref({
  interface: [
    {
      rule: (value) => value,
      message: '请选择接口',
    },
  ],
  domain: [
    {
      rule: (value) => value,
      message: '请输入域名',
    },
  ],
  username: [
    {
      rule: (value) => value,
      message: '请输入用户名',
    },
  ],
  password: [
    {
      rule: (value) => value,
      message: '请输入密码',
    },
  ],
})

const handleClose = () => {
  formRef.value?.clearValidate()
}
const save = () => {
  if (!formRef.value?.validate()) return
  console.log('form is valid')
}
</script>
