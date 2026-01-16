<template>
  <div class="page wan-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0014') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form form--small wan-form"
        ref="wanRef"
        :model="wan"
        :rules="wanRules"
        :disabled="appStore.isAdmin"
      >
        <fh-form-item :label="t('trans0140')">
          <div
            style="display: flex; align-items: center"
            :style="isMobile ? { width: '100%' } : {}"
          >
            <fh-select
              :style="{
                width: isMobile && appStore.isAdmin ? '100%' : '300px',
                marginRight: appStore.isSuper ? '4px' : '0px',
              }"
              v-model="wan.id"
              :before-change="beforeChangeWan"
              :options="wanOpts"
              :not-disabled="true"
              @change="changeWan"
            ></fh-select>
            <fh-icon
              class="page__header-icon"
              @click="delWanConn"
              name="icon-delete"
              :title="$t('trans0759')"
              v-if="isEdit && appStore.isSuper"
            />
          </div>
        </fh-form-item>
        <fh-form-item :label="t('trans0761')">
          <fh-switch v-model="wan.enable" />
        </fh-form-item>
        <fh-form-item :label="t('trans0762')">
          <fh-select
            @change="changeWanMode"
            v-model="wan.wanMode"
            :options="wanModeOptions"
          ></fh-select>
        </fh-form-item>
        <fh-form-item :label="t('trans0763')" prop="serviceType">
          <fh-select v-model="wan.serviceType" :options="serviceTypeOptions"></fh-select>
        </fh-form-item>
        <template v-if="isRoute">
          <fh-form-item :label="t('trans0795')" v-if="isInternetWan">
            <fh-switch v-model="wan.forceDefroute" />
          </fh-form-item>
          <fh-form-item :label="t('trans0848')">
            <fh-select
              @change="changeLinkMode"
              v-model="wan.linkMode"
              :options="linkModeOptions"
            ></fh-select>
          </fh-form-item>
          <fh-form-item :label="t('trans0135')">
            <fh-radio-group
              @change="changeProtocol"
              v-model="wan.protocol"
              class="wan-form__protocol-checkbox-group"
            >
              <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
                {{ item.text }}
              </fh-radio>
            </fh-radio-group>
          </fh-form-item>
          <fh-form-item :label="t('trans0092')" prop="mtu" ref="mtuRef">
            <fh-input v-model="wan.mtu"></fh-input>
            <template #extra>{{ getMtuTips().tips }}</template>
          </fh-form-item>
        </template>
        <template v-if="isIptvWan">
          <fh-form-item :label="t('trans0777')" prop="multiVlanId">
            <fh-input v-model="wan.multiVlanId"></fh-input>
            <template #extra>{{ rangeTips(t('trans0777'), '1', '4094') }}</template>
          </fh-form-item>
          <template v-if="isBridge">
            <fh-form-item :label="statusText">
              <fh-switch v-model="wan.igmpEnable"></fh-switch>
            </fh-form-item>
          </template>
          <template v-if="isRoute">
            <fh-form-item :label="statusText">
              <fh-switch v-model="wan.igmpProxyEnable"></fh-switch>
            </fh-form-item>
            <fh-form-item :label="versionText" v-if="isIpv4">
              <fh-select v-model="wan.igmpVersion" :options="igmpVersionOptions"></fh-select>
            </fh-form-item>
          </template>
        </template>
        <fh-form-item :label="t('trans0771')">
          <fh-select v-model="wan.vlan.mode" :options="vlanModeOptions"></fh-select>
        </fh-form-item>
        <template v-if="isVlanModeTag">
          <fh-form-item :label="t('trans0775')" prop="vlan.id">
            <fh-input v-model="wan.vlan.id"></fh-input>
            <template #extra>{{ rangeTips(t('trans0775'), '1', '4094') }}</template>
          </fh-form-item>
          <fh-form-item :label="t('trans0776')">
            <fh-select v-model="wan.vlan.p8021" :options="p8021Options(7)"></fh-select>
          </fh-form-item>
        </template>
        <template v-if="isRoute && isPppoe">
          <fh-form-item :label="$t('trans0086')" prop="ppp.user">
            <fh-input v-model="wan.ppp.user"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0087')" prop="ppp.pwd">
            <fh-input type="password" v-model="wan.ppp.pwd" show-password> </fh-input>
          </fh-form-item>
          <!-- 暂时不支持 by ytp 20250623 -->
          <!-- <fh-form-item :label="t('trans0790')">
            <fh-switch v-model="wan.ppp.enableRouterBridge" />
          </fh-form-item> -->
        </template>
        <template v-if="isHidePortBinding">
          <fh-form-item :label="t('trans0755')">
            <fh-checkbox-group class="wan-form__checkbox-group" v-model="wan.lan">
              <template v-for="item in lanOptions">
                <fh-checkbox
                  :key="item.value"
                  :label="item.value"
                  :disabled="item.readonly"
                  v-if="item.show"
                >
                  {{ SsidText[item.value] }}
                </fh-checkbox>
              </template>
            </fh-checkbox-group>
          </fh-form-item>
        </template>
        <template v-if="isRoute">
          <template v-if="isIpv4">
            <div class="page__sub-header">
              <h2 class="page__title">{{ $t('trans0593').format($t('trans0456')) }}</h2>
            </div>
            <fh-form-item :label="t('trans0080')" prop="ipv4.netType">
              <template v-if="isLinkModePPP">
                {{ pppoeText }}
              </template>
              <fh-select
                v-model="wan.ipv4.netType"
                :options="ipv4NetTypesOptions"
                v-else
              ></fh-select>
            </fh-form-item>
            <template v-if="isIpv4Static">
              <fh-form-item
                :label="format($t('trans0598'), [$t('trans0456')])"
                prop="ipv4.static.ip"
                ref="ipRef"
              >
                <fh-input v-model="wan.ipv4.static.ip" @blur="ipChange"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0459')" prop="ipv4.static.mask" ref="maskRef">
                <fh-input v-model="wan.ipv4.static.mask" @blur="maskChange"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0548')" prop="ipv4.static.gateway" ref="gatewayRef">
                <fh-input v-model="wan.ipv4.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')" prop="ipv4.static.dns1">
                <fh-input v-model="wan.ipv4.static.dns1" @change="changeDns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')" prop="ipv4.static.dns2" ref="dns2Ref">
                <fh-input v-model="wan.ipv4.static.dns2"></fh-input>
              </fh-form-item>
            </template>
            <fh-form-item :label="t('trans0778')" v-if="isHideEnableNat">
              <fh-switch v-model="wan.ipv4.enableNat" />
            </fh-form-item>
          </template>
          <template v-if="isIpv6">
            <div class="page__sub-header">
              <h2 class="page__title">{{ $t('trans0593').format($t('trans0457')) }}</h2>
            </div>
            <template v-if="isInternetWan">
              <fh-form-item :label="t('trans0782')">
                <fh-switch v-model="wan.ipv6.pd.enable" />
              </fh-form-item>
              <template v-if="isIpv6PdEnable">
                <fh-form-item :label="t('trans0783')">
                  <fh-radio-group v-model="wan.ipv6.pd.mode">
                    <fh-radio
                      v-for="item in prefixModeOptions"
                      :key="item.value"
                      :label="item.value"
                    >
                      {{ item.text }}
                    </fh-radio>
                  </fh-radio-group>
                </fh-form-item>
                <template v-if="isIpv6PdModeManually">
                  <fh-form-item :label="$t('trans0784')" prop="ipv6.pd.address">
                    <fh-input
                      v-model="wan.ipv6.pd.address"
                      :placeholder="`${format($t('trans0598'), [$t('trans0457')])}/${$t('trans0477')}`"
                    ></fh-input>
                  </fh-form-item>
                </template>
              </template>
            </template>
            <fh-form-item :label="t('trans0597')" prop="ipv6.netType">
              <fh-select v-model="wan.ipv6.netType" :options="ipv6NetTypesOptions"></fh-select>
            </fh-form-item>
            <template v-if="isIpv6Static">
              <fh-form-item
                :label="format($t('trans0598'), [$t('trans0457')])"
                prop="ipv6.static.ip"
              >
                <fh-input
                  :placeholder="`${format($t('trans0598'), [$t('trans0457')])}/${$t('trans0477')}`"
                  v-model="wan.ipv6.static.ip"
                ></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0599')" prop="ipv6.static.gateway">
                <fh-input v-model="wan.ipv6.static.gateway"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0496')" prop="ipv6.static.dns1">
                <fh-input v-model="wan.ipv6.static.dns1" @change="changeIpv6Dns1"></fh-input>
              </fh-form-item>
              <fh-form-item :label="$t('trans0497')" prop="ipv6.static.dns2" ref="ipv6Dns2Ref">
                <fh-input v-model="wan.ipv6.static.dns2"></fh-input>
              </fh-form-item>
            </template>
          </template>
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
import { ref, computed, reactive, onMounted, watch, inject, useTemplateRef } from 'vue'
import cloneDeep from 'lodash-es/cloneDeep'
import { useI18n } from 'vue-i18n'
import { useIsMobile } from '@/hooks/is-mobile'
import {
  IP,
  VlanMode,
  ModalType,
  WanMode,
  SsidText,
  ServiceType,
  Lan1,
  Lan2,
  Lan3,
  Lan4,
  Lan5,
  Ssid1,
  Ssid2,
  Ssid3,
  Ssid4,
  Ssidac1,
  Ssidac2,
  Ssidac3,
  Ssidac4,
  NetType,
  netTypeText,
} from '@/util/constant'
import {
  format,
  isIP,
  isMulticast,
  isLoopback,
  isValidDns,
  isValidMask,
  isValidNameEx,
  validationCharacterRange,
  isValidIpv6AddrExtra,
  isValidIpv6Dns,
  getIpBefore,
  isNetworkIP,
  isBoardcastIP,
  isValidGatewayIP,
  isValidLength,
  isValidSymbol,
  specialChar,
  isValidInteger,
  successTips,
  tranSimIpv6ToFullIpv6,
} from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { useAppStore } from '@/stores/modules/app-store'
import { getLan, getWan, addWan, editWan, deleteWan, getPortBindInfo } from '@/http/api'

