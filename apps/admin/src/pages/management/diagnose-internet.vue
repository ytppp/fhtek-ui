<template>
  <div class="page diagnose">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0553') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0554') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="pingRef"
        :model="pingForm"
        name="pingForm"
        method="post"
        :rules="pingRules"
        :disabled="pingFormDisabled"
      >
        <fh-form-item :label="$t('trans0135')">
          <fh-radio-group @change="changePingIpType" v-model="pingForm.type">
            <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
              {{ item.text }}
            </fh-radio>
          </fh-radio-group>
        </fh-form-item>
        <fh-form-item :label="$t('trans0140')">
          <fh-select
            name="interface"
            v-model="pingForm.interface"
            :options="pingWanOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item prop="repetitions" :label="$t('trans0555')">
          <fh-input name="repetitions" v-model="pingForm.repetitions"></fh-input>
          <template #extra>
            {{ repetitionsTips }}
          </template>
        </fh-form-item>
        <fh-form-item prop="destination" :label="$t('trans0556')" ref="pingDestinationRef">
          <fh-input name="destination" v-model="pingForm.destination"></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="ping" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-if="pingResult && !pingSuccessFlag">
          <fh-alert :title="pingResult" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <div class="diagnose__result" v-if="pingResult && pingSuccessFlag">
        <pre>{{ pingResult }}</pre>
      </div>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0560') }}</h2>
      </div>
      <fh-form
        class="form form--padding"
        ref="tracerouteRef"
        :model="tracerouteForm"
        name="tracerouteForm"
        :rules="tracerouteRules"
        :disabled="tracerouteFormDisabled"
      >
        <fh-form-item :label="$t('trans0135')">
          <fh-radio-group @change="changeTracerouteIpType" v-model="tracerouteForm.type">
            <fh-radio v-for="item in ipOptions" :key="item.value" :label="item.value">
              {{ item.text }}
            </fh-radio>
          </fh-radio-group>
        </fh-form-item>
        <fh-form-item :label="$t('trans0140')">
          <fh-select
            name="interface"
            v-model="tracerouteForm.interface"
            :options="tracerouteWanOpts"
          ></fh-select>
        </fh-form-item>
        <fh-form-item prop="destination" :label="$t('trans0556')" ref="tracerouteDestinationRef">
          <fh-input name="destination" v-model="tracerouteForm.destination"></fh-input>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="traceroute" block>
            {{ $t('trans0557') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item v-if="tracerouteResult && !tracerouteSuccessFlag">
          <fh-alert :title="tracerouteResult" type="error"> </fh-alert>
        </fh-form-item>
      </fh-form>
      <div class="diagnose__result" v-if="tracerouteResult && tracerouteSuccessFlag">
        <pre>{{ tracerouteResult }}</pre>
      </div>
      <template v-if="appStore.isSuper">
        <div class="page__sub-header">
          <h2 class="page__title">{{ $t('trans0915') }}</h2>
        </div>
        <fh-form
          class="form form--padding"
          :model="informUploadForm"
          name="informUploadForm"
          :disabled="informUploadFormDisabled"
        >
          <fh-form-item class="form__submit-btn">
            <fh-button @click="informUpload" block>
              {{ $t('trans0916') }}
            </fh-button>
          </fh-form-item>
          <fh-form-item :label="$t('trans0920')" v-if="informUploadForm.result">
            {{ informUploadResult }}
          </fh-form-item>
        </fh-form>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, useTemplateRef, ref, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { IP, NetType, WanStatus } from '@/util/constant'
import { isIP, isValidInteger, isValidDomain } from '@/util/tool'
import { useDataClean } from '@/hooks/data-clean'
import { useCountDown } from '@/hooks/countdown'
import { useAppStore } from '@/stores/modules/app-store'
import {
  startPing,
  pingStatus,
  getPingResults,
  startTraceroute,
  tracerouteStatus,
  getTracerouteResults,
  startInformUpload,
  informUploadStatus,
  getInformUploadResults,
  getWanInfo,
} from '@/http/api'

type OperateType = 'ping' | 'traceroute' | 'informUpload'

enum Order {
  start = '1',
  stop = '2',
}
enum Status {
  testing = '1',
  done = '2',
  idle = '3',
  fail = '4',
}

const { t } = useI18n()
const appStore = useAppStore()
const { defaultVal } = useDataClean()
const loading = inject('loading')
const timeout = 1000 * 60 * 2 // 2 minutes
const interval = 5000 // 5 second
const ipOptions = [
  {
    value: IP.IPv4,
    text: t('trans0456'),
  },
  {
    value: IP.IPv6,
    text: t('trans0457'),
  },
]
const FormDataRange = {
  repetitions: {
    min: 1,
    max: 10,
    default: '',
    unit: 'trans0563',
    label: 'trans0555',
  },
}
const ipv4Data = reactive([])
const ipv6Data = reactive([])

function checkDestination(type: string, value: string) {
  if (isValidDomain(value)) {
    return true
  }
  if (type === IP.IPv4) {
    return isIP(value)
  }
  if (type === IP.IPv6) {
    return isIP(value, IP.IPv6)
  }
  return false
}
function createDoingHandle(checkStatus: () => Promise<string>, cleanCountDown: () => void) {
  return () => {
    checkStatus().then((status) => {
      if (status === Status.done) {
        cleanCountDown()
      }
    })
  }
}
function createDoneHandle(key: OperateType, getResults: () => void) {
  return () => {
    sessionStorage.setItem(key, '0')
    loading.close()
    getResults()
  }
}

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    const thisIpv4Data = [
      {
        value: '',
        text: t('trans0487'),
      },
    ]
    const thisIpv6Data = [
      {
        value: '',
        text: t('trans0487'),
      },
    ]
    if (items.length === 0) {
      return
    }
    items.forEach((item) => {
      if (item.protocol !== NetType.bridge && item.status === WanStatus.UP) {
        if (
          item.ipv4.length > 0 ||
          item.protocol === NetType.dhcp ||
          item.protocol === NetType.pppoe
        ) {
          thisIpv4Data.push({
            value: item.device,
            text: item.wanname,
          })
        } else if (item.ipv6.length > 0 || item.protocol === NetType.dhcpv6) {
          thisIpv6Data.push({
            value: item.device,
            text: item.wanname,
          })
        }
      }
    })
    ipv4Data.splice(0, ipv4Data.length, ...thisIpv4Data)
    ipv6Data.splice(0, ipv6Data.length, ...thisIpv6Data)
  })
}

