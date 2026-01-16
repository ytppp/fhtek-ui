<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0803') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form form--padding" :model="remote">
        <fh-form-item :label="$t('trans0140')">
          <fh-select v-model="remote.interface" :options="interfaceOpts"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0166')">
          {{ statusText }}
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="start" block v-if="isStop">
            {{ $t('trans0557') }}
          </fh-button>
          <fh-button @click="stop" block v-if="isStart">
            {{ $t('trans0804') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { reactive, ref, computed, onMounted } from 'vue'
import { getPortMirr, setPortMirr } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { StartAndStop } from '@/util/constant'
import { successTips } from '@/util/tool'

enum Interface {
  all = 'All',
  lan1 = 'LAN1',
  lan2 = 'LAN2',
  lan3 = 'LAN3',
  lan4 = 'LAN4',
}

const { defaultVal } = useDataClean()
const { t } = useI18n()
const loading = ref(false)
const interfaceOpts = [
  {
    value: Interface.all,
    text: t('trans0537'),
  },
  // {
  //   value: Interface.lan1,
  //   text: 'LAN1',
  // },
  // {
  //   value: Interface.lan2,
  //   text: 'LAN2',
  // },
  // {
  //   value: Interface.lan3,
  //   text: 'LAN3',
  // },
  // {
  //   value: Interface.lan4,
  //   text: 'LAN4',
  // },
]
const remote = reactive({
  interface: Interface.all,
  status: StartAndStop.stop,
})

const isStart = computed(() => remote.status === StartAndStop.start)
const isStop = computed(() => remote.status === StartAndStop.stop)
const statusText = computed(() => {
  if (loading.value) return defaultVal
  if (remote.status === StartAndStop.start) {
    return t('trans0900')
  }
  return t('trans0901')
})
const start = () => {
  save(StartAndStop.start)
}
const stop = () => {
  save(StartAndStop.stop)
}
const getPortMirrData = () => {
  loading.value = true
  getPortMirr({
    interface: remote.interface,
  }).then(({ data }) => {
    loading.value = false
    remote.status = data.status
  })
}

const save = (order) => {
  setPortMirr({
    interface: remote.interface,
    order,
  }).then(() => {
    successTips()
    getPortMirrData()
  })
}

onMounted(() => {
  getPortMirrData()
})
</script>