defineOptions({
  name: 'WanPage',
})
enum PrefixMode {
  auto = 'auto',
  manually = 'manually',
}
enum IgmpVersion {
  v1 = '1',
  v2 = '2',
  v3 = '3',
}
enum LinkMode {
  ip = 'IP',
  ppp = 'PPP',
}
interface PortItem {
  value: string
  readonly: boolean
  show: boolean
}
const clubWifiVlanId = __APP_CUSTOMER_CONFIG__.clubWifiVlanId
const maxRuleNum = 8
const { convertBooleanStatus } = useDataClean()
const appStore = useAppStore()
const { isMobile } = useIsMobile()
const { t } = useI18n()
const dialog = inject('dialog')
const wanRef = useTemplateRef('wanRef')
const mtuRef = useTemplateRef('mtuRef')
const ipRef = useTemplateRef('ipRef')
const maskRef = useTemplateRef('maskRef')
const gatewayRef = useTemplateRef('gatewayRef')
const dns2Ref = useTemplateRef('dns2Ref')
const ipv6Dns2Ref = useTemplateRef('ipv6Dns2Ref')
const modalType = ref(ModalType.add)
const lanIp = ref('')

const lanOptions = ref<PortItem[]>([
  {
    value: Lan1,
    readonly: false,
    show: false,
  },
  {
    value: Lan2,
    readonly: false,
    show: false,
  },
  {
    value: Lan3,
    readonly: false,
    show: false,
  },
  {
    value: Lan4,
    readonly: false,
    show: false,
  },
  {
    value: Lan5,
    readonly: false,
    show: false,
  },
  {
    value: Ssid1,
    readonly: false,
    show: false,
  },
  {
    value: Ssid2,
    readonly: false,
    show: false,
  },
  {
    value: Ssid3,
    readonly: false,
    show: false,
  },
  {
    value: Ssid4,
    readonly: false,
    show: false,
  },
  {
    value: Ssidac1,
    readonly: false,
    show: false,
  },
  {
    value: Ssidac2,
    readonly: false,
    show: false,
  },
  {
    value: Ssidac3,
    readonly: false,
    show: false,
  },
  {
    value: Ssidac4,
    readonly: false,
    show: false,
  },
])
const ipOptions = [
  {
    value: IP.IPv4,
    text: t('trans0456'),
  },
  {
    value: IP.IPv6,
    text: t('trans0457'),
  },
  {
    value: IP.mix,
    text: t('trans0605'),
  },
]
const wanModeOptions = [
  {
    value: WanMode.route,
    text: t('trans0069'),
  },
  {
    value: WanMode.bridge,
    text: t('trans0083'),
  },
]
const ipv4NetTypesOptions = [
  {
    value: NetType.dhcp,
    text: netTypeText[NetType.dhcp],
  },
  {
    value: NetType.static,
    text: netTypeText[NetType.static],
  },
]
const ipv6NetTypesOptions = [
  {
    value: NetType.auto,
    text: netTypeText[NetType.auto],
  },
  {
    value: NetType.dhcpv6,
    text: netTypeText[NetType.dhcpv6],
  },
  {
    value: NetType.static,
    text: netTypeText[NetType.static],
  },
]
const vlanModeOptions = [
  {
    value: VlanMode.Tag,
    text: t('trans0772'),
  },
  {
    value: VlanMode.Untag,
    text: t('trans0773'),
  },
  // {
  //   value: VlanMode.Transparent,
  //   text: t('trans0774'),
  // },
]
const igmpVersionOptions = [
  {
    value: IgmpVersion.v1,
    text: 'V1',
  },
  {
    value: IgmpVersion.v2,
    text: 'V2',
  },
  {
    value: IgmpVersion.v3,
    text: 'V3',
  },
]
const prefixModeOptions = [
  {
    value: PrefixMode.auto,
    text: t('trans0487'),
  },
  {
    value: PrefixMode.manually,
    text: t('trans0486'),
  },
]
const serviceTypesInit = [
  {
    value: ServiceType.TR069,
    text: 'TR069',
    show: true,
  },
  {
    value: ServiceType.INTERNET,
    text: 'INTERNET',
    show: true,
  },
  {
    value: ServiceType.TR069_INTERNET,
    text: 'TR069_INTERNET',
    show: true,
  },
  {
    value: ServiceType.IPTV,
    text: 'IPTV',
    show: true,
  },
  {
    value: ServiceType.VOICE,
    text: 'VOICE',
    show: true,
  },
  // {
  //   value: ServiceType.VOICE_INTERNET,
  //   text: 'VOICE_INTERNET',
  //   show: true,
  // },
]
const linkModeOptions = [
  {
    value: LinkMode.ip,
    text: t('trans0889'),
  },
  {
    value: LinkMode.ppp,
    text: t('trans0865'),
  },
]
const MtuRange = {
  ipAndIpv4: ['576', '1500'],
  ipAndMix: ['1280', '1500'],
  pppAndIpv4: ['576', '1492'],
  pppAndMix: ['1280', '1492'],
}
const wanInitial = () => ({
  id: ModalType.add,
  enable: true,
  serviceType: ServiceType.INTERNET,
  forceDefroute: false,
  linkMode: LinkMode.ip,
  lan: [],
  vlan: {
    mode: VlanMode.Tag,
    id: '',
    p8021: '0',
  },
  protocol: IP.IPv4,
  multiVlanId: '',
  igmpEnable: false,
  igmpProxyEnable: true,
  igmpVersion: IgmpVersion.v2,
  mtu: MtuRange.ipAndIpv4[1],
  wanMode: WanMode.route,
  ppp: {
    user: '',
    pwd: '',
    enableRouterBridge: false,
  },
  ipv4: {
    netType: NetType.dhcp,
    enableNat: true,
    static: {
      ip: '',
      mask: '',
      gateway: '',
      dns1: '',
      dns2: '',
    },
  },
  ipv6: {
    netType: NetType.auto,
    pd: {
      enable: true,
      mode: PrefixMode.auto,
      address: '',
    },
    static: {
      ip: '',
      gateway: '',
      dns1: '',
      dns2: '',
    },
  },
})
const lastWanId = ref('')
const wan = reactive(wanInitial())
const wanOpts = reactive([])
const wanList = reactive([])

