<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0647') }}</h1>
    </div>
    <div class="page__content">
      <fh-descriptions :data="vpnInfo"></fh-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { getVpnInfo } from '@/http/api'
import { VpnTypeText } from '@/util/constant'

const { t } = useI18n()
const { defaultDataObj, defaultVal } = useDataClean()

enum VpnStatus {
  up = 'up',
  down = 'down',
}
const vpnInfo = reactive({
  status: {
    label: t('trans0649'),
    value: defaultVal,
  },
  type: {
    label: t('trans0648'),
    value: defaultVal,
  },
  ip: {
    label: t('trans0598').format(t('trans0056')),
    value: defaultVal,
  },
  gateway: {
    label: t('trans0548'),
    value: defaultVal,
  },
})

const getVpnInfoData = () => {
  getVpnInfo().then(({ data }) => {
    const thisVpnInfo = {
      status:
        VpnStatus[data.status as VpnStatus] === VpnStatus.up ? t('trans0652') : t('trans0653'),
      type: VpnTypeText[data.type],
      ip: data.ip,
      gateway: data.gateway,
    }
    defaultDataObj(vpnInfo, thisVpnInfo)
  })
}

onMounted(() => {
  getVpnInfoData()
})
</script>
