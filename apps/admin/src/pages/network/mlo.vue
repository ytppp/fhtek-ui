<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0954') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0953')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0712')" prop="ssid">
            <div
              style="display: flex; align-items: center"
              :style="isMobile ? { width: '100%' } : {}"
            >
              <fh-input style="width: 300px; margin-right: 4px" v-model="form.ssid"> </fh-input>
              <fh-icon
                class="page__header-icon"
                @click="triggerSync5g"
                name="icon-sync"
                :title="$t('trans0956')"
              />
            </div>
          </fh-form-item>
          <fh-form-item :label="$t('trans0031')">
            <fh-select v-model="form.encrypt" :options="encryptsOpts"> </fh-select>
            <template #extra>
              <fh-alert v-if="encryptTip" :title="encryptTip" type="info" show-icon />
            </template>
          </fh-form-item>
          <fh-form-item :label="$t('trans0030')" v-if="!isEncryptNone" prop="password">
            <fh-input
              v-model="form.password"
              type="password"
              minlength="8"
              maxlength="64"
              show-password
            >
            </fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item>
          <fh-alert type="info" :description="$t('trans0955')" show-icon :center="false" />
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getWifiMlo, setWifiMlo, getWifi5g } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { useIsMobile } from '@/hooks/is-mobile'
import { format, successTips, isValidLength, isValidSymbol, specialChar } from '@/util/tool'
import { Encrypts, encrypts, Ssidac1 } from '@/util/constant'

defineOptions({
  name: 'mloPage',
})

const { t } = useI18n()
const { isMobile } = useIsMobile()
const { convertBooleanStatus } = useDataClean()
const formRef = useTemplateRef('formRef')
const form = ref({
  enable: false,
  ssid: '',
  encrypt: Encrypts.none,
  password: '',
})
const rules = ref({
  ssid: [
    {
      rule: (value: string) => !!value.trim(),
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
      rule: (value: string) => !!value.trim(),
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
})

const encryptsOpts = computed(() => {
  const EncryptsList = [
    Encrypts.none,
    Encrypts.wpa2PskCcmp,
    Encrypts.wpa3SaeCcmp,
    Encrypts.wpaWpa2PskCcmp,
    Encrypts.wpaWpa2PskTkipCcmp,
    Encrypts.wpa2PskWpa3SaeCcmp,
  ]
  return encrypts.filter((item) => EncryptsList.includes(item.value))
})
const isEncryptNone = computed(() => {
  return form.value.encrypt === Encrypts.none
})
const encryptTip = computed(() => {
  if (isEncryptNone.value) {
    return t('trans0032')
  }
  return ''
})

const save = () => {
  if (!formRef.value?.validate()) {
    return
  }
  setWifiMlo({
    enable: convertBooleanStatus(form.value.enable),
    name: form.value.ssid,
    auth_mode: form.value.encrypt,
    pre_shared_key: form.value.password,
  }).then(() => {
    successTips()
  })
}

const getWifiMloData = () => {
  getWifiMlo().then(({ data }) => {
    form.value.enable = convertBooleanStatus(data.enable) as boolean
    form.value.ssid = data.name
    form.value.encrypt = data.auth_mode
    form.value.password = data.pre_shared_key
  })
}
const triggerSync5g = () => {
  getWifi5g().then(({ data }) => {
    const items = data.items
    if (items.length === 0) {
      return
    }
    const thisSsid = items.find((item: { id: string }) => item.id === Ssidac1)
    form.value.ssid = thisSsid.name
    form.value.encrypt = thisSsid.auth_mode
    form.value.password = thisSsid.pre_shared_key
  })
}

onMounted(() => {
  getWifiMloData()
})
</script>
