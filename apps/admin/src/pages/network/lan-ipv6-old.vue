<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0457') }}</h1>
    </div>
    <div class="page__content">
      <template v-if="isMix">
        <div class="page__sub-header">
          <h2 class="page__title">{{ slaacTitleText }}</h2>
        </div>
        <fh-form
          class="form form--padding"
          ref="slaacFormRef"
          :model="slaacForm"
          :rules="slaacRules"
        >
          <fh-form-item :label="$t('trans0640')">
            <fh-switch v-model="slaacForm.enable" />
          </fh-form-item>
          <template v-if="slaacForm.enable">
            <fh-form-item :label="$t('trans0475')">
              <fh-radio-group v-model="slaacForm.mode">
                <fh-radio v-for="mode in slaacModes" :key="mode.value" :label="mode.value">
                  {{ mode.text }}
                </fh-radio>
              </fh-radio-group>
            </fh-form-item>
            <template v-if="isSlaacAuto">
              <fh-form-item prop="prefix" :label="$t('trans0485')">
                <fh-select v-model="slaacForm.prefix_source" :options="wanOpts"></fh-select>
              </fh-form-item>
            </template>
            <template v-if="isSlaacManually">
              <fh-form-item prop="manually_config.prefix" :label="$t('trans0476')">
                <fh-input v-model="slaacForm.manually_config.prefix"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.prefix_length" :label="$t('trans0477')">
                <fh-input v-model="slaacForm.manually_config.prefix_length"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.preferred_lifetime" :label="$t('trans0478')">
                <fh-input v-model="slaacForm.manually_config.preferred_lifetime"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.valid_lifetime" :label="$t('trans0479')">
                <fh-input v-model="slaacForm.manually_config.valid_lifetime"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.ra_interval.min" :label="$t('trans0480')">
                <fh-input v-model="slaacForm.manually_config.ra_interval.min"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.ra_interval.max" :label="$t('trans0481')">
                <fh-input v-model="slaacForm.manually_config.ra_interval.max"></fh-input>
              </fh-form-item>
            </template>
            <fh-form-item prop="mtu" :label="$t('trans0092')">
              <fh-input v-model="slaacForm.mtu"></fh-input>
            </fh-form-item>
            <fh-form-item :label="$t('trans0483')">
              <fh-switch v-model="slaacForm.managed_flag"></fh-switch>
            </fh-form-item>
            <fh-form-item :label="$t('trans0484')">
              <fh-switch v-model="slaacForm.other_flag"></fh-switch>
            </fh-form-item>
          </template>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="saveSlaac" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
        <div class="page__sub-header">
          <h2 class="page__title">{{ dhcpTitleText }}</h2>
        </div>
        <fh-form class="form form--padding" ref="dhcpFormRef" :model="dhcpForm" :rules="dhcpRules">
          <fh-form-item :label="$t('trans0640')">
            <fh-switch v-model="dhcpForm.enable" />
          </fh-form-item>
          <template v-if="dhcpForm.enable">
            <fh-form-item :label="$t('trans0475')">
              <fh-radio-group v-model="dhcpForm.mode">
                <fh-radio v-for="mode in dhcpModes" :key="mode.value" :label="mode.value">
                  {{ mode.text }}
                </fh-radio>
              </fh-radio-group>
            </fh-form-item>
            <template v-if="isDhcpAuto">
              <fh-form-item prop="prefix" :label="$t('trans0485')">
                <fh-select v-model="dhcpForm.prefix_source" :options="wanOpts"></fh-select>
              </fh-form-item>
            </template>
            <template v-if="isDhcpManually">
              <fh-form-item prop="prefix" :label="$t('trans0485')">
                <fh-select
                  v-model="dhcpForm.manually_config.address_format"
                  :options="addressFormatOpts"
                ></fh-select>
              </fh-form-item>
              <fh-form-item prop="manually_config.prefix" :label="$t('trans0476')">
                <fh-input v-model="dhcpForm.manually_config.prefix"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.prefix_length" :label="$t('trans0477')">
                <fh-input v-model="dhcpForm.manually_config.prefix_length"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.preferred_lifetime" :label="$t('trans0478')">
                <fh-input v-model="dhcpForm.manually_config.preferred_lifetime"></fh-input>
              </fh-form-item>
              <fh-form-item prop="manually_config.valid_lifetime" :label="$t('trans0479')">
                <fh-input v-model="dhcpForm.manually_config.valid_lifetime"></fh-input>
              </fh-form-item>
            </template>
          </template>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="saveDhcp" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
        <div class="page__sub-header">
          <h2 class="page__title">{{ dnsTitleText }}</h2>
        </div>
        <fh-form class="form form--padding" ref="dnsFormRef" :model="dnsForm" :rules="dnsRules">
          <fh-form-item prop="prefix" :label="$t('trans0485')">
            <fh-select v-model="dnsForm.mode" :options="dnsWanOpts"></fh-select>
          </fh-form-item>
          <template v-if="isDnsStatic">
            <fh-form-item prop="static_config.dns1" :label="$t('trans0496')">
              <fh-input v-model="dnsForm.static_config.dns1"></fh-input>
            </fh-form-item>
            <fh-form-item prop="static_config.dns2" :label="$t('trans0497')">
              <fh-input v-model="dnsForm.static_config.dns2"></fh-input>
            </fh-form-item>
          </template>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="saveDns" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0552') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  format,
  getIpBefore,
  getIpAfter,
  isIP,
  ip2int,
  isMulticast,
  isLoopback,
  isNetworkIP,
  isBoardcastIP,
  isValidGatewayIP,
  getSubNetwork,
} from '@/util/tool'
import { getIpv6Lan, setIpv6Lan } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'LanIpv6Page',
})

