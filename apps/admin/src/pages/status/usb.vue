<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0813') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0749') }}</h2>
      </div>
      <fh-descriptions :data="usbInfo"></fh-descriptions>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUsb } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { t } = useI18n()
const { convertBooleanStatus, defaultDataObj, defaultVal } = useDataClean()

const usbInfo = reactive({
  status: {
    label: t('trans0813'),
    value: defaultVal,
  },
})

const getUsbInfo = () => {
  getUsb().then(({ data }) => {
    defaultDataObj(usbInfo, {
      status: convertBooleanStatus(data.has_usb) ? t('trans0652') : t('trans0653'),
    })
  })
}

onMounted(() => {
  getUsbInfo()
})
</script>
