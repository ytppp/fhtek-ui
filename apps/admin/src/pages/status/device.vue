<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0482') }}</h1>
    </div>
    <div class="page__content">
      <fh-descriptions :data="basicInfo"></fh-descriptions>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { getDevInfo } from '@/http/api'

const { t } = useI18n()
const { defaultDataObj, defaultVal } = useDataClean()

const basicInfo = reactive({
  model: {
    label: t('trans0540'),
    value: defaultVal,
  },
  sn: {
    label: t('trans0541'),
    value: defaultVal,
  },
  hwVersion: {
    label: t('trans0542'),
    value: defaultVal,
  },
  swVersion: {
    label: t('trans0543'),
    value: defaultVal,
  },
})

const getDevInfoData = () => {
  getDevInfo().then(({ data }) => {
    const thisBasicInfo = {
      model: data.model,
      sn: data.xponsn,
      hwVersion: data.hwver,
      swVersion: data.softver,
    }
    defaultDataObj(basicInfo, thisBasicInfo)
  })
}

onMounted(() => {
  getDevInfoData()
})
</script>
