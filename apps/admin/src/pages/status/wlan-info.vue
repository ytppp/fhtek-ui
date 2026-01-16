<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0931') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0702') }}</h2>
      </div>
      <fh-descriptions :data="b24gInfo" :border="true"></fh-descriptions>
      <!-- <div class="page__table">
        <fh-table
          :columns="b24gInterfaceColumns"
          :data-source="b24gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div> -->
      <div class="page__table">
        <fh-table
          :columns="b24gSsidColumns"
          :data-source="b24gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0704') }}</h2>
      </div>
      <fh-descriptions :data="b5gInfo" :border="true"></fh-descriptions>
      <!-- <div class="page__table">
        <fh-table
          :columns="b5gInterfaceColumns"
          :data-source="b5gInterfaceData"
          :show-row-checkbox="false"
          :show-index="false"
        >
        </fh-table>
      </div> -->
      <div class="page__table">
        <fh-table
          :columns="b5gSsidColumns"
          :data-source="b5gSsidData"
          :show-row-checkbox="false"
          :show-index="false"
          :border="true"
        >
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWifi2gAdv, getWifi5gAdv, getWifi2g, getWifi5g, getWlanDevices } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { useAppStore } from '@/stores/modules/app-store'
import { encryptsText, NetType, netTypeText, SsidText, Ssid4, Ssidac4 } from '@/util/constant'

defineOptions({
  name: 'StatusWlanInfoPage',
})

const { t } = useI18n()
const appStore = useAppStore()
const { convertBooleanStatus, defaultVal, defaultDataObj } = useDataClean()
const b24gInfo = reactive({
  status: {
    label: t('trans0705'),
    value: defaultVal,
  },
  channel: {
    label: t('trans0507'),
    value: defaultVal,
  },
})
const b5gInfo = reactive({
  status: {
    label: t('trans0705'),
    value: defaultVal,
  },
  channel: {
    label: t('trans0507'),
    value: defaultVal,
  },
})
const b24gInterfaceColumns = reactive([
  {
    key: 'interface',
    title: t('trans0140'),
  },
  {
    key: 'receive',
    title: t('trans0706'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
  {
    key: 'send',
    title: t('trans0707'),
    children: [
      {
        key: 'byte',
        title: t('trans0708'),
      },
      {
        key: 'package',
        title: t('trans0709'),
      },
      {
        key: 'error',
        title: t('trans0234'),
      },
      {
        key: 'abandon',
        title: t('trans0710'),
      },
    ],
  },
])
const b24gSsidColumns = reactive([
  {
    key: 'ssid',
    title: t('trans0454'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'enableAlias',
    title: t('trans0796'),
  },
  {
    key: 'hideAlias',
    title: t('trans0797'),
  },
  {
    key: 'encryptAlias',
    title: t('trans0031'),
  },
])
const b5gSsidColumns = reactive([
  {
    key: 'ssid',
    title: t('trans0454'),
  },
  {
    key: 'name',
    title: t('trans0712'),
  },
  {
    key: 'enableAlias',
    title: t('trans0796'),
  },
  {
    key: 'hideAlias',
    title: t('trans0797'),
  },
  {
    key: 'encryptAlias',
    title: t('trans0031'),
  },
])
const b24gInterfaceData = reactive([])
const b24gSsidData = reactive([])
const b5gInterfaceData = reactive([])
const b5gSsidData = reactive([])

const getWifi2gAdvData = () => {
  getWifi2gAdv().then(({ data }) => {
    const thisB24gInfo = {
      status: convertBooleanStatus(data.enable) ? t('trans0103') : t('trans0054'),
      channel: data.channel_current,
    }
    defaultDataObj(b24gInfo, thisB24gInfo)
  })
}
const getWifi5gAdvData = () => {
  getWifi5gAdv().then(({ data }) => {
    const thisB5gInfo = {
      status: convertBooleanStatus(data.enable) ? t('trans0103') : t('trans0054'),
      channel: data.channel_current,
    }
    defaultDataObj(b5gInfo, thisB5gInfo)
  })
}
const getWifi2gBasicData = () => {
  getWifi2g().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const tableData = []
    items.forEach((item) => {
      if (appStore.isSuper || (appStore.isAdmin && item.id !== Ssid4)) {
        tableData.push({
          ...item,
          ssid: SsidText[item.id],
          enableAlias: convertBooleanStatus(item.enable) ? t('trans0103') : t('trans0054'),
          hideAlias: convertBooleanStatus(item.enable_hide) ? t('trans0103') : t('trans0054'),
          encryptAlias: encryptsText[item.auth_mode],
        })
      }
    })
    b24gSsidData.splice(0, b24gSsidData.length, ...tableData)
  })
}
const getWifi5gBasicData = () => {
  getWifi5g().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const tableData = []
    items.forEach((item) => {
      if (appStore.isSuper || (appStore.isAdmin && item.id !== Ssidac4)) {
        tableData.push({
          ...item,
          ssid: SsidText[item.id],
          enableAlias: convertBooleanStatus(item.enable) ? t('trans0103') : t('trans0054'),
          hideAlias: convertBooleanStatus(item.enable_hide) ? t('trans0103') : t('trans0054'),
          encryptAlias: encryptsText[item.auth_mode],
        })
      }
    })
    b5gSsidData.splice(0, b5gSsidData.length, ...tableData)
  })
}
onMounted(() => {
  getWifi2gAdvData()
  getWifi5gAdvData()
  getWifi2gBasicData()
  getWifi5gBasicData()
})
</script>