const pingResult = ref('')
const pingRef = useTemplateRef('pingRef')
const pingDestinationRef = useTemplateRef('pingDestinationRef')
const pingFormDisabled = ref(false)
const pingSuccessFlag = ref(false)
const pingForm = reactive({
  type: IP.IPv4,
  interface: '',
  repetitions: '',
  destination: '',
})
const pingRules = reactive({
  repetitions: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) =>
        isValidInteger(value, FormDataRange.repetitions.min, FormDataRange.repetitions.max),
      message: t('trans0388').format(
        `'${t(FormDataRange.repetitions.label)}'`,
        FormDataRange.repetitions.min,
        FormDataRange.repetitions.max,
      ),
    },
  ],
  destination: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => checkDestination(pingForm.type, value),
      message: t('trans0397'),
    },
  ],
})
const pingWanOpts = computed(() => {
  if (pingForm.type === IP.IPv4) {
    return ipv4Data
  } else {
    return ipv6Data
  }
})
const repetitionsTips = computed(() => {
  let tipsText = ''
  const unitText = FormDataRange.repetitions.unit ? t(FormDataRange.repetitions.unit) : defaultVal
  const defaultText = FormDataRange.repetitions.default || defaultVal
  if (FormDataRange.repetitions.min && FormDataRange.repetitions.max) {
    tipsText += `${t('trans0380')}: ${FormDataRange.repetitions.min} - ${FormDataRange.repetitions.max}`
  }
  if (FormDataRange.repetitions.default) {
    tipsText += `; ${t('trans0632')}: ${defaultText}`
  }
  if (FormDataRange.repetitions.unit) {
    tipsText += `; ${t('trans0498')}: ${unitText}`
  }
  return tipsText
})
let cleanPingCountDown: () => void
const checkPingStatus = () => pingStatus().then(({ data }) => data.status)
const doingPingHandle = createDoingHandle(checkPingStatus, () => cleanPingCountDown())
const donePingHandle = createDoneHandle('ping', () =>
  getPingResults()
    .then(({ data }) => {
      pingResult.value = data.result
      pingSuccessFlag.value = true
    })
    .catch(() => {
      pingResult.value = t('trans0558')
      pingSuccessFlag.value = false
    }),
)
const { createCountDown: createPingCountDown, cleanCountDown: _cleanPingCountDown } = useCountDown(
  timeout,
  interval,
  doingPingHandle,
  donePingHandle,
)
cleanPingCountDown = _cleanPingCountDown
const ping = () => {
  if (!pingRef.value.validate()) return
  startPing({
    type: pingForm.type,
    interface: pingForm.interface,
    order: Order.start,
    repetitions: pingForm.repetitions,
    destination: pingForm.destination,
  }).then(({ data }) => {
    const status = data.status
    if (status === Status.testing) {
      handlePing()
    }
  })
}
const handlePing = () => {
  loading.open({
    tip: t('trans0559'),
  })
  sessionStorage.setItem('ping', '1')
  createPingCountDown()
}
const changePingIpType = () => {
  pingForm.interface = ''
  if (pingForm.destination) {
    pingDestinationRef.value.validate()
  }
}

