<template>
  <div>
    <fh-form
      ref="formRef"
      :model="form"
      label-width="200px"
      label-position="right"
      :disabled="false"
      :rules="rules"
    >
      <!-- <fh-radio-group v-model="form.onlineWay" @change="changeOnlineWay">
        <fh-radio name="Mode" v-for="mode in onlineWays" :key="mode.value" :label="mode.value">
          {{ mode.text }}
        </fh-radio>
      </fh-radio-group> -->
      <fh-form-item label="端口" prop="port">
        <fh-input name="port" v-model="form.port" placeholder="端口范围：1-65535"></fh-input>
        <template #extra> 端口范围：1-65535 </template>
      </fh-form-item>
      <fh-form-item label="工作时间">
        <div>
          <div>
            <fh-checkbox style="width: 70px" v-model="checkAll" @change="selectAll">
              全选
            </fh-checkbox>
          </div>
          <fh-checkbox-group v-model="form.weekdays">
            <fh-checkbox
              style="width: 70px"
              v-for="schedule in schedulesList"
              :key="schedule.value"
              :value="schedule.value"
            >
              {{ schedule.label }}
            </fh-checkbox>
          </fh-checkbox-group>
        </div>
      </fh-form-item>
      <!-- <fh-form-item label="时间选择">
        <fh-time-picker v-model="form.time_begin" />
      </fh-form-item> -->
      <fh-form-item @click="save">
        <fh-button>保存</fh-button>
      </fh-form-item>
    </fh-form>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

defineOptions({
  name: 'FhFormDemo',
})

enum OnlineWay {
  pppoe = '2',
  dhcp = '0',
  static = '1',
  bridge = '3',
}
enum Weeks {
  mon = '1',
  tue = '2',
  wed = '3',
  thu = '4',
  fri = '5',
  sat = '6',
  sun = '7',
}

const formRef = useTemplateRef<FhForm>('formRef')
const checkAll = ref(false)
const schedulesList = [
  {
    value: Weeks.sun,
    label: '周日',
  },
  {
    value: Weeks.mon,
    label: '周一',
  },
  {
    value: Weeks.tue,
    label: '周二',
  },
  {
    value: Weeks.wed,
    label: '周三',
  },
  {
    value: Weeks.thu,
    label: '周四',
  },
  {
    value: Weeks.fri,
    label: '周五',
  },
  {
    value: Weeks.sat,
    label: '周六',
  },
]
const form = ref({
  port: -10,
  weekdays: [],
  onlineWay: OnlineWay.dhcp,
  time_begin: '00:00',
})
const rules = ref({
  port: [
    { rule: (value) => value, message: '必填' },
    { rule: (value) => value >= 1 && value <= 65535, message: '端口范围：1-65535' },
  ],
})
const selectAll = (val) => {
  console.log(val)
  if (val) {
    form.value.weekdays = [
      Weeks.sun,
      Weeks.mon,
      Weeks.tue,
      Weeks.wed,
      Weeks.thu,
      Weeks.fri,
      Weeks.sat,
    ]
  } else {
    form.value.weekdays = []
  }
}
const save = () => {
  if (!formRef.value.validate()) return
  console.log('form is valid')
}
</script>
