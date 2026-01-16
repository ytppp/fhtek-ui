<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ format($t('trans0544'), [$t('trans0049')]) }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0118') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="wifiFormRef"
        :model="wifi"
        :rules="rules"
        :disabled="formDisabled"
      >
        <fh-form-item :label="$t('trans0711')">
          <fh-select @change="changeSsid" v-model="wifi.id" :options="ssidOpts" not-disabled>
          </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0712')" prop="ssid">
          <fh-input v-model="wifi.ssid"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0796')">
          <fh-switch v-model="wifi.enable" :disabled="wifiDisabled"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0797')">
          <fh-switch v-model="wifi.hide"> </fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0747')" prop="sta">
          <fh-input v-model="wifi.sta" :not-disabled="notDisabledProp"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0031')">
          <fh-select v-model="wifi.encrypt" :options="encryptsOpts"> </fh-select>
          <template #extra>
            <fh-alert v-if="encryptTip" :title="encryptTip" type="info" show-icon />
          </template>
        </fh-form-item>
        <fh-form-item :label="$t('trans0030')" v-if="!isEncryptNone" prop="password">
          <fh-input
            v-model="wifi.password"
            type="password"
            minlength="8"
            maxlength="64"
            show-password
          >
          </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0798')" v-if="isSsid1">
          <fh-switch v-model="wifi.enableWps"> </fh-switch>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" :not-disabled="notDisabledProp" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <template v-if="isEnableWps">
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0799') }}</h2>
        </div>
        <fh-form class="form form--padding">
          <fh-form-item :label="$t('trans0800')">
            {{ wpsStatusText }}
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="start" block v-if="isStart">
              {{ $t('trans0557') }}
            </fh-button>
            <fh-button @click="stop" block v-if="isStop">
              {{ $t('trans0804') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  isValidLength,
  isValidSymbol,
  format,
  specialChar,
  isValidInteger,
  successTips,
} from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { getWifi2g, setWifi2g, getWps, setWps, getMesh, getWifi2gAdv, getWifiMlo } from '@/http/api'
import {
  StartAndStop,
  Encrypts,
  encrypts,
  WpsStatus,
  SsidText,
  Ssid1,
  Ssid4,
  Role,
} from '@/util/constant'
import { useCountDown } from '@/hooks/countdown'
import { useAppStore } from '@/stores/modules/app-store'

defineOptions({
  name: 'b24gBasicPage',
})

const loading = ref(false)
const { t } = useI18n()
const { convertBooleanStatus, defaultVal } = useDataClean()
const appStore = useAppStore()
const wifiFormRef = useTemplateRef('wifiFormRef')
const enableMesh = ref(false)
const enableSteering = ref(false)
const timeout = 2 * 60 * 1000
const interval = 5000
const ssidOpts = reactive([])
const ssidList = reactive([])
const enableMlo = ref(false)
const wifiEnable = ref(false)
const wifi = reactive({
  id: '',
  ssid: '',
  sta: 0,
  enable: false,
  enableInitial: false,
  hide: false,
  encrypt: Encrypts.none,
  password: '',
  enableWps: false,
  enableWpsInitial: false,
})
const wps = reactive({
  id: '',
  status: '',
})
const WpsText = {
  [WpsStatus.idle]: t('trans0807'),
  [WpsStatus.inProgress]: t('trans0808'),
  [WpsStatus.configured]: t('trans0809'),
  [WpsStatus.unknown]: t('trans0807'),
}
const rules = reactive({
  ssid: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 32),
      message: format(t('trans0003'), [t('trans0712'), 1, 32]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0712'), format(t('trans0042'), [specialChar])]),
    },
  ],
  password: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 8, 63),
      message: format(t('trans0003'), [t('trans0196'), 8, 63]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0196'), format(t('trans0042'), [specialChar])]),
    },
  ],
  sta: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 0, 64),
      message: format(t('trans0567'), [0, 64]),
    },
  ],
})

