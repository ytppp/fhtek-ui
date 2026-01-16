<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0457') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form">
        <fh-form-item :label="$t('trans0457')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <fh-form-item :label="$t('trans0485')">
          <fh-select v-model="form.pd_if" :options="wanList"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0489')">
          <fh-select v-model="form.mode" :options="modes"> </fh-select>
        </fh-form-item>
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
import { ref, reactive, onMounted, inject } from 'vue'
import { NetType, netTypeText } from '@/util/constant'
import { getIpv6Lan, setIpv6Lan, getWanInfo } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { useI18n } from 'vue-i18n'
import { successTips } from '@/util/tool'

defineOptions({
  name: 'LanIpv6Page',
})

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const loading = inject('loading')
const modes = [
  {
    value: NetType.hybrid,
    text: 'SLAAC+Statefull DHCPv6',
  },
  {
    value: 'lessdhcpv6',
    text: 'SLAAC+Stateless DHCPv6',
  },
  {
    value: NetType.slaac,
    text: 'SLAAC',
  },
  {
    value: NetType.dhcpv6,
    text: 'Statefull DHCPv6',
  },
  {
    value: NetType.none,
    text: netTypeText[NetType.none],
  },
]
const formRef = ref(null)
const form = reactive({
  enable: true,
  mode: '',
  pd_if: '',
})
const wanList = reactive([])

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    if (items.length === 0) {
      return
    }
    const thisWanList = [
      {
        value: '',
        text: t('trans0487'),
      },
    ]
    items.forEach((item) => {
      if (
        item.protocol !== NetType.bridge &&
        item.ipv6.length &&
        item.interface.startsWith('inet6')
      ) {
        thisWanList.push({
          value: item.interface,
          text: item.wanname,
        })
      }
    })
    wanList.splice(0, wanList.length, ...thisWanList)
  })
}
function getIpv6LanData() {
  getIpv6Lan().then(({ data }) => {
    form.enable = convertBooleanStatus(data.enabled)
    form.mode = data.address_mode
    form.pd_if = data.pd_if
  })
}
const save = () => {
  if (formRef.value.validate()) {
    loading.open()
    setIpv6Lan({
      enabled: convertBooleanStatus(form.enable),
      address_mode: form.mode,
      pd_if: form.pd_if,
    })
      .then(() => {
        successTips()
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          loading.close()
        }, 5000)
      })
  }
}
onMounted(() => {
  getWanData()
  getIpv6LanData()
})
</script>
