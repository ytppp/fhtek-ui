<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0938') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0407')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="dhcpColumn"
          :data-source="dhcpData"
          :show-row-checkbox="false"
          :border="true"
          :show-index="false"
          :show-pagination="true"
          :show-search="true"
        >
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0408')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="dhcpv6Column"
          :data-source="dhcpv6DataDisplay"
          :show-row-checkbox="false"
          :border="true"
          :show-index="false"
          :show-pagination="true"
          :show-search="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, formatDuration } from '@/util/tool'
import { getStaInfo } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

enum IpType {
  v4 = '1',
  v6 = '2',
}
const { t } = useI18n()
const { defaultVal } = useDataClean()
const dhcpColumn = reactive([
  {
    key: 'id',
    title: t('trans0454'),
  },
  {
    key: 'hostname',
    title: t('trans0935'),
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
    key: 'lease',
    title: t('trans0745'),
  },
])
const dhcpv6Column = reactive([
  {
    key: 'id',
    title: t('trans0454'),
  },
  {
    key: 'hostname',
    title: t('trans0935'),
  },
  {
    key: 'ipv6',
    title: format(t('trans0598'), [t('trans0457')]),
  },
  {
    key: 'duid',
    title: t('trans0746'),
  },
  {
    key: 'lease',
    title: t('trans0745'),
  },
])
const dhcpData = reactive([])
const dhcpv6Data = reactive([])

const dhcpv6DataDisplay = computed(() => {
  return dhcpv6Data
})

const transformDuration = (zone) => {
  if (!zone || window.isNaN(zone) || parseInt(zone, 10) < 0) {
    return defaultVal
  }
  zone = Number(zone)
  let timeArr = formatDuration(zone)
  let suffixs = [
    {
      key: 'year',
      text: 'trans0927',
      limitBefore: 1, // 向当前位的下多少位取值
    },
    {
      key: 'month',
      text: 'trans0928',
      limitBefore: 1,
    },
    {
      key: 'day',
      text: 'trans0499',
      limitBefore: 1,
    },
    {
      key: 'hour',
      text: 'trans0500',
      limitBefore: 1,
    },
    {
      key: 'minute',
      text: 'trans0501',
      limitBefore: 0,
    },
    {
      key: 'second',
      text: 'trans0488',
      limitBefore: 0,
    },
  ]
  const first = timeArr.findIndex((val) => val) // 找到第一个有值的日期
  const suffix = suffixs[first]
  const last = first + suffix.limitBefore + 1
  timeArr = timeArr.slice(first, last)
  suffixs = suffixs.slice(first, last)
  let durationStr = ''
  suffixs.forEach((item, i) => {
    if (timeArr[i]) {
      durationStr += `${timeArr[i]} ${t(suffixs[i].text)} `
    }
  })
  return durationStr
}
const getStaInfoData = () => {
  getStaInfo().then(({ data }) => {
    const { items } = data
    const thisDhcpData = []
    const thisDhcpv6Data = []
    let b24gIndex = 0
    let b5gIndex = 0
    items.forEach((item) => {
      const lease = transformDuration(item.lease)
      if (item.type === IpType.v4) {
        b24gIndex++
        thisDhcpData.push({
          ...item,
          id: b24gIndex,
          lease,
        })
      }
      if (item.type === IpType.v6) {
        b5gIndex++
        thisDhcpv6Data.push({
          ...item,
          id: b5gIndex,
          lease,
        })
      }
    })
    // for (let i = 0; i < 100; i++) {
    //   thisDhcpData.push({
    //     id: i + 1,
    //     hostname: `hostname${i}`,
    //     ip: `192.168.1.${i}`,
    //     mac: `00:00:00:00:00:${i}`,
    //     lease: transformDuration(10000),
    //   })
    // }
    // for (let i = 0; i < 100; i++) {
    //   thisDhcpv6Data.push({
    //     id: i + 1,
    //     hostname: `hostname${i}`,
    //     ipv6: `192.168.1.${i}`,
    //     duid: `00:00:00:00:00:${i}`,
    //     lease: transformDuration(10000),
    //   })
    // }
    dhcpData.splice(0, dhcpData.length, ...thisDhcpData)
    dhcpv6Data.splice(0, dhcpv6Data.length, ...thisDhcpv6Data)
  })
}
onMounted(() => {
  getStaInfoData()
})
</script>
