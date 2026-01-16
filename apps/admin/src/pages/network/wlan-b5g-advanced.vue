<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ format($t('trans0611'), [$t('trans0050')]) }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding" ref="wifiFormRef" :model="wifi" :rules="rules">
        <fh-form-item :label="format($t('trans0027'), [$t('trans0050')])">
          <fh-switch @change="switchEnable" v-model="wifi.enable" :disabled="enableMesh">
          </fh-switch>
        </fh-form-item>
        <template v-if="wifi.enable">
          <fh-form-item :label="$t('trans0508')">
            <fh-select @change="changeMode" v-model="wifi.mode" :options="modeOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0509')">
            <fh-select @change="changeBw" v-model="wifi.bw" :options="bwOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0507')">
            <fh-select v-model="wifi.channel" :options="channelOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0044')">
            <fh-select v-model="wifi.power" :options="powerOpts"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0801')" prop="beacon">
            <fh-input v-model="wifi.beacon"> </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, onMounted, computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, isValidInteger, successTips } from '@/util/tool'
import { getWifi5gAdv, setWifi5gAdv, getMesh } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { useAppStore } from '@/stores/modules/app-store'

defineOptions({
  name: 'b5gAdvancedPage',
})
enum BandWidths5G {
  b20 = 'bw20',
  b40 = 'bw40',
  b80 = 'bw80',
  b20m40 = 'bw20m40',
  b20m40m80m160 = 'bw20m40m80m160',
}
enum SelectMode5G {
  modeAonly = '2', // 802.11a 显示20M频宽
  modeANmixed = '8', // 802.11a/n 显示20M, 40M, 20/40M频宽
  modeACNA = '14', // 802.11a/n/ac 显示全部频宽
  modeACN = '15', // 802.11n/ac 显示全部频宽
  modeAx = '17', // 802.11a/n/ac/ax 显示全部频宽
  modeBE = '23', // 802.11a/n/ac/ax/be 显示全部频宽
}
enum Powermodes {
  low = '50', // 50%
  middle = '75', // 75%
  high = '100', // 100%
}
enum Channels5G {
  auto = '0',
  ch36 = '36',
  ch40 = '40',
  ch44 = '44',
  ch48 = '48',
  ch52 = '52',
  ch56 = '56',
  ch60 = '60',
  ch64 = '64',
  ch100 = '100',
  ch104 = '104',
  ch108 = '108',
  ch112 = '112',
  ch116 = '116',
  ch132 = '132',
  ch136 = '136',
  ch140 = '140',
  ch144 = '144',
  ch149 = '149',
  ch153 = '153',
  ch157 = '157',
  ch161 = '161',
  ch165 = '165',
}
const dialog = inject('dialog')
const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const appStore = useAppStore()
const channelCurrent = ref('0')
const wifiEnableInitial = ref(false)
const enableMesh = ref(false)
const wifiFormRef = useTemplateRef('wifiFormRef')
const b5gModeInit = [
  {
    value: SelectMode5G.modeAonly,
    text: '802.11a',
    show: true,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
    ],
  },
  {
    value: SelectMode5G.modeANmixed,
    text: '802.11a/n',
    show: true,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
      {
        value: BandWidths5G.b40,
        text: '40MHz',
      },
      {
        value: BandWidths5G.b20m40,
        text: '20/40MHz',
      },
    ],
  },
  {
    value: SelectMode5G.modeACNA,
    text: '802.11a/n/ac',
    show: true,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
      {
        value: BandWidths5G.b40,
        text: '40MHz',
      },
      {
        value: BandWidths5G.b80,
        text: '80MHz',
      },
      {
        value: BandWidths5G.b20m40m80m160,
        text: '20/40/80/160MHz',
      },
    ],
  },
  {
    value: SelectMode5G.modeACN,
    text: '802.11n/ac',
    show: true,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
      {
        value: BandWidths5G.b40,
        text: '40MHz',
      },
      {
        value: BandWidths5G.b80,
        text: '80MHz',
      },
      {
        value: BandWidths5G.b20m40m80m160,
        text: '20/40/80/160MHz',
      },
    ],
  },
  {
    value: SelectMode5G.modeAx,
    text: '802.11a/n/ac/ax',
    show: true,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
      {
        value: BandWidths5G.b40,
        text: '40MHz',
      },
      {
        value: BandWidths5G.b80,
        text: '80MHz',
      },
      {
        value: BandWidths5G.b20m40m80m160,
        text: '20/40/80/160MHz',
      },
    ],
  },
  {
    value: SelectMode5G.modeBE,
    text: '802.11a/n/ac/ax/be',
    show: appStore.isWifiV7,
    bw: [
      {
        value: BandWidths5G.b20,
        text: '20MHz',
      },
      {
        value: BandWidths5G.b40,
        text: '40MHz',
      },
      {
        value: BandWidths5G.b80,
        text: '80MHz',
      },
      {
        value: BandWidths5G.b20m40m80m160,
        text: '20/40/80/160MHz',
      },
    ],
  },
]
const b5gChannelsInit = [
  {
    value: Channels5G.auto,
    text: format(t('trans0510'), [channelCurrent.value]),
    show: true,
  },
  {
    value: Channels5G.ch36,
    text: Channels5G.ch36,
    show: true,
  },
  {
    value: Channels5G.ch40,
    text: Channels5G.ch40,
    show: true,
  },
  {
    value: Channels5G.ch44,
    text: Channels5G.ch44,
    show: true,
  },
  {
    value: Channels5G.ch48,
    text: Channels5G.ch48,
    show: true,
  },
  {
    value: Channels5G.ch52,
    text: Channels5G.ch52,
    show: true,
  },
  {
    value: Channels5G.ch56,
    text: Channels5G.ch56,
    show: true,
  },
  {
    value: Channels5G.ch60,
    text: Channels5G.ch60,
    show: true,
  },
  {
    value: Channels5G.ch64,
    text: Channels5G.ch64,
    show: true,
  },
  {
    value: Channels5G.ch100,
    text: Channels5G.ch100,
    show: true,
  },
  {
    value: Channels5G.ch104,
    text: Channels5G.ch104,
    show: true,
  },
  {
    value: Channels5G.ch108,
    text: Channels5G.ch108,
    show: true,
  },
  {
    value: Channels5G.ch112,
    text: Channels5G.ch112,
    show: true,
  },
  {
    value: Channels5G.ch116,
    text: Channels5G.ch116,
    show: true,
  },
  {
    value: Channels5G.ch132,
    text: Channels5G.ch132,
    show: true,
  },
  {
    value: Channels5G.ch136,
    text: Channels5G.ch136,
    show: true,
  },
  {
    value: Channels5G.ch140,
    text: Channels5G.ch140,
    show: true,
  },
  {
    value: Channels5G.ch144,
    text: Channels5G.ch144,
    show: true,
  },
  {
    value: Channels5G.ch149,
    text: Channels5G.ch149,
    show: true,
  },
  {
    value: Channels5G.ch153,
    text: Channels5G.ch153,
    show: true,
  },
  {
    value: Channels5G.ch157,
    text: Channels5G.ch157,
    show: true,
  },
  {
    value: Channels5G.ch161,
    text: Channels5G.ch161,
    show: true,
  },
  {
    value: Channels5G.ch165,
    text: Channels5G.ch165,
    show: true,
  },
]
const powerOpts = [
  {
    value: Powermodes.low,
    text: t('trans0045'),
  },
  {
    value: Powermodes.middle,
    text: t('trans0046'),
  },
  {
    value: Powermodes.high,
    text: t('trans0047'),
  },
]
const wifi = reactive({
  enable: false,
  mode: SelectMode5G.modeAonly,
  bw: BandWidths5G.b20,
  channel: Channels5G.auto,
  power: Powermodes.high,
  beacon: '',
})
const rules = reactive({
  beacon: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 20, 1000),
      message: format(t('trans0567'), [20, 1000]),
    },
  ],
})
/*
  1). 频宽只有配置为20Mhz，才会显示116和165信道，否则不显示这2个信道;
  2). 116或165信道时，频宽配置为非20Mhz时，信道会自动调整为自动信道，且信道不会再显示116和165信道
*/
const specialBandwidths = [BandWidths5G.b20]
const specialChannels = [Channels5G.ch116, Channels5G.ch165]