const tracerouteResult = ref('')
const tracerouteRef = useTemplateRef('tracerouteRef')
const tracerouteDestinationRef = useTemplateRef('tracerouteDestinationRef')
const tracerouteFormDisabled = ref(false)
const tracerouteSuccessFlag = ref(false)
const tracerouteForm = reactive({
  type: IP.IPv4,
  interface: '',
  destination: '',
})
const tracerouteRules = reactive({
  repetitions: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) =>
        isValidInteger(value, FormDataRange.repetitions.min, FormDataRange.repetitions.max),
      message: t('trans0388').format(
        `'${t(FormDataRange.repetitions.label)}'`,
        FormDataRange.repetitions.min,
        FormDataRange.repetitions.max,
      ),
    },
  ],
  destination: [
    {
      rule: (value) => value,
      message: t('trans0004'),
    },
    {
      rule: (value) => checkDestination(tracerouteForm.type, value),
      message: t('trans0397'),
    },
  ],
})
const tracerouteWanOpts = computed(() => {
  if (tracerouteForm.type === IP.IPv4) {
    return ipv4Data
  } else {
    return ipv6Data
  }
})
let cleanTracerouteCountDown: () => void
const checkTracerouteStatus = () => tracerouteStatus().then(({ data }) => data.status)
const doingTracerouteHandle = createDoingHandle(checkTracerouteStatus, () =>
  cleanTracerouteCountDown(),
)
const doneTracerouteHandle = createDoneHandle('traceroute', () =>
  getTracerouteResults()
    .then(({ data }) => {
      tracerouteResult.value = data.result
      tracerouteSuccessFlag.value = true
    })
    .catch(() => {
      tracerouteResult.value = t('trans0561')
      tracerouteSuccessFlag.value = false
    }),
)
const { createCountDown: createTracerouteCountDown, cleanCountDown: _cleanTracerouteCountDown } =
  useCountDown(timeout, interval, doingTracerouteHandle, doneTracerouteHandle)
