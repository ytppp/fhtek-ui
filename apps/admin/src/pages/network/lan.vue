<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0456') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="formRef" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0415')" prop="ip" ref="ipRef">
          <fh-input v-model="form.ip" @blur="changeIp" clearable> </fh-input>
          <template #extra>
            {{ $t('trans0644') }}
          </template>
        </fh-form-item>
        <fh-form-item :label="$t('trans0460')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item prop="ip_start" :label="$t('trans0151')" ref="ipStartRef">
            <fh-input v-model="form.ip_start" @blur="ipStartChange"></fh-input>
          </fh-form-item>
          <fh-form-item prop="ip_end" :label="$t('trans0152')" ref="ipEndRef">
            <fh-input v-model="form.ip_end"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0461')">
            <fh-select v-model="form.lease" :options="leases"></fh-select>
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
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import {
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
  successTips,
} from '@/util/tool'
import { getLan, setLan } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { loginPath } from '@/router'

defineOptions({
  name: 'LanPage',
})

const { convertBooleanStatus } = useDataClean()
const isSameSubNetwork = (ip, ip2, mask) => {
  const subnetwork = getSubNetwork(ip, mask)
  const subnetwork2 = getSubNetwork(ip2, mask)
  if (subnetwork !== subnetwork2) {
    return false
  }
  if (ip2int(ip) === ip2int(ip2)) {
    return false
  }
  return true
}

const { t } = useI18n()
const dialog = inject('dialog')
const loading = inject('loading')
enum Leases {
  oneHour = 60 * 60,
  oneDay = 24 * 60 * 60,
  oneWeek = 7 * 24 * 60 * 60,
}
interface ILease {
  value: Leases
  text: string
}
const leases: ILease[] = [
  {
    value: Leases.oneHour,
    text: t('trans0462', 1, { named: { val: 1 } }),
  },
  {
    value: Leases.oneDay,
    text: t('trans0463', 1, { named: { val: 1 } }),
  },
  {
    value: Leases.oneWeek,
    text: t('trans0464', 1, { named: { val: 1 } }),
  },
]
const ipRef = ref(null)
const ipStartRef = ref(null)
const ipEndRef = ref(null)
const formRef = ref(null)
const ipOrigin = ref('')
const wanIp = ref('')
const form = reactive({
  enable: true,
  ip: '',
  mask: '',
  ip_start: '',
  ip_end: '',
  lease: Leases.oneHour,
})
const rules = reactive({
  ip: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value) && !isMulticast(value) && !isLoopback(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isValidGatewayIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => {
        if (!wanIp.value) {
          return true
        }
        const wanIpBefore = getIpBefore(wanIp.value)
        const ipBefore = getIpBefore(value)
        if (ipBefore === wanIpBefore || wanIp.value === value) {
          return false
        }
        return true
      },
      message: t('trans0614'),
    },
  ],
  ip_start: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isSameSubNetwork(value, form.ip, form.mask),
      message: t('trans0397'),
    },
  ],
  ip_end: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => isIP(value),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isNetworkIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => !isBoardcastIP(value, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => isSameSubNetwork(value, form.ip, form.mask),
      message: t('trans0397'),
    },
    {
      rule: (value) => {
        if (form.ip_start) {
          return ip2int(form.ip_start) <= ip2int(value)
        }
        return true
      },
      message: t('trans0467'),
    },
  ],
})
const isIpChanged = computed(() => ipOrigin.value !== form.ip)

function getLanData() {
  getLan().then(({ data }) => {
    const { lan, dhcp } = data
    const { ip, mask } = lan
    const { enable, ip_start, ip_offset, lease } = dhcp
    Object.assign(form, {
      enable: convertBooleanStatus(enable),
      ip,
      mask,
      ip_start: `${getIpBefore(ip)}${ip_start}`,
      ip_end: `${getIpBefore(ip)}${Number(ip_start) + Number(ip_offset)}`,
      lease: Number(lease),
    })
    ipOrigin.value = form.ip
  })
}
const changeIp = () => {
  if (!ipRef.value.validate()) {
    return
  }
  dialog
    .info({
      okText: t('trans0019'),
      message: t('trans0645'),
    })
    .then(() => {
      const ipBefore = getIpBefore(form.ip)
      const ipAfter = getIpAfter(form.ip)
      // c type ip: 1-254
      const ipStartAfter = `${ipAfter == 1 ? 2 : 1}`
      form.ip_start = `${ipBefore}${ipStartAfter}`
      ipStartRef.value.validate()

      const ipEndAfter = `${ipAfter == 254 ? 253 : 254}`
      form.ip_end = `${ipBefore}${ipEndAfter}`
      ipEndRef.value.validate()
    })
}
const ipStartChange = () => {
  ipEndRef.value.extraValidate(() => {
    const start = form.ip_start
    const end = form.ip_end
    if (isIP(start)) {
      if (start && end) {
        return ip2int(end) >= ip2int(start)
      }
      return true
    }
    return true
  }, t('trans0467'))
}
const save = () => {
  if (formRef.value.validate()) {
    loading.open()
    setLan({
      lan: {
        ip: form.ip,
        mask: form.mask,
      },
      dhcp: {
        enable: convertBooleanStatus(form.enable),
        ip_start: getIpAfter(form.ip_start),
        ip_offset: `${Number(getIpAfter(form.ip_end)) - Number(getIpAfter(form.ip_start))}`,
        lease: `${form.lease}`,
      },
    })
      .then(() => {
        successTips()
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          loading.close()
          if (isIpChanged.value) {
            if (!import.meta.env.DEV) {
              sessionStorage.clear()
              window.location.href = `http://${form.ip}/index.html#${loginPath}`
            }
          }
        }, 5000)
      })
  }
}
onMounted(() => {
  getLanData()
})
</script>

<style lang="less"></style>
