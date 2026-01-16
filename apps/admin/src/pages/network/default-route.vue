<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0795') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form">
        <fh-form-item :label="$t('trans0456')">
          <fh-select v-model="form.ipv4" :options="ipv4WanOpts"> </fh-select>
        </fh-form-item>
        <fh-form-item :label="$t('trans0457')">
          <fh-select v-model="form.ipv6" :options="ipv6WanOpts"> </fh-select>
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
import { onMounted, reactive } from 'vue'
import { getWanInfo, getDefaultRoute, setDefaultRoute } from '@/http/api'
import { NetType } from '@/util/constant'

const ipv4WanOpts = reactive([])
const ipv6WanOpts = reactive([])

const form = reactive({
  ipv4: '',
  ipv6: '',
})

const save = () => {
  setDefaultRoute(form)
}
const getDefaultRouteData = () => {
  getDefaultRoute().then(({ data }) => {
    form.ipv4 = data.ipv4
    form.ipv6 = data.ipv6
  })
}

const getWanData = () => {
  getWanInfo().then(({ data }) => {
    const { items } = data
    const ipv4WanList: any[] = []
    const ipv6WanList: any[] = []
    items.forEach((item: any) => {
      if (item.protocol !== NetType.bridge) {
        if (item.ipv4.length) {
          ipv4WanList.push({
            value: item.interface,
            text: item.wanname,
          })
        }
        if (item.ipv6.length) {
          ipv6WanList.push({
            value: item.interface,
            text: item.wanname,
          })
        }
      }
    })
    ipv4WanOpts.splice(0, ipv4WanOpts.length, ...ipv4WanList)
    ipv6WanOpts.splice(0, ipv6WanOpts.length, ...ipv6WanList)
  })
}

onMounted(() => {
  getWanData()
  getDefaultRouteData()
})
</script>
