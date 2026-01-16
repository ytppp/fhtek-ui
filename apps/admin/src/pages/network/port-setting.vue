<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0757') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form" v-if="isMobile">
        <fh-form-item :label="SsidText[`${lan}${i}` as SsidKeyType]" v-for="i in total" :key="i">
          <fh-select
            @change="(val: string) => changePort(val, `${lan}${i}`)"
            v-model="form[`${lan}${i}` as SsidKeyType]"
            :options="`${lan}${i}` === Lan5 ? modeListLan5 : modeList"
          >
          </fh-select>
        </fh-form-item>
      </fh-form>
      <fh-table
        :columns="columns"
        :data-source="tableData"
        :show-index="false"
        :show-row-checkbox="false"
        :border="true"
        :hover="false"
        v-else
      >
        <template #[`${lan}${i}`]="scope" v-for="i in total" :key="i">
          <fh-select
            @change="(val: string) => changePort(val, `${lan}${i}`)"
            v-model="scope.row[`${lan}${i}`]"
            :options="`${lan}${i}` === Lan5 ? modeListLan5 : modeList"
          ></fh-select>
        </template>
      </fh-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { lan, Lan5, SsidText, Mode, ModeText } from '@/util/constant'
import { getLanSpeed, setLanSpeed } from '@/http/api'
import { successTips } from '@/util/tool'
import { useIsMobile } from '@/hooks/is-mobile'

interface Column {
  key: string
  title: string
}

type SsidKeyType = keyof typeof SsidText
type PortType = Partial<Record<SsidKeyType, string>>

const { isMobile } = useIsMobile()
const total = ref(4)
const tableData = ref<PortType[]>([])
const form = ref<PortType>({})
const columns = ref<Column[]>([])
const modeList = [
  {
    text: ModeText[Mode.auto],
    value: Mode.auto,
  },
  {
    text: ModeText[Mode.h10],
    value: Mode.h10,
  },
  {
    text: ModeText[Mode.f10],
    value: Mode.f10,
  },
  {
    text: ModeText[Mode.h100],
    value: Mode.h100,
  },
  {
    text: ModeText[Mode.f100],
    value: Mode.f100,
  },
  {
    text: ModeText[Mode.f1000],
    value: Mode.f1000,
  },
]
const modeListLan5 = [
  {
    text: ModeText[Mode.auto],
    value: Mode.auto,
  },
  {
    text: ModeText[Mode.f100],
    value: Mode.f100,
  },
  {
    text: ModeText[Mode.f1000],
    value: Mode.f1000,
  },
  {
    text: ModeText[Mode.f2500],
    value: Mode.f2500,
  },
  {
    text: ModeText[Mode.f5000],
    value: Mode.f5000,
  },
  {
    text: ModeText[Mode.f10000],
    value: Mode.f10000,
  },
]
const changePort = (val: string, type: string) => {
  setLanSpeed({
    ifname: type,
    speed: val,
  }).then(() => {
    successTips()
    getLanSpeedData()
  })
}
const getLanSpeedData = () => {
  getLanSpeed().then(({ data }) => {
    const { items, total: totalNum } = data
    total.value = totalNum
    const thisColumns: Column[] = []
    const thisForm: PortType = {}
    for (let i = 1; i <= total.value; i++) {
      const info = items.find((item: { ifname: string }) => item.ifname === `${lan}${i}`)
      thisColumns.push({
        key: info.ifname,
        title: SsidText[info.ifname as keyof typeof SsidText],
      })
      thisForm[info.ifname as keyof typeof SsidText] = info.speed
    }
    columns.value = thisColumns
    tableData.value = [thisForm]
    form.value = thisForm
  })
}
onMounted(() => {
  getLanSpeedData()
})
</script>