cleanTracerouteCountDown = _cleanTracerouteCountDown
const traceroute = () => {
  if (!tracerouteRef.value.validate()) return
  startTraceroute({
    type: tracerouteForm.type,
    interface: tracerouteForm.interface,
    order: Order.start,
    destination: tracerouteForm.destination,
  }).then(({ data }) => {
    const status = data.status
    if (status === Status.testing) {
      handleTraceroute()
    }
  })
}
const handleTraceroute = () => {
  loading.open({
    tip: t('trans0562'),
  })
  sessionStorage.setItem('traceroute', '1')
  createTracerouteCountDown()
}
const changeTracerouteIpType = () => {
  tracerouteForm.interface = ''
  if (tracerouteForm.destination) {
    tracerouteDestinationRef.value.validate()
  }
}

const informUploadForm = ref({
  result: '',
})
const informUploadFormDisabled = ref(false)
const informUploadResult = computed(() => {
  const resultMap = {
    '1': t('trans0921'),
    '2': t('trans0944'),
    '3': t('trans0403'),
    '4': t('trans0945'),
    '5': t('trans0946'),
    '6': t('trans0911'),
  }
  return resultMap[informUploadForm.value.result]
})
let cleanInformUploadCountDown: () => void
const checkInformUploadStatus = () => informUploadStatus().then(({ data }) => data.status)
const doingInformUploadHandle = createDoingHandle(checkInformUploadStatus, () =>
  cleanInformUploadCountDown(),
)
const getInformUploadResultsData = () =>
  getInformUploadResults()
    .then(({ data }) => {
      informUploadForm.value.result = data.result
    })
    .catch(() => {
      informUploadForm.value.result = t('trans0563')
    })
const doneInformUploadHandle = createDoneHandle('informUpload', getInformUploadResultsData)
const {
  createCountDown: createInformUploadCountDown,
  cleanCountDown: _cleanInformUploadCountDown,
} = useCountDown(timeout, interval, doingInformUploadHandle, doneInformUploadHandle)
cleanInformUploadCountDown = _cleanInformUploadCountDown
const informUpload = () => {
  informUploadForm.value.result = ''
  startInformUpload({
    order: Order.start,
  }).then(({ data }) => {
    const status = data.status
    if (status === Status.testing) {
      handleInformUpload()
    }
    if (status === Status.done) {
      getInformUploadResultsData()
    }
    if (status === Status.fail) {
      informUploadForm.value.result = '6'
    }
  })
}
const handleInformUpload = () => {
  loading.open({
    tip: t('trans0921'),
  })
  sessionStorage.setItem('informUpload', '1')
  createInformUploadCountDown()
}

onMounted(() => {
  getWanData()
  if (sessionStorage.getItem('ping') === '1') {
    loading.open({
      tip: t('trans0559'),
    })
    checkPingStatus().then((status) => {
      if (status === Status.testing) {
        createPingCountDown()
      } else if (status === Status.done || status === Status.idle) {
        donePingHandle()
      }
    })
  }
  if (sessionStorage.getItem('traceroute') === '1') {
    loading.open({
      tip: t('trans0562'),
    })
    checkTracerouteStatus().then((status) => {
      if (status === Status.testing) {
        createTracerouteCountDown()
      } else if (status === Status.done || status === Status.idle) {
        doneTracerouteHandle()
      }
    })
  }
  if (sessionStorage.getItem('informUpload') === '1') {
    loading.open({
      tip: t('trans0921'),
    })
    checkInformUploadStatus().then((status) => {
      if (status === Status.testing) {
        createInformUploadCountDown()
      } else if (status === Status.done || status === Status.idle) {
        doneInformUploadHandle()
      }
    })
  }
})
</script>

<style lang="less">
.diagnose {
  .diagnose__result {
    margin-top: 20px;
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    padding: 10px;
    max-height: 600px;
    overflow-x: hidden;
    font-size: 14px;
    pre {
      font-family: 'Courier New', Courier, monospace;
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
