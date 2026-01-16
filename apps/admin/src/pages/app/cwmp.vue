<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0271') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="formRules">
        <fh-form-item :label="$t('trans0259')">
          <fh-switch v-model="form.enable"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0260')" prop="interval">
          <fh-input v-model="form.interval"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0261')" prop="url">
          <fh-input v-model="form.url"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0262')" prop="platUser">
          <fh-input v-model="form.platUser"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0263')" prop="platPwd">
          <fh-input v-model="form.platPwd" type="password" show-password></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0264')" prop="terminalUser">
          <fh-input v-model="form.terminalUser"></fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0265')" prop="terminalPwd">
          <fh-input v-model="form.terminalPwd" type="password" show-password></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getSwmpSettings, editSwmpSettings } from '@/http/api'
import { successTips, isValidInteger, isValidDomain } from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const formRef = ref(null)
const form = reactive({
  enable: true,
  interval: '',
  url: '',
  platUser: '',
  platPwd: '',
  terminalUser: '',
  terminalPwd: '',
})
const formRules = {
  interval: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, Infinity),
      message: t('trans0914').format(t('trans0260'), 1),
    },
  ],
  url: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidDomain(value),
      message: t('trans0566').format(t('trans0261')),
    },
  ],
  platUser: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  platPwd: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  terminalUser: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
  terminalPwd: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
  ],
}
const getSwmpSettingsData = () => {
  getSwmpSettings().then(({ data }) => {
    form.enable = convertBooleanStatus(data.enable) as boolean
    form.interval = data.interval
    form.url = data.server
    form.platUser = data.platform_username
    form.platPwd = data.platform_password
    form.terminalUser = data.terminal_username
    form.terminalPwd = data.terminal_password
  })
}
const save = () => {
  if (!formRef.value.validate()) return
  editSwmpSettings({
    enable: convertBooleanStatus(form.enable),
    interval: form.interval,
    server: form.url,
    platform_username: form.platUser,
    platform_password: form.platPwd,
    terminal_username: form.terminalUser,
    terminal_password: form.terminalPwd,
  }).then(() => {
    successTips()
  })
}

onMounted(() => {
  getSwmpSettingsData()
})
</script>