const encryptsOpts = computed(() => {
  if (appStore.isWifiV7) {
    const EncryptsList = [
      Encrypts.none,
      Encrypts.wpa2PskCcmp,
      Encrypts.wpa3SaeCcmp,
      Encrypts.wpaWpa2PskCcmp,
      Encrypts.wpaWpa2PskTkipCcmp,
      Encrypts.wpa2PskWpa3SaeCcmp,
    ]
    return encrypts.filter((item) => EncryptsList.includes(item.value))
  } else {
    return encrypts
  }
})
const wpsStatusText = computed(() => {
  if (loading.value) return defaultVal
  return WpsText[wps.status]
})
const isStart = computed(() =>
  [WpsStatus.idle, WpsStatus.unknown, WpsStatus.configured].includes(wps.status),
)
const isStop = computed(() => wps.status === WpsStatus.inProgress)
const isEncryptNone = computed(() => {
  return wifi.encrypt === Encrypts.none
})
const encryptTip = computed(() => {
  if (isEncryptNone.value) {
    return t('trans0032')
  }
  return ''
})
const isSsid1 = computed(() => {
  return wifi.id === Ssid1
})
const notDisabledProp = computed(() => {
  if (!wifiEnable.value) {
    return false
  }
  return mloDisabled.value
})
const isEnableWps = computed(() => {
  return wifi.enableWpsInitial && wifi.enableInitial && isSsid1.value && wifiEnable.value
})
const formDisabled = computed(() => {
  return !wifiEnable.value || (isSsid1.value && (enableSteering.value || mloDisabled.value))
})
const wifiDisabled = computed(() => {
  if (formDisabled.value) {
    return true
  }
  return isSsid1.value && enableMesh.value
})
const mloDisabled = computed(() => {
  if (appStore.isWifiV7) {
    return enableMlo.value
  } else {
    return false
  }
})

const start = () => {
  saveWps(StartAndStop.start)
}
const stop = () => {
  saveWps(StartAndStop.stop)
}
const saveWps = (order: StartAndStop) => {
  setWps({
    id: wps.id,
    order,
  }).then(() => {
    createCountDown()
  })
}
const doingHandle = () => {
  getWpsData()
}
const getWpsData = () => {
  wps.id = wifi.id
  loading.value = true
  getWps({
    id: wps.id,
  }).then(({ data }) => {
    loading.value = false
    switch (data.status) {
      case WpsStatus.idle:
        wps.status = WpsStatus.idle
        break
      case WpsStatus.inProgress:
        wps.status = WpsStatus.inProgress
        break
      case WpsStatus.configured:
        wps.status = WpsStatus.configured
        break
      default:
        wps.status = WpsStatus.unknown
        break
    }
    if (wps.status === WpsStatus.inProgress) {
      createCountDown()
    }
    if (wps.status === WpsStatus.idle || wps.status === WpsStatus.configured) {
      cleanCountDown()
    }
  })
}
const { createCountDown, cleanCountDown } = useCountDown(timeout, interval, doingHandle)
const getWifiData = (id?: string) => {
  Promise.all([getWifi2g(), getWifi2gAdv()]).then(([res1, res2]) => {
    const items = res1.data.items
    if (items.length === 0) {
      return
    }
    wifiEnable.value = convertBooleanStatus(res2.data.enable)
    const ssidOptsList = []
    items.forEach((item) => {
      if (appStore.isSuper || (appStore.isAdmin && item.id !== Ssid4)) {
        ssidOptsList.push({
          value: item.id,
          text: SsidText[item.id],
        })
      }
    })
    ssidList.splice(0, ssidList.length, ...items)
    ssidOpts.splice(0, ssidOpts.length, ...ssidOptsList)
    wifi.id = id ? id : items[0].id
    changeSsid()
  })
}
const changeSsid = () => {
  wifiFormRef.value?.clearValidate()
  const thisSsid = ssidList.find((item) => item.id === wifi.id)
  if (!thisSsid) return
  wifi.ssid = thisSsid.name
  wifi.sta = thisSsid.max_sta
  wifi.enableInitial = wifi.enable = convertBooleanStatus(thisSsid.enable)
  wifi.hide = convertBooleanStatus(thisSsid.enable_hide)
  wifi.encrypt = thisSsid.auth_mode
  wifi.password = thisSsid.pre_shared_key
  wifi.enableWpsInitial = wifi.enableWps = convertBooleanStatus(thisSsid.enable_wps)
  if (isEnableWps.value) {
    getWpsData()
  }
}
const save = () => {
  if (wifiFormRef.value?.validate()) {
    const data = {
      id: wifi.id,
      name: wifi.ssid,
      max_sta: wifi.sta,
      enable: convertBooleanStatus(wifi.enable),
      enable_hide: convertBooleanStatus(wifi.hide),
      auth_mode: wifi.encrypt,
      pre_shared_key: wifi.password,
      enable_wps: convertBooleanStatus(wifi.enableWps),
    }
    setWifi2g(data).then(() => {
      successTips()
      getWifiData(wifi.id)
    })
  }
}
const getMeshData = () => {
  getMesh().then(({ data }) => {
    enableMesh.value = convertBooleanStatus(data.enable) as boolean
    enableSteering.value = convertBooleanStatus(data.steering) as boolean
  })
}
const getWifiMloData = () => {
  getWifiMlo().then(({ data }) => {
    enableMlo.value = convertBooleanStatus(data.enable) as boolean
  })
}
onMounted(() => {
  getWifiData()
  getMeshData()
  getWifiMloData()
})
</script>
