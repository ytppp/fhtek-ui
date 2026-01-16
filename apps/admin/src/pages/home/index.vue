<template>
  <div>
    <fh-pagination :total="paginationTotal"></fh-pagination>
    <div style="width: 600px">
      <fh-table :columns="columns" :data-source="tableData">
        <template #title> 标题 </template>
        <template #operationgroup>
          <fh-button size="small">新增</fh-button>
          <fh-button size="small" @click="del">删除</fh-button>
        </template>
        <template #url="scope">
          <fh-popover :title="scope.row.url" trigger="click">{{ scope.row.url }}</fh-popover>
        </template>
        <template #enable="scope">
          <!-- @change="toggleStatus(scope.row)" -->
          <fh-switch
            :active-value="EnableStatus.yes"
            :inactive-value="EnableStatus.no"
            v-model="scope.row.enable"
          />
        </template>
        <template #operation="scope">
          <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
          <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
          <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
          <fh-button type="text" @click="() => operation(scope)">操作</fh-button>
        </template>
        <template #footer> footer </template>
      </fh-table>
    </div>
    <fh-form :model="form">
      <fh-radio-group v-model="form.onlineWay" @change="changeOnlineWay">
        <fh-radio name="Mode" v-for="mode in onlineWays" :key="mode.value" :label="mode.value">
          {{ mode.text }}
        </fh-radio>
      </fh-radio-group>
      <fh-form-item :label="$t('trans0555')">
        <div>
          <div>
            <fh-checkbox style="width: 70px" v-model="checkAll" @change="selectAll">{{
              $t('trans0514')
            }}</fh-checkbox>
          </div>
          <fh-checkbox-group v-model="form.weekdays">
            <fh-checkbox
              style="width: 70px"
              v-for="schedule in schedulesList"
              :key="schedule.value"
              :label="schedule.value"
            >
              {{ schedule.label }}
            </fh-checkbox>
          </fh-checkbox-group>
        </div>
      </fh-form-item>
      <fh-form-item label="时间选择">
        <fh-time-picker v-model="form.time_begin" />
      </fh-form-item>
    </fh-form>
    <fh-popover title="popover弹框内容" trigger="click">click popover弹框</fh-popover>
    <fh-button @click="toggleLoading">切换loading</fh-button>
    <div style="height: 200px; width: 200px; border: solid 1px red" v-loading="uploading">
      loading
    </div>
    <fh-step :option="stepOption"></fh-step>
    <fh-button @click="openDialog">消息弹框</fh-button>
    <fh-button @click="openDialog2">提示弹框2</fh-button>
    <fh-button @click="() => toggleVisible(true)">打开Modal</fh-button>
    <div style="height: 400px; width: 400px; position: relative; border: solid 1px red">
      <fh-modal v-model="visible" width="25%" :is-append-body="false">
        <template #body>
          <h2 class="signin-modal__title">{{ $t('trans0624') }}</h2>
          <p class="signin-modal__content">{{ $t('trans0625') }}</p>
        </template>
        <template #footer>
          <div class="signin-modal__action">
            <fh-button type="text" @click="() => toggleVisible(false)">
              {{ $t('trans0626') }}
            </fh-button>
          </div>
        </template>
      </fh-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { EnableStatus } from '@/util/constant'
import { ref, inject, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'HomePage',
})

const { t } = useI18n()
const dialog = inject('dialog')
const paginationTotal = 100
const uploading = ref(false)
const visible = ref(false)
const checkAll = ref(true)
const Weeks = {
  mon: '1',
  tue: '2',
  wed: '3',
  thu: '4',
  fri: '5',
  sat: '6',
  sun: '7',
}
const OnlineWay = {
  pppoe: '2',
  dhcp: '0',
  static: '1',
  bridge: '3',
}
const form = reactive({
  weekdays: [],
  onlineWay: OnlineWay.dhcp,
  time_begin: '00:00',
})
const onlineWays = [
  {
    value: OnlineWay.pppoe,
    text: t('trans0081'),
  },
  {
    value: OnlineWay.dhcp,
    text: t('trans0082'),
  },
  {
    value: OnlineWay.static,
    text: t('trans0084'),
  },
]
const stepOption = {
  current: 0,
  steps: [
    {
      text: t('trans0577'),
      success: true,
    },
    {
      text: t('trans0578'),
      success: true,
    },
    {
      text: t('trans0579'),
      success: true,
    },
    {
      text: t('trans0580'),
      success: true,
    },
  ],
}
const schedulesList = [
  {
    value: Weeks.sun,
    label: t('trans0663'),
  },
  {
    value: Weeks.mon,
    label: t('trans0515'),
  },
  {
    value: Weeks.tue,
    label: t('trans0525'),
  },
  {
    value: Weeks.wed,
    label: t('trans0526'),
  },
  {
    value: Weeks.thu,
    label: t('trans0527'),
  },
  {
    value: Weeks.fri,
    label: t('trans0600'),
  },
  {
    value: Weeks.sat,
    label: t('trans0601'),
  },
]
const tableData = [
  {
    url: 'www.apple.com',
    url2: 'www.apple.com',
    url3: 'www.apple.com',
    url4: 'www.apple.com',
    name: '苹果',
    enable: EnableStatus.yes,
  },
  {
    url: 'www.baidu.com',
    url2: 'www.baidu.com',
    url3: 'www.baidu.com',
    url4: 'www.baidu.com',
    name: '百度',
    enable: EnableStatus.no,
  },
  {
    url: 'www.geogle.com',
    url2: 'www.geogle.com',
    url3: 'www.geogle.com',
    url4: 'www.geogle.com',
    name: '谷歌',
    enable: EnableStatus.yes,
  },
]
const columns = [
  {
    key: 'url',
    title: 'url',
  },
  {
    key: 'url2',
    title: 'url2',
    fixed: 'left',
  },
  {
    key: 'url3',
    title: 'url3',
  },
  {
    key: 'url4',
    title: 'url4',
  },
  {
    key: 'name',
    title: 'name',
  },
  {
    key: 'enable',
    title: t('trans0166'),
    fixed: 'right',
  },
]
const selectAll = (val) => {
  if (val) {
    Object.assign(form, {
      weekdays: [Weeks.sun, Weeks.mon, Weeks.tue, Weeks.wed, Weeks.thu, Weeks.fri, Weeks.sat],
    })
  } else {
    Object.assign(form, {
      weekdays: [],
    })
  }
}
const changeOnlineWay = (val) => {
  console.log(val)
}

const toggleLoading = () => {
  uploading.value = !uploading.value
}

const toggleVisible = (flag) => {
  visible.value = flag
}

const openDialog = () => {
  dialog
    .info({
      okText: t('trans0019'),
      message: t('trans0645'),
    })
    .then(() => {
      console.log('info then')
    })
}
const openDialog2 = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0021'),
    })
    .then(() => {
      console.log('confirm then')
    })
    .catch(() => {
      console.log('confirm catch')
    })
}
const del = () => {}
const operation = (scope) => {
  console.log(scope)
}
const toggleStatus = (scope) => {
  console.log(scope)
}
</script>
