<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0718') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0719') }}</h2>
      </div>
      <fh-descriptions :data="linkInfo"></fh-descriptions>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0720') }}</h2>
      </div>
      <fh-descriptions :data="packetsInfo"></fh-descriptions>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0721') }}</h2>
      </div>
      <fh-descriptions :data="opticalInfo"></fh-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { getPonInfo } from '@/http/api'

enum LinkStatus {
  offlineO1 = '1',
  offlineO2 = '2',
  offlineO3 = '3',
  offlineO4 = '4',
  onlineO5 = '5',
}

const { t } = useI18n()
const { defaultDataObj, defaultVal, convertBooleanStatus } = useDataClean()

const linkInfo = reactive({
  status: {
    label: t('trans0722'),
    value: defaultVal,
  },
  fecEnable: {
    label: t('trans0723'),
    value: defaultVal,
  },
  // encrypt: {
  //   label: t('trans0536'),
  //   value: defaultVal,
  // },
  alarm: {
    label: t('trans0724'),
    value: defaultVal,
  },
})
const packetsInfo = reactive({
  send: {
    label: t('trans0725'),
    value: defaultVal,
  },
  receive: {
    label: t('trans0726'),
    value: defaultVal,
  },
})
const opticalInfo = reactive({
  transmit: {
    label: t('trans0727'),
    value: defaultVal,
    unit: 'dBm',
  },
  receive: {
    label: t('trans0728'),
    value: defaultVal,
    unit: 'dBm',
  },
  voltage: {
    label: t('trans0729'),
    value: defaultVal,
    unit: 'mV',
  },
  bias: {
    label: t('trans0730'),
    value: defaultVal,
    unit: 'mA',
  },
  temperature: {
    label: t('trans0731'),
    value: defaultVal,
    unit: '℃',
  },
})
const LinkStatusText = {
  [LinkStatus.offlineO1]: `${t('trans0655')}(O1)`,
  [LinkStatus.offlineO2]: `${t('trans0655')}(O2)`,
  [LinkStatus.offlineO3]: `${t('trans0655')}(O3)`,
  [LinkStatus.offlineO4]: `${t('trans0655')}(O4)`,
  [LinkStatus.onlineO5]: `${t('trans0654')}(O5)`,
}

const getPonInfoData = () => {
  getPonInfo().then(({ data }) => {
    const thisLinkInfo = {
      status: LinkStatusText[data.link_status],
      fecEnable: convertBooleanStatus(data.fec_enable) ? t('trans0103') : t('trans0054'),
      encrypt: convertBooleanStatus(data.encryption_mode) ? t('trans0103') : t('trans0054'),
      alarm: convertBooleanStatus(data.alarm_info) ? t('trans0412') : t('trans0925'),
    }
    const thisPacketsInfo = {
      send: data.packets_sent,
      receive: data.packets_received,
    }
    const thisOpticalInfo = {
      transmit: data.tx_light_power,
      receive: data.rx_light_power,
      voltage: data.voltage,
      bias: data.current,
      temperature: data.temperature,
    }
    defaultDataObj(linkInfo, thisLinkInfo)
    defaultDataObj(packetsInfo, thisPacketsInfo)
    defaultDataObj(opticalInfo, thisOpticalInfo)
  })
}

onMounted(() => {
  getPonInfoData()
})
</script>