const modeOpts = computed(() => {
  return b5gModeInit.filter((item) => item.show)
})
const bwOpts = computed(() => {
  return modeOpts.value.find((item) => item.value === wifi.mode)?.bw || []
})
const channelOpts = computed(() => {
  return b5gChannelsInit.filter((item) => {
    if (specialBandwidths.includes(wifi.bw)) {
      if (specialChannels.includes(item.value)) {
        item.show = true
      }
      return item.show === true
    } else {
      if (specialChannels.includes(item.value)) {
        item.show = false
      }
      return item.show === true
    }
  })
})
const changeMode = () => {
  if (!bwOpts.value.find((item) => item.value === wifi.bw)) {
    wifi.bw = bwOpts.value[0].value
  }
}

const changeBw = () => {
  if (
    wifi.bw !== BandWidths5G.b20 &&
    (wifi.channel === Channels5G.ch116 || wifi.channel === Channels5G.ch165)
  ) {
    wifi.channel = Channels5G.auto
  }
}
const switchEnable = (val) => {
  if (!val && wifiEnableInitial.value) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0025'),
      })
      .then(() => {
        setWifi5gAdvData({
          enable: convertBooleanStatus(wifi.enable),
        })
      })
      .catch(() => {
        wifi.enable = true
      })
  }
}
const getWifi5gData = () => {
  getWifi5gAdv().then(({ data }) => {
    wifiEnableInitial.value = wifi.enable = convertBooleanStatus(data.enable)
    wifi.mode = data.mode
    wifi.bw = data.bw
    wifi.channel = data.channel
    wifi.power = data.power
    wifi.beacon = data.beacon_interval
    if (Channels5G.auto === wifi.channel) {
      channelCurrent.value = data.channel_current
      b5gChannelsInit[0].text = format(t('trans0510'), [channelCurrent.value])
    }
  })
}
const save = () => {
  if (wifiFormRef.value?.validate()) {
    const data = {
      enable: convertBooleanStatus(wifi.enable),
      mode: wifi.mode,
      bw: wifi.bw,
      channel: wifi.channel,
      power: wifi.power,
      beacon_interval: wifi.beacon,
    }
    setWifi5gAdvData(data)
  }
}
const getMeshData = () => {
  getMesh().then(({ data }) => {
    enableMesh.value = convertBooleanStatus(data.enable) as boolean
  })
}
const setWifi5gAdvData = (data) => {
  setWifi5gAdv(data).then(() => {
    successTips()
    getWifi5gData()
  })
}
onMounted(() => {
  getWifi5gData()
  getMeshData()
})
</script>
