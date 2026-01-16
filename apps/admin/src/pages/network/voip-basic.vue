<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0546') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form form--small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="260px"
        :disabled="formDisabled"
        v-if="hasVoipWan"
      >
        <!-- <fh-form-item :label="$t('trans0135')" prop="register.protocol">
          <fh-select v-model="form.protocol" :options="voipProtocolOpts"></fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0140')">
          <fh-select v-model="form.interface" :options="voiceWanOpts"> </fh-select>
        </fh-form-item> -->
        <fh-form-item :label="$t('trans0733')" prop="register.server">
          <fh-input v-model="form.register.server"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0734')" prop="register.port">
          <fh-input v-model="form.register.port" :placeholder="numPlaceholder"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0735')" prop="register.secServer">
          <fh-input v-model="form.register.secServer"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0736')" prop="register.secPort">
          <fh-input v-model="form.register.secPort" :placeholder="numPlaceholder"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0766')" prop="proxy.server">
          <fh-input v-model="form.proxy.server"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0767')" prop="proxy.port">
          <fh-input v-model="form.proxy.port" :placeholder="numPlaceholder"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0770')" prop="proxy.secServer">
          <fh-input v-model="form.proxy.secServer"> </fh-input>
        </fh-form-item>
        <fh-form-item :label="$t('trans0786')" prop="proxy.secPort">
          <fh-input v-model="form.proxy.secPort" :placeholder="numPlaceholder"> </fh-input>
        </fh-form-item>
        <!-- <fh-form-item :label="$t('trans0817')">
          <fh-switch v-model="form.outboundProxy.enable"></fh-switch>
        </fh-form-item> -->
        <template v-if="form.outboundProxy.enable">
          <fh-form-item :label="$t('trans0831')" prop="outboundProxy.proxy">
            <fh-input v-model="form.outboundProxy.proxy"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0836')" prop="outboundProxy.port">
            <fh-input v-model="form.outboundProxy.port" :placeholder="numPlaceholder"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0837')" prop="outboundProxy.secProxy">
            <fh-input v-model="form.outboundProxy.secProxy"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0838')" prop="outboundProxy.secPort">
            <fh-input v-model="form.outboundProxy.secPort" :placeholder="numPlaceholder">
            </fh-input>
          </fh-form-item>
        </template>
        <template v-if="form.line1.active">
          <div class="page__sub-header">
            <h2 class="page__title">{{ $t('trans0926').format(1) }}</h2>
          </div>
          <fh-form-item :label="$t('trans0839')">
            <fh-switch v-model="form.line1.enablePortSetting"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0739')">
            {{ form.line1.registrationStatus }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0840')" prop="line1.account">
            <fh-input v-model="form.line1.account"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0841')" prop="line1.password">
            <fh-input v-model="form.line1.password" type="password" show-password> </fh-input>
          </fh-form-item>
        </template>
        <template v-if="form.line2.active">
          <div class="page__sub-header">
            <h2 class="page__title">{{ $t('trans0926').format(2) }}</h2>
          </div>
          <fh-form-item :label="$t('trans0839')">
            <fh-switch v-model="form.line2.enablePortSetting"></fh-switch>
          </fh-form-item>
          <fh-form-item :label="$t('trans0739')">
            {{ form.line2.registrationStatus }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0840')" prop="line2.account">
            <fh-input v-model="form.line2.account"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0841')" prop="line2.password">
            <fh-input v-model="form.line2.password" type="password" show-password> </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-if="formDisabled">
          <fh-alert type="info" :title="$t('trans0904')" show-icon :center="false" />
        </fh-form-item>
      </fh-form>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0604') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { isValidInteger, isValidSymbol, specialChar, successTips } from '@/util/tool'
import { ServiceType, VoipConnetStatus } from '@/util/constant'
import { getWan, getVoipBasicSettings, setVoipBasicSettings } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

defineOptions({
  name: 'VoipBasicPage',
})

enum VoipProtocol {
  SIP = '0',
}
const { convertBooleanStatus, defaultVal } = useDataClean()
const { t } = useI18n()
const formRef = ref(null)
const hasVoipWan = ref(false)
const voipProtocolOpts = [
  {
    value: VoipProtocol.SIP,
    text: t('trans0923'),
  },
]
const voiceWanOpts = reactive([])
const form = reactive({
  protocol: VoipProtocol.SIP,
  interface: '', // VOICE wan id
  register: {
    server: '',
    port: '',
    secServer: '',
    secPort: '',
  },
  proxy: {
    server: '',
    port: '',
    secServer: '',
    secPort: '',
  },
  outboundProxy: {
    enable: true, // false不可见下面参数
    proxy: '',
    port: '',
    secProxy: '',
    secPort: '',
  },
  line1: {
    enablePortSetting: false,
    registrationStatus: '',
    account: '',
    password: '',
    active: false,
    connetStatus: '',
  },
  line2: {
    enablePortSetting: false,
    registrationStatus: '',
    account: '',
    password: '',
    active: false,
    connetStatus: '',
  },
})
const numPlaceholder = '0-65535'
const rules = reactive({
  // protocol: [
  //   {
  //     rule: (value) => value,
  //     message: t('trans0677').format(t('trans0135')),
  //   },
  // ],
  'register.server': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0733'), t('trans0042').format(specialChar)),
    },
  ],
  'register.port': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'register.secServer': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0735'), t('trans0042').format(specialChar)),
    },
  ],
  'register.secPort': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'proxy.server': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0766'), t('trans0042').format(specialChar)),
    },
  ],
  'proxy.port': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'proxy.secServer': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0770'), t('trans0042').format(specialChar)),
    },
  ],
  'proxy.secPort': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'outboundProxy.proxy': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0831'), t('trans0042').format(specialChar)),
    },
  ],
  'outboundProxy.port': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'outboundProxy.secProxy': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0837'), t('trans0042').format(specialChar)),
    },
  ],
  'outboundProxy.secPort': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidInteger(value, 0, 65535)
      },
      message: t('trans0567').format(0, 65535),
    },
  ],
  'line1.account': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0840'), t('trans0042').format(specialChar)),
    },
  ],
  'line1.password': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0841'), t('trans0042').format(specialChar)),
    },
  ],
  'line2.account': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0840'), t('trans0042').format(specialChar)),
    },
  ],
  'line2.password': [
    {
      rule: (value) => {
        if (!value.length) return true
        return isValidSymbol(value)
      },
      message: t('trans0013').format(t('trans0841'), t('trans0042').format(specialChar)),
    },
  ],
})
const formDisabled = computed(() => {
  return (
    form.line1.connetStatus !== VoipConnetStatus.idle ||
    form.line2.connetStatus !== VoipConnetStatus.idle
  )
})
const save = () => {
  if (!formRef.value.validate()) return
  const data = {
    protocol: form.protocol,
    interface: form.interface,
    register: {
      server: form.register.server,
      port: form.register.port,
      secServer: form.register.secServer,
      secPort: form.register.secPort,
    },
    proxy: {
      server: form.proxy.server,
      port: form.proxy.port,
      secServer: form.proxy.secServer,
      secPort: form.proxy.secPort,
    },
    outboundProxy: {
      enable: convertBooleanStatus(form.outboundProxy.enable),
      proxy: form.outboundProxy.proxy,
      port: form.outboundProxy.port,
      secProxy: form.outboundProxy.secProxy,
      secPort: form.outboundProxy.secPort,
    },
    line1: {
      enablePortSetting: convertBooleanStatus(form.line1.enablePortSetting),
      account: form.line1.account,
      password: form.line1.password,
    },
    line2: {
      enablePortSetting: convertBooleanStatus(form.line2.enablePortSetting),
      account: form.line2.account,
      password: form.line2.password,
    },
  }
  setVoipBasicSettings(data).then(() => {
    successTips()
  })
}
const getVoipBasicSettingsData = () => {
  getVoipBasicSettings().then(({ data }) => {
    form.protocol = data.protocol
    form.interface = data.interface
    form.register.server = data.register.server
    form.register.port = data.register.port
    form.register.secServer = data.register.secServer
    form.register.secPort = data.register.secPort
    form.proxy.server = data.proxy.server
    form.proxy.port = data.proxy.port
    form.proxy.secServer = data.proxy.secServer
    form.proxy.secPort = data.proxy.secPort
    form.outboundProxy.enable = convertBooleanStatus(data.outboundProxy.enable) as boolean
    form.outboundProxy.proxy = data.outboundProxy.proxy
    form.outboundProxy.port = data.outboundProxy.port
    form.outboundProxy.secProxy = data.outboundProxy.secProxy
    form.outboundProxy.secPort = data.outboundProxy.secPort
    form.line1.enablePortSetting = convertBooleanStatus(data.line1.enablePortSetting) as boolean
    form.line1.registrationStatus = data.line1.registrationStatus || defaultVal
    form.line1.account = data.line1.account
    form.line1.password = data.line1.password
    form.line1.active = convertBooleanStatus(data.line1.active) as boolean
    form.line1.connetStatus = data.line1.connetStatus
    form.line2.enablePortSetting = convertBooleanStatus(data.line2.enablePortSetting) as boolean
    form.line2.registrationStatus = data.line2.registrationStatus || defaultVal
    form.line2.account = data.line2.account
    form.line2.password = data.line2.password
    form.line2.active = convertBooleanStatus(data.line2.active) as boolean
    form.line2.connetStatus = data.line2.connetStatus
  })
}
const getWanInfo = () => {
  getWan().then(({ data }) => {
    const { items } = data
    const voiceWan = items.find((item) => {
      return (
        item.serviceType === ServiceType.VOICE || item.serviceType === ServiceType.VOICE_INTERNET
      )
    })
    hasVoipWan.value = !!voiceWan
    if (hasVoipWan.value) {
      const voiceWanList: any[] = [
        {
          value: voiceWan.id,
          text: voiceWan.wanName,
        },
      ]
      voiceWanOpts.splice(0, voiceWanOpts.length, ...voiceWanList)
      getVoipBasicSettingsData()
    }
  })
}
onMounted(() => {
  getWanInfo()
})
</script>

<style lang="less"></style>
