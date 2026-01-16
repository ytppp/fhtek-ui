<template>
  <div class="page wan-status">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0715') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0456')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="ipv4Data"
          :show-index="false"
          :show-row-checkbox="false"
          :border="true"
        >
          <template #ip="scope">
            <div v-if="scope.row.ip.length">
              <div v-for="(ip, index) in scope.row.ip" :key="index">{{ ip }}</div>
            </div>
          </template>
        </fh-table>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0593').format($t('trans0457')) }}</h2>
      </div>
      <div class="page__table">
        <fh-table
          :columns="ipv6Columns"
          :data-source="ipv6Data"
          :show-index="false"
          :show-row-checkbox="false"
          :border="true"
        >
          <template #ip="scope">
            <template v-if="scope.row.ip">
              <div v-for="(ip, index) in scope.row.ip" :key="index">{{ ip }}</div>
            </template>
          </template>
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, cidrToSubnetMask } from '@/util/tool'
import { getWanInfo } from '@/http/api'
import { NetType, netTypeText, WanStatus as Status, Role } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { useAppStore } from '@/stores/modules/app-store'

defineOptions({
  name: 'StatusWanPage',
})

const { t } = useI18n()
const { defaultVal } = useDataClean()
const appStore = useAppStore()
const StatusText = {
  [Status.UP]: t('trans0652'),
  [Status.DOWN]: t('trans0853'),
  [Status.DISCONNECTED]: t('trans0653'),
}
const columns = reactive([
  {
    key: 'wan',
    title: t('trans0140'),
    width: '240',
    minWidth: '100',
    fixed: 'left',
  },
  {
    key: 'statusAlias',
    title: t('trans0166'),
    minWidth: '90',
    width: '100',
    maxWidth: '120',
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
    maxWidth: '330',
    minWidth: '100',
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
    width: '120',
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'mode',
    title: t('trans0080'),
    width: '150',
    minWidth: '100',
  },
  {
    key: 'gateway',
    title: t('trans0548'),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'dns1',
    title: t('trans0496'),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'dns2',
    title: t('trans0497'),
    width: '200',
    minWidth: '100',
  },
])
const ipv6Columns = reactive([
  {
    key: 'wan',
    title: t('trans0140'),
    width: '240',
    minWidth: '100',
    fixed: 'left',
  },
  {
    key: 'statusAlias',
    title: t('trans0166'),
    minWidth: '90',
    width: '100',
    maxWidth: '120',
  },
  {
    key: 'prefix',
    title: t('trans0476'),
    width: '220',
    minWidth: '100',
  },
  {
    key: 'ip',
    title: format(t('trans0598'), [t('trans0056')]),
    maxWidth: '330',
    minWidth: '100',
  },
  {
    key: 'vlanPriority',
    title: t('trans0450'),
    width: '120',
  },
  {
    key: 'mac',
    title: format(t('trans0598'), [t('trans0057')]),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'mode',
    title: t('trans0080'),
    width: '150',
    minWidth: '100',
  },
  {
    key: 'gateway',
    title: t('trans0548'),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'dns1',
    title: t('trans0496'),
    width: '200',
    minWidth: '100',
  },
  {
    key: 'dns2',
    title: t('trans0497'),
    width: '200',
    minWidth: '100',
  },
])
const ipv4Data = reactive([])
const ipv6Data = reactive([])
const clubWifiVlanId = __APP_CUSTOMER_CONFIG__.clubWifiVlanId

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisIpv4Data = []
    const thisIpv6Data = []
    items.forEach((item) => {
      const ipv4 = item.ipv4
      const ipv6 = item.ipv6
      let dns1 = ''
      let dns2 = ''
      let vlanPriority = ''
      const statusAlias = StatusText[item.status]
      if (item.dns_servers.length > 0) {
        dns1 = item.dns_servers[0]
        dns2 = item.dns_servers.length >= 2 && item.dns_servers[1]
      }
      const ipArr: string[] = []
      const gatewayArr: string[] = []
      const prefixArr: string[] = []
      ipv4.forEach((ipv4Item) => {
        if (ipv4Item.hasOwnProperty('address')) {
          ipArr.push(ipv4Item.address.split('/')[0])
        }
        if (ipv4Item.hasOwnProperty('gateway')) {
          gatewayArr.push(ipv4Item.gateway)
        }
      })
      ipv6.forEach((ipv6Item) => {
        if (ipv6Item.hasOwnProperty('address')) {
          ipArr.push(ipv6Item.address.split('/')[0])
        }
        if (ipv6Item.hasOwnProperty('gateway')) {
          gatewayArr.push(ipv6Item.gateway)
        }
        if (ipv6Item.hasOwnProperty('prefix')) {
          prefixArr.push(ipv6Item.prefix)
        }
      })
      item.vid = item.vid || defaultVal
      item.p8021 = item.p8021 || defaultVal
      vlanPriority = `${item.vid}/${item.p8021}`
      const tableItem = {
        ...item,
        wan: item.wanname,
        ip: ipArr,
        mode: netTypeText[item.protocol],
        gateway: gatewayArr.join(' '),
        prefix: prefixArr.join(''),
        dns1,
        dns2,
        vlanPriority,
        mac: item.macaddr,
        statusAlias,
      }
      if (ipv4.length > 0 || item.protocol === NetType.dhcp || item.protocol === NetType.pppoe) {
        thisIpv4Data.push(tableItem)
      } else if (
        ipv6.length > 0 ||
        item.protocol === NetType.slaac ||
        item.protocol === NetType.dhcpv6
      ) {
        thisIpv6Data.push(tableItem)
      }
      if (
        item.protocol === NetType.bridge &&
        (appStore.isSuper || (appStore.isAdmin && clubWifiVlanId && item.vid !== clubWifiVlanId))
      ) {
        thisIpv4Data.push(tableItem)
        thisIpv6Data.push(tableItem)
      }
    })
    ipv4Data.splice(0, ipv4Data.length, ...thisIpv4Data)
    ipv6Data.splice(0, ipv6Data.length, ...thisIpv6Data)
  })
}

onMounted(() => {
  getWanData()
})
</script>

<style lang="less">
.wan-status {
  .table-main {
    max-width: 980px;
  }
}
</style>