enum Mode {
  manually = 'manually',
  automatically = 'auto',
  HGWProxy = 'HGWProxy',
  static = 'static',
}
enum AddressFormat {
  addrPool = 'AddrPool',
  eui64 = 'EUI64',
}
const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const loading = inject('loading')
const slaacFormRef = ref(null)
const dhcpFormRef = ref(null)
const dnsFormRef = ref(null)
const slaacModes = [
  {
    value: Mode.automatically,
    text: t('trans0487'),
  },
  {
    value: Mode.manually,
    text: t('trans0486'),
  },
]
const dhcpModes = [
  {
    value: Mode.automatically,
    text: t('trans0487'),
  },
  {
    value: Mode.manually,
    text: t('trans0486'),
  },
]
const dnsWanOpts = reactive([
  {
    value: Mode.HGWProxy,
    text: t('trans0834'),
  },
  {
    value: Mode.static,
    text: t('trans0084'),
  },
  //  还学增加wan
])
const wanOpts = reactive([])
const addressFormatOpts = [
  {
    value: AddressFormat.addrPool,
    text: t('trans0491'),
  },
  {
    value: AddressFormat.eui64,
    text: t('trans0490'),
  },
]
const slaacForm = reactive({
  enable: true,
  mode: Mode.manually,
  prefix_source: '',
  mtu: '',
  managed_flag: false,
  other_flag: false,
  manually_config: {
    prefix: '',
    prefix_length: '',
    preferred_lifetime: '',
    valid_lifetime: '',
    ra_interval: {
      min: '',
      max: '',
    },
  },
})
const dhcpForm = reactive({
  enable: true,
  mode: Mode.manually,
  prefix_source: '',
  manually_config: {
    address_format: '',
    prefix: '',
    prefix_length: '',
    preferred_lifetime: '',
    valid_lifetime: '',
  },
})
const dnsForm = reactive({
  mode: Mode.HGWProxy,
  static_config: {
    dns1: '',
    dns2: '',
  },
})
const slaacRules = reactive({})
const dhcpRules = reactive({})
const dnsRules = reactive({})
const isMix = computed(() => {
  return true
})
const slaacTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0471')])
})
const dhcpTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0408')])
})
const dnsTitleText = computed(() => {
  return format(t('trans0469'), [t('trans0473')])
})
const isSlaacManually = computed(() => {
  return slaacForm.mode === Mode.manually
})
const isSlaacAuto = computed(() => {
  return slaacForm.mode === Mode.automatically
})
const isDhcpAuto = computed(() => {
  return dhcpForm.mode === Mode.automatically
})
const isDhcpManually = computed(() => {
  return dhcpForm.mode === Mode.manually
})
const isDnsStatic = computed(() => {
  return dnsForm.mode === Mode.static
})

const saveSlaac = () => {}
const saveDhcp = () => {}
const saveDns = () => {}
onMounted(() => {})
</script>
