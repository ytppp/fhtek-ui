<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0751') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__table">
        <fh-table
          :columns="columns"
          :data-source="wanBindingData"
          :show-row-checkbox="false"
          :show-index="false"
        >
          <template #operation="scope">
            <fh-icon
              class="page__header-icon"
              @click="openEditModal(scope.row)"
              name="icon-edit-square"
              :title="$t('trans0165')"
              v-if="scope.row.mode !== Mode.L2"
            />
          </template>
        </fh-table>
      </div>
    </div>
    <fh-modal v-model="visible" :title="$t('trans0165')" :before-close="handleClose">
      <template #body>
        <fh-form class="form modal-form" ref="modalFormRef" :model="form" :rules="modalFormRules">
          <fh-form-item :label="$t('trans0754')">
            {{ form.port }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0752')">
            <fh-select v-model="form.mode" :options="modeList"> </fh-select>
          </fh-form-item>
          <fh-form-item :label="$t('trans0753')" prop="pair" v-if="isVlan">
            <fh-input v-model="form.pair" placeholder="User VLAN/WAN VLAN"></fh-input>
            <template #extra>
              <span class="form__tips">
                {{ $t('trans0930') }}
              </span>
            </template>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </fh-form>
      </template>
    </fh-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataClean } from '@/hooks/data-clean'
import { getWanBinding, setWanBinding } from '@/http/api'
import { SsidText } from '@/util/constant'
import { successTips, isValidInteger } from '@/util/tool'

enum Mode {
  port = 'port',
  vlan = 'vlan',
  L2 = 'L2',
}
const { t } = useI18n()
const { defaultVal } = useDataClean()

const l2Text = 'L2'
const l2PortText = 'L2 port'
const ModeText = {
  [Mode.port]: t('trans0755'),
  [Mode.vlan]: t('trans0756'),
  [Mode.L2]: l2Text,
}
const modalFormRef = useTemplateRef('modalFormRef')
const visible = ref(false)
const columns = reactive([
  {
    key: 'port',
    title: t('trans0754'),
  },
  {
    key: 'mode',
    title: t('trans0752'),
  },
  {
    key: 'pair',
    title: t('trans0753'),
  },
])
const wanBindingData = reactive([])
const modeList = reactive([
  {
    text: t('trans0755'),
    value: Mode.port,
  },
  {
    text: t('trans0756'),
    value: Mode.vlan,
  },
])
const form = reactive({
  index: -1,
  id: '',
  ifname: '',
  port: '',
  mode: Mode.port,
  pair: '',
})
const modalFormRules = reactive({
  pair: [
    {
      rule: (value) => !/^\s*$/g.test(value),
      message: t('trans0004'),
    },
    {
      rule: (value) => {
        const multiPairRegex = /^(\d+\/\d+)(;\d+\/\d+)*$/
        if (!multiPairRegex.test(value)) return false
        let value2Arr = value.split(';').map((val) => val.split('/'))
        if (!value2Arr.flat().every((val) => isValidInteger(val, 1, 4094))) {
          return false
        } else {
          value2Arr = value2Arr.map((val) => val[0])
          return value2Arr.length === new Set(value2Arr).size
        }
      },
      message: t('trans0566').format(t('trans0753')),
    },
  ],
})
const isVlan = computed(() => form.mode === Mode.vlan)
const getPairText = (type, vlanpair) => {
  if (type === Mode.port) {
    return defaultVal
  }
  if (type === Mode.vlan) {
    return vlanpair
  }
  if (type === Mode.L2) {
    return l2PortText
  }
}
const openEditModal = (row) => {
  form.index = row.index
  form.id = row.id
  form.port = row.port
  form.ifname = row.ifname
  form.mode = row.type
  form.pair = row.vlanpair
  visible.value = true
}
const handleClose = () => {
  modalFormRef.value.clearValidate()
}
const save = () => {
  if (!modalFormRef.value.validate()) return
  const data = {
    id: form.id,
    ifname: form.ifname,
    type: form.mode,
    vlanpair: form.pair,
  }
  setWanBinding([data]).then(() => {
    successTips()
    getWanBindingData()
  })
}
const getWanBindingData = () => {
  getWanBinding()
    .then(({ data }) => {
      const tableData = []
      const { items } = data
      items.forEach((item, i) => {
        tableData.push({
          ...item,
          port: SsidText[item.ifname],
          mode: ModeText[item.type],
          pair: getPairText(item.type, item.vlanpair),
          index: i,
        })
      })
      wanBindingData.splice(0, wanBindingData.length, ...tableData)
    })
    .catch(() => {})
    .finally(() => {
      visible.value = false
    })
}

onMounted(() => {
  getWanBindingData()
})
</script>
