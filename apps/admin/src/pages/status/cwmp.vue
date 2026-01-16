<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0249') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="enableCwmp">
        <fh-descriptions :data="interaction"></fh-descriptions>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0909') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { getSwmpStatus } from '@/http/api'
import { CwmpStatus } from '@/util/constant'

const { t } = useI18n()
const { defaultDataObj, defaultVal, convertBooleanStatus } = useDataClean()
const enableCwmp = ref(false)
const CwmpStatusText = {
  [CwmpStatus.ReportedSuccessfully]: t('trans0910'),
  [CwmpStatus.ReportedFail]: t('trans0911'),
  [CwmpStatus.Tring]: t('trans0653'),
}
const interaction = reactive({
  url: {
    label: t('trans0912'),
    value: defaultVal,
  },
  inform: {
    label: t('trans0743'),
    value: defaultVal,
  },
})

const getSwmpStatusData = () => {
  getSwmpStatus().then(({ data }) => {
    enableCwmp.value = convertBooleanStatus(data.enable) as boolean
    const thisInteraction = {
      url: data.server,
      inform: CwmpStatusText[data.inform_Status as CwmpStatus],
    }
    defaultDataObj(interaction, thisInteraction)
  })
}

onMounted(() => {
  getSwmpStatusData()
})
</script>
