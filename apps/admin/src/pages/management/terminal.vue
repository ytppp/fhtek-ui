<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0401') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form">
        <fh-form-item :label="$t('trans0162')">
          <fh-switch v-model="form.telnetEnable" />
        </fh-form-item>
        <fh-form-item :label="$t('trans0402')">
          <fh-switch v-model="form.sshEnable" />
        </fh-form-item>
        <!-- <fh-form-item :label="$t('trans0447')">
          <fh-switch v-model="form.remoteWebEnable" />
        </fh-form-item> -->
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
import { getTerminal, setTerminal } from '@/http/api'
import { onMounted, reactive } from 'vue'
import { useDataClean } from '@/hooks/data-clean'
import { successTips } from '@/util/tool'

const { convertBooleanStatus } = useDataClean()
const form = reactive({
  telnetEnable: false,
  sshEnable: false,
  remoteWebEnable: false,
})

const save = () => {
  const data = {
    telnet: {
      enable: convertBooleanStatus(form.telnetEnable),
    },
    ssh: {
      enable: convertBooleanStatus(form.sshEnable),
    },
    wanhttp: {
      enable: convertBooleanStatus(form.remoteWebEnable),
    },
  }
  setTerminal(data).then(() => {
    successTips()
  })
}
const getTerminalData = () => {
  getTerminal().then(({ data }) => {
    const { telnet, ssh, wanhttp } = data
    form.telnetEnable = convertBooleanStatus(telnet.enable)
    form.sshEnable = convertBooleanStatus(ssh.enable)
    form.remoteWebEnable = convertBooleanStatus(wanhttp.enable)
  })
}
onMounted(() => {
  getTerminalData()
})
</script>