const isRoute = computed(() => wan.wanMode === WanMode.route)
const isBridge = computed(() => wan.wanMode === WanMode.bridge)
const isIpMix = computed(() => wan.protocol === IP.mix)
const isIpv4 = computed(() => wan.protocol === IP.IPv4 || isIpMix.value)
const isIpv6 = computed(() => wan.protocol === IP.IPv6 || isIpMix.value)
const isLinkModePPP = computed(() => wan.linkMode === LinkMode.ppp)
const isPppoe = computed(() => wan.ipv4.netType === NetType.pppoe)
const pppoeText = computed(() => (isPppoe.value ? t('trans0081') : ''))
const isVlanModeTag = computed(() => wan.vlan.mode === VlanMode.Tag)
const isIpv4Static = computed(() => wan.ipv4.netType === NetType.static)
const isIpv6Static = computed(() => wan.ipv6.netType === NetType.static)
const isIpv6PdEnable = computed(() => wan.ipv6.pd.enable)
const isIpv6PdModeManually = computed(() => wan.ipv6.pd.mode === PrefixMode.manually)
const isIptvWan = computed(() => wan.serviceType === ServiceType.IPTV)
const isNotPppoeAndIpv4 = computed(() => !isPppoe.value && wan.protocol === IP.IPv4)
const isNotPppoeAndIpv6 = computed(() => !isPppoe.value && isIpv6.value)
const isPppoeAndIpv4 = computed(() => isPppoe.value && wan.protocol === IP.IPv4)
const isPppoeAndIpv6 = computed(() => isPppoe.value && isIpv6.value)
const isHidePortBinding = computed(
  () => !(wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE),
)
const isHideEnableNat = computed(
  () =>
    !(
      wan.serviceType === ServiceType.TR069 ||
      wan.serviceType === ServiceType.VOICE ||
      wan.serviceType === ServiceType.IPTV
    ),
)
const isInternetWan = computed(
  () =>
    wan.serviceType === ServiceType.INTERNET ||
    wan.serviceType === ServiceType.TR069_INTERNET ||
    wan.serviceType === ServiceType.VOICE_INTERNET,
)
const serviceTypeOptions = computed(() => {
  if (isBridge.value) {
    serviceTypesInit.forEach((item) => {
      item.show = false
      if (item.value === ServiceType.INTERNET || item.value === ServiceType.IPTV) {
        item.show = true
      }
    })
  }
  if (isRoute.value) {
    serviceTypesInit.forEach((item) => {
      item.show = true
    })
  }
  return serviceTypesInit.filter((item) => item.show === true)
})
const isAdd = computed(() => {
  return modalType.value === ModalType.add
})
const isEdit = computed(() => {
  return modalType.value === ModalType.edit
})

