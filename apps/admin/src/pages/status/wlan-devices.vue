<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0932') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0933') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="wlanDevicesColumns"
          :data-source="b24gWlanDataDisplay"
          :show-row-checkbox="false"
          :border="true"
          :show-index="false"
          :show-pagination="true"
          :show-search="true"
        >
          <template #blacklist="scope">
            <fh-icon
              @click="goWifiMacFilterPage(scope.row.mac)"
              class="page__header-icon"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0934') }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="wlanDevicesColumns"
          :data-source="b5gWlanDataDisplay"
          :show-row-checkbox="false"
          :border="true"
          :show-index="false"
          :show-pagination="true"
          :show-search="true"
        >
          <template #blacklist="scope">
            <fh-icon
              @click="goWifiMacFilterPage(scope.row.mac)"
              class="page__header-icon"
              name="icon-add"
              :title="$t('trans0164')"
            />
          </template>
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, inject, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { format } from '@/util/tool'
import { getWlanDevices } from '@/http/api'
import { NetType, netTypeText } from '@/util/constant'
import { router } from '@/router/index'

defineOptions({
  name: 'StatusWlanPage',
})

const { t } = useI18n()
const dialog = inject('dialog')
const wlanDevicesColumns = reactive([
  {
    key: 'id',
    title: t('trans0454'),
  },
  {
    key: 'name',
    title: t('trans0935'),
  },
  {
    key: 'ssid',
    title: t('trans0712'),
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
  },
  {
    key: 'blacklist',
    title: t('trans0105'),
  },
])
const b24gWlanData = reactive([])
const b5gWlanData = reactive([])

const b24gWlanDataDisplay = computed(() => {
  return b24gWlanData
})
const b5gWlanDataDisplay = computed(() => {
  return b5gWlanData
})

const getWlanDeviceData = () => {
  getWlanDevices().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const b24gWlanTableData = []
    const b5gWlanTableData = []
    let b24gIndex = 0
    let b5gIndex = 0
    items.forEach((item) => {
      if (item.type === NetType.b24g) {
        b24gIndex++
        b24gWlanTableData.push({
          ...item,
          id: b24gIndex,
          typeAlias: netTypeText[item.type],
        })
      }
      if (item.type === NetType.b5g) {
        b5gIndex++
        b5gWlanTableData.push({
          ...item,
          id: b5gIndex,
          typeAlias: netTypeText[item.type],
        })
      }
    })
    // for (let i = 0; i < 100; i++) {
    //   b24gWlanTableData.push({
    //     id: i + 1,
    //     name: `name${i}`,
    //     ssid: `ssid${i}`,
    //     ip: `192.168.1.${i}`,
    //     mac: `00:00:00:00:00:${i}`,
    //   })
    // }
    // for (let i = 0; i < 100; i++) {
    //   b5gWlanTableData.push({
    //     id: i + 1,
    //     name: `name${i}`,
    //     ssid: `ssid${i}`,
    //     ip: `192.168.1.${i}`,
    //     mac: `00:00:00:00:00:${i}`,
    //   })
    // }
    b24gWlanData.splice(0, b24gWlanData.length, ...b24gWlanTableData)
    b5gWlanData.splice(0, b5gWlanData.length, ...b5gWlanTableData)
  })
}
const goWifiMacFilterPage = (mac) => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0937'),
    })
    .then(() => {
      router.push({
        name: 'wifiMacFilter',
        query: { t: Date.now(), mac },
      })
    })
    .catch(() => {})
}
onMounted(() => {
  getWlanDeviceData()
})
</script>
