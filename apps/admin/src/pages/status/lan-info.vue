<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0936') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0716') }}</h2>
      </div>
      <fh-descriptions :data="basicInfo" :border="true"></fh-descriptions>
      <div class="page__table">
        <fh-table
          :columns="lanListColumns"
          :data-source="lanListData"
          :show-row-checkbox="false"
          :show-index="false"
          :border="true"
        >
        </fh-table>
      </div>
      <div class="page__table">
        <fh-table
          :columns="interfaceColumns"
          :data-source="interfaceData"
          :show-row-checkbox="false"
        >
        </fh-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { format, formatNetworkData } from '@/util/tool'
import { getLanInfo } from '@/http/api'
import { lan, SsidText, ModeText } from '@/util/constant'

const { t, n } = useI18n()
const { defaultDataObj, defaultVal } = useDataClean()
const Down = 'down'
const basicInfo = reactive({
  ip: {
    label: format(t('trans0598'), [t('trans0056')]),
    value: defaultVal,
  },
  ipv6: {
    label: format(t('trans0598'), [t('trans0457')]),
    value: defaultVal,
  },
  mac: {
    label: format(t('trans0598'), [t('trans0057')]),
    value: defaultVal,
  },
})
const lanListColumns = ref([])
const interfaceColumns = reactive([
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
        key: 'byte1',
        title: t('trans0708'),
      },
      {
        key: 'package1',
        title: t('trans0709'),
      },
      {
        key: 'error1',
        title: t('trans0234'),
      },
      {
        key: 'abandon1',
        title: t('trans0710'),
      },
    ],
  },
])
const lanListData = ref([])
const interfaceData = reactive([])

const getLanInfoData = () => {
  getLanInfo().then(({ data }) => {
    const { ip, ipv6, mac, lan: lanData, datas } = data
    const thisLanListData = {}
    const thisLanListColumns = []
    const thisInterfaceData = []
    const thisBasicInfo = {
      ip,
      ipv6,
      mac,
    }
    const lanKeyTotal = Object.keys(lanData).length
    for (let i = 1; i <= lanKeyTotal; i++) {
      const key = `${lan}${i}`
      if (lanData[key]) {
        thisLanListData[key] = convertLan(lanData[key])
        thisLanListColumns.push({
          key,
          title: SsidText[key],
        })
      }
    }
    datas.forEach((item) => {
      const receiveByte = formatNetworkData(item.receive.byte)
      const sendByte = formatNetworkData(item.send.byte)
      thisInterfaceData.push({
        interface: SsidText[item.ifname],
        byte: `${receiveByte.value} ${receiveByte.unit}`,
        package: n(Number(item.receive.package)),
        error: n(Number(item.receive.error)),
        abandon: n(Number(item.receive.abandon)),
        byte1: `${sendByte.value} ${sendByte.unit}`,
        package1: n(Number(item.send.package)),
        error1: n(Number(item.send.error)),
        abandon1: n(Number(item.send.abandon)),
      })
    })
    defaultDataObj(basicInfo, thisBasicInfo)
    lanListData.value = [thisLanListData]
    lanListColumns.value = thisLanListColumns
    interfaceData.splice(0, interfaceData.length, ...thisInterfaceData)
  })
}
const convertLan = (lanVal) => {
  return lanVal === Down ? t('trans0653') : ModeText[lanVal]
}

onMounted(() => {
  getLanInfoData()
})
</script>