const type = computed(() => {
  let text = ''
  if (isIpv4.value) {
    text = t('trans0375')
  }
  if (isIpv6.value) {
    text = t('trans0376')
  }
  if (isIpMix.value) {
    text = t('trans0377')
  }
  return text
})
const mode = computed(() => {
  let mode = ''
  if (isBridge.value) {
    mode = t('trans0387') // snopp
  }
  if (isRoute.value) {
    mode = t('trans0386') // proxy
  }
  return mode
})

const statusText = computed(() => {
  return `${type.value} ${mode.value}`
})
const versionText = computed(() => {
  // return `${type.value} ${mode.value} ${t('trans0379')}`
  return `${t('trans0375')} ${t('trans0379')}`
})

watch(
  () => wan.serviceType,
  () => {
    if (!isInternetWan.value) wan.ipv6.pd.enable = false
  },
  { flush: 'pre' },
)

const beforeChangeWan = () => {
  lastWanId.value = wan.id
}
const changeWanMode = () => {
  if (!serviceTypeOptions.value.find((item) => item.value === wan.serviceType)) {
    wan.serviceType = serviceTypeOptions.value[0].value
  }
  if (isRoute.value) {
    wan.protocol = IP.IPv4
  } else if (isBridge.value) {
    wan.protocol = IP.mix
  }
  wan.igmpEnable = wan.igmpProxyEnable = false
}
const changeLinkMode = () => {
  if (isLinkModePPP.value) {
    wan.ipv4.netType = NetType.pppoe
  } else {
    wan.ipv4.netType = NetType.dhcp
  }
  mtuRef.value?.clearValidate()
  initMtu()
}
const changeProtocol = () => {
  mtuRef.value?.clearValidate()
  initMtu()
}
const isGatewaySameWithIp = (gateway, ip) => !gateway || !ip || gateway !== ip
const isGatewaySameSegmentWithIp = (gateway, ip) =>
  !gateway || !ip || getIpBefore(gateway) === getIpBefore(ip)
const validateSameDns = (dns1, dns2) => !(dns1 && dns2 && dns1 === dns2)
const ipChange = () => {
  if (!ipRef.value?.validate()) {
    return
  }
  if (wan.ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const maskChange = () => {
  if (!maskRef.value?.validate()) {
    return
  }
  if (wan.ipv4.static.ip) {
    ipRef.value?.validate()
  }
  if (wan.ipv4.static.gateway) {
    gatewayRef.value?.validate()
  }
}
const changeDns1 = () => {
  dns2Ref.value?.extraValidate(
    () => validateSameDns(wan.ipv4.static.dns1, wan.ipv4.static.dns2),
    t('trans0637'),
  )
}
const changeIpv6Dns1 = () => {
  ipv6Dns2Ref.value?.extraValidate(
    () => validateSameDns(wan.ipv6.static.dns1, wan.ipv6.static.dns2),
    t('trans0637'),
  )
}
const getMtuTips = () => {
  if (isNotPppoeAndIpv4.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndIpv4[0], MtuRange.ipAndIpv4[1]),
    }
  }
  if (isNotPppoeAndIpv6.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
      rule: isValidInteger(wan.mtu, MtuRange.ipAndMix[0], MtuRange.ipAndMix[1]),
    }
  }
  if (isPppoeAndIpv4.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
      rule: isValidInteger(wan.mtu, MtuRange.pppAndIpv4[0], MtuRange.pppAndIpv4[1]),
    }
  }
  if (isPppoeAndIpv6.value) {
    return {
      tips: rangeTips(t('trans0092'), MtuRange.pppAndMix[0], MtuRange.pppAndMix[1]),
      rule: isValidInteger(wan.mtu, MtuRange.pppAndMix[0], MtuRange.pppAndMix[1]),
    }
  }
}
const p8021Options = (max: number) => {
  const arr = []
  for (let i = 0; i <= max; i++) {
    arr.push({ value: `${i}`, text: i })
  }
  return arr
}
const rangeTips = (text: string, min: string, max: string) => {
  return format(t('trans0373'), [text, min, max])
}
const getWanList = (loading: boolean = true, id?: string) => {
  getWan(loading).then(({ data }) => {
    const { items, total } = data
    const wanOptsList = []
    wanList.length = 0
    if (total < maxRuleNum && appStore.isSuper) {
      wanOptsList.push({
        value: ModalType.add,
        text: t('trans0760'),
      })
    }
    if (total) {
      items.forEach((item) => {
        if (
          appStore.isSuper ||
          (appStore.isAdmin && clubWifiVlanId && item.vlan.id && item.vlan.id !== clubWifiVlanId)
        ) {
          wanOptsList.push({
            value: item.id,
            text: item.wanName,
          })
        }
      })
    }
    wanOpts.splice(0, wanOpts.length, ...wanOptsList)
    wanList.splice(0, wanList.length, ...items)
    if (total === 0) {
      initWanForm()
      return
    }
    wan.id = id ? id : wanOptsList[wanOptsList.length - 1].value
    modalType.value = ModalType.edit
    initWan()
  })
}
const initWan = () => {
  wanRef.value.clearValidate()
  const thisWan = wanList.find((item) => item.id === wan.id)
  wan.enable = convertBooleanStatus(thisWan.enable)
  wan.serviceType = thisWan.serviceType
  wan.forceDefroute = convertBooleanStatus(thisWan.forceDefroute)
  wan.lan = thisWan.lan
  wan.vlan.mode = thisWan.vlan.mode
  wan.vlan.id = thisWan.vlan.id
  wan.vlan.p8021 = thisWan.vlan.p8021
  wan.protocol = thisWan.protocol
  wan.multiVlanId = thisWan.multiVlanId
  wan.igmpEnable = convertBooleanStatus(thisWan.igmpEnable)
  wan.igmpProxyEnable = convertBooleanStatus(thisWan.igmpProxyEnable)
  wan.igmpVersion = thisWan.igmpversion
  wan.linkMode = thisWan.linkMode
  wan.mtu = thisWan.mtu
  wan.ipv4.enableNat = convertBooleanStatus(thisWan.enableNat)
  wan.wanMode = thisWan.wanMode
  wan.ppp.user = thisWan.ppp.user
  wan.ppp.pwd = thisWan.ppp.pwd
  wan.ppp.enableRouterBridge = convertBooleanStatus(thisWan.ppp.enableRouterBridge)
  wan.ipv4.netType = thisWan.ipv4.netType
  wan.ipv4.static.ip = thisWan.ipv4.static.ip
  wan.ipv4.static.mask = thisWan.ipv4.static.mask
  wan.ipv4.static.gateway = thisWan.ipv4.static.gateway
  wan.ipv4.static.dns1 = thisWan.ipv4.static.dns1
  wan.ipv4.static.dns2 = thisWan.ipv4.static.dns2
  wan.ipv6.netType = thisWan.ipv6.netType
  wan.ipv6.pd.enable = convertBooleanStatus(thisWan.ipv6.pd.enable)
  wan.ipv6.pd.mode = thisWan.ipv6.pd.mode
  wan.ipv6.pd.address = thisWan.ipv6.pd.address
  wan.ipv6.static.ip = thisWan.ipv6.static.ip
  wan.ipv6.static.gateway = thisWan.ipv6.static.gateway
  wan.ipv6.static.dns1 = thisWan.ipv6.static.dns1
  wan.ipv6.static.dns2 = thisWan.ipv6.static.dns2
  getPortBind(wan.id)
}
const changeWan = () => {
  if (wan.id === ModalType.add) {
    initWanForm()
    return
  }
  if (lastWanId.value === ModalType.add && wan.id !== ModalType.add) {
    const wanCopy = cloneDeep(wan)
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0779').format(t('trans0140')),
      })
      .then(() => {
        modalType.value = ModalType.edit
        initWan()
      })
      .catch(() => {
        initWanForm(wanCopy)
        wan.id = ModalType.add
      })
    return
  }
  initWan()
}
const initWanForm = (wanInfo: any = '') => {
  modalType.value = ModalType.add
  Object.assign(wan, wanInfo ? wanInfo : wanInitial())
  wanRef.value.clearValidate()
  getPortBind()
}
const save = () => {
  if (wanRef.value.validate()) {
    if (wan.serviceType === ServiceType.TR069 || wan.serviceType === ServiceType.VOICE) {
      wan.lan = []
    }
    const newWan = {
      enable: convertBooleanStatus(wan.enable),
      serviceType: wan.serviceType,
      forceDefroute: convertBooleanStatus(wan.forceDefroute),
      lan: wan.lan,
      vlan: {
        mode: wan.vlan.mode,
        id: wan.vlan.id,
        p8021: wan.vlan.p8021,
      },
      protocol: wan.protocol,
      multiVlanId: wan.multiVlanId,
      igmpEnable: convertBooleanStatus(wan.igmpEnable),
      igmpProxyEnable: convertBooleanStatus(wan.igmpProxyEnable),
      igmpversion: wan.igmpVersion,
      linkMode: wan.linkMode,
      enableNat: convertBooleanStatus(wan.ipv4.enableNat),
      mtu: wan.mtu,
      wanMode: wan.wanMode,
      ppp: {
        user: wan.ppp.user,
        pwd: wan.ppp.pwd,
        enableRouterBridge: convertBooleanStatus(wan.ppp.enableRouterBridge),
      },
      ipv4: {
        netType: wan.ipv4.netType,
        static: {
          ip: wan.ipv4.static.ip,
          mask: wan.ipv4.static.mask,
          gateway: wan.ipv4.static.gateway,
          dns1: wan.ipv4.static.dns1,
          dns2: wan.ipv4.static.dns2,
        },
      },
      ipv6: {
        netType: wan.ipv6.netType,
        pd: {
          enable: convertBooleanStatus(wan.ipv6.pd.enable),
          mode: wan.ipv6.pd.mode,
          address: wan.ipv6.pd.address,
        },
        static: {
          ip: wan.ipv6.static.ip,
          gateway: wan.ipv6.static.gateway,
          dns1: wan.ipv6.static.dns1,
          dns2: wan.ipv6.static.dns2,
        },
      },
    }
    if (isAdd.value) {
      addWan(newWan).then(() => {
        successTips()
        getWanList(false)
      })
    }
    if (isEdit.value) {
      newWan.id = wan.id
      editWan(newWan).then(({ data }) => {
        successTips()
        const { id } = data
        getWanList(false, id)
      })
    }
  }
}
const delWanConn = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0409'),
    })
    .then(() => {
      deleteWan({ id: wan.id }).then(() => {
        successTips('trans0410')
        getWanList(false)
      })
    })
    .catch(() => {})
}
const initMtu = () => {
  if (isNotPppoeAndIpv4.value) {
    wan.mtu = MtuRange.ipAndIpv4[1]
  }
  if (isNotPppoeAndIpv6.value) {
    wan.mtu = MtuRange.ipAndMix[1]
  }
  if (isPppoeAndIpv4.value) {
    wan.mtu = MtuRange.pppAndIpv4[1]
  }
  if (isPppoeAndIpv6.value) {
    wan.mtu = MtuRange.pppAndMix[1]
  }
}
const getLanData = () => {
  getLan().then(({ data }) => {
    const { lan } = data
    const { ip } = lan
    lanIp.value = ip
  })
}
const getPortBind = (id = '') => {
  getPortBindInfo({ id }).then(({ data }) => {
    const { items } = data
    items.forEach((item: { id: string; readonly: '0' | '1' }) => {
      const portItem = lanOptions.value.find((lan) => lan.value === item.id)
      if (portItem) {
        portItem.readonly = convertBooleanStatus(item.readonly) as boolean
        portItem.show = true
      }
    })
  })
}
const wanRules = reactive({
  serviceType: [
    {
      rule: (value) => value,
      message: format(t('trans0677'), [t('trans0763')]),
    },
    {
      rule: (value) => {
        if (value === ServiceType.TR069 || value === ServiceType.TR069_INTERNET) {
          if (isAdd.value) {
            return !wanList.some(
              (item) =>
                item.serviceType === ServiceType.TR069 ||
                item.serviceType === ServiceType.TR069_INTERNET,
            )
          }
          if (isEdit.value) {
            return !wanList
              .filter((item) => item.id !== wan.id)
              .some(
                (item) =>
                  item.serviceType === ServiceType.TR069 ||
                  item.serviceType === ServiceType.TR069_INTERNET,
              )
          }
        }
        if (value === ServiceType.VOICE || value === ServiceType.VOICE_INTERNET) {
          if (isAdd.value) {
            return !wanList.some(
              (item) =>
                item.serviceType === ServiceType.VOICE ||
                item.serviceType === ServiceType.VOICE_INTERNET,
            )
          }
          if (isEdit.value) {
            return !wanList
              .filter((item) => item.id !== wan.id)
              .some(
                (item) =>
                  item.serviceType === ServiceType.VOICE ||
                  item.serviceType === ServiceType.VOICE_INTERNET,
              )
          }
        }
        // if (value === ServiceType.IPTV) {
        //   if (isAdd.value) {
        //     return !wanList.some((item) => item.serviceType === ServiceType.IPTV)
        //   }
        //   if (isEdit.value) {
        //     return !wanList
        //       .filter((item) => item.id !== wan.id)
        //       .some((item) => item.serviceType === ServiceType.IPTV)
        //   }
        // }
        return true
      },
      message: format(t('trans0678'), [t('trans0763')]),
    },
  ],
  'ipv4.netType': [
    {
      rule: (value) => value,
      message: format(t('trans0677'), [t('trans0080')]),
    },
  ],
  'ipv6.netType': [
    {
      rule: (value) => value,
      message: format(t('trans0677'), [t('trans0597')]),
    },
  ],
  'ipv4.static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isNetworkIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => !isBoardcastIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => isValidGatewayIP(value, wan.ipv4.static.mask),
      message: format(t('trans0566'), [t('trans0393')]),
    },
    {
      rule: (value) => {
        if (!lanIp.value) {
          return true
        }
        const lanIpBefore = getIpBefore(lanIp.value)
        const ipBefore = getIpBefore(value)
        if (ipBefore === lanIpBefore || lanIp.value === value) {
          return false
        }
        return true
      },
      message: t('trans0615'),
    },
  ],
  'ipv4.static.mask': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: format(t('trans0566'), [t('trans0459')]),
    },
    {
      rule: (value) => isValidMask(value),
      message: format(t('trans0566'), [t('trans0459')]),
    },
  ],
  'ipv4.static.gateway': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: format(t('trans0566'), [t('trans0548')]),
    },
    {
      rule: (value) => !isNetworkIP(value, wan.ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, wan.ipv4.static.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isGatewaySameSegmentWithIp(value, wan.ipv4.static.ip),
      message: t('trans0662'),
    },
    {
      rule: (value) => isGatewaySameWithIp(value, wan.ipv4.static.ip),
      message: t('trans0633'),
    },
  ],
  'ipv4.static.dns1': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: format(t('trans0566'), [t('trans0496')]),
    },
    {
      rule: (value) => isValidDns(value),
      message: format(t('trans0566'), [t('trans0496')]),
    },
  ],
  'ipv4.static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || isValidDns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(wan.ipv4.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'ppp.user': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidNameEx(value),
      message: format(t('trans0566'), [t('trans0086')]),
    },
    {
      rule: (value) => validationCharacterRange(value, 1, 64),
      message: format(t('trans0003'), [t('trans0086'), 1, 64]),
    },
  ],
  'ppp.pwd': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidLength(value, 1, 64),
      message: format(t('trans0003'), [t('trans0087'), 1, 64]),
    },
    {
      rule: (value) => isValidSymbol(value),
      message: format(t('trans0013'), [t('trans0087'), format(t('trans0042'), [specialChar])]),
    },
  ],
  'ipv6.static.ip': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => {
        const parts = value.split('/')
        if (parts.length === 2) {
          const ip = parts[0]
          let suffix = parts[1]
          if (!suffix) return false
          suffix = parseInt(suffix)
          if (isIP(ip, IP.IPv6) && isValidIpv6AddrExtra(ip) && suffix > 0 && suffix <= 128) {
            return true
          }
          return false
        }
        return isIP(value, IP.IPv6)
      },
      message: t('trans0397'),
    },
  ],
  'ipv6.static.gateway': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6Dns(value),
      message: t('trans0397'),
    },
  ],
  'ipv6.static.dns1': [
    {
      rule: (value) => value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidIpv6Dns(value),
      message: t('trans0397'),
    },
  ],
  'ipv6.static.dns2': [
    {
      rule: (value) => !value.trim().length || isIP(value, IP.IPv6),
      message: t('trans0397'),
    },
    {
      rule: (value) => !value.trim().length || isValidIpv6Dns(value),
      message: format(t('trans0566'), [t('trans0497')]),
    },
    {
      rule: (value) => !value.trim().length || validateSameDns(wan.ipv6.static.dns1, value),
      message: t('trans0637'),
    },
  ],
  'vlan.id': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 4094),
      message: format(t('trans0388'), [t('trans0775'), 1, 4094]),
    },
    {
      rule: (value) => {
        let tempData = []
        if (isAdd.value) {
          tempData = wanList
        }
        if (isEdit.value) {
          tempData = wanList.filter((item) => item.id !== wan.id)
        }
        return !tempData.some((item) => item.vlan.id === value || item.multiVlanId === value)
      },
      message: format(t('trans0678'), [t('trans0775')]),
    },
  ],
  multiVlanId: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => isValidInteger(value, 1, 4094),
      message: format(t('trans0388'), [t('trans0777'), 1, 4094]),
    },
    {
      rule: (value) => {
        let tempData = []
        if (isAdd.value) {
          tempData = wanList
        }
        if (isEdit.value) {
          tempData = wanList.filter((item) => item.id !== wan.id)
        }
        return !tempData.some((item) => item.vlan.id === value || item.multiVlanId === value)
      },
      message: format(t('trans0678'), [t('trans0777')]),
    },
  ],
  mtu: [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: () => getMtuTips().rule,
      message: format(t('trans0398'), [t('trans0092')]),
    },
  ],
  'ipv6.pd.address': [
    {
      rule: (value) => !!value.trim(),
      message: t('trans0004'),
    },
    {
      rule: (value) => {
        const parts = value.split('/')
        if (parts.length === 2) {
          const ip = parts[0]
          const fullIp = tranSimIpv6ToFullIpv6(ip)
          const prefix = parseInt(parts[1])
          if (
            isIP(ip, IP.IPv6) &&
            isValidIpv6AddrExtra(ip) &&
            (fullIp !== '2200:3366::1' ||
              fullIp !== '2200:3366::1/10' ||
              fullIp !== '2200:3366::1/65') &&
            prefix >= 16 &&
            prefix <= 64
          ) {
            return true
          }
        }
        return false
      },
      message: t('trans0397'),
    },
  ],
})
onMounted(() => {
  getLanData()
  getWanList()
})
</script>

<style lang="less">
.wan-page {
  .wan-form {
    .wan-form__checkbox-group {
      display: grid;
      grid-template-columns: 78px 78px 78px 78px;
      grid-template-rows: repeat(3, 15px);
      gap: 5px;
      .checkbox__label {
        padding-left: 5px;
      }
    }
    .wan-form__protocol-checkbox-group {
      display: grid;
      grid-template-columns: 48px 48px 48px;
      gap: 5px;
      .radio__label {
        padding-left: 5px;
      }
    }
  }
}
</style>
