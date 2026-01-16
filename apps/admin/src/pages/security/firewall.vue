<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0060') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form">
        <fh-form-item :label="$t('trans0060')">
          <fh-switch v-model="form.enable" @change="switchEnable"> </fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0703')">
            <div>{{ currentLevel }}</div>
          </fh-form-item>
          <fh-form-item :label="$t('trans0037')" v-if="form.enable">
            <fh-select v-model="form.level" :options="securityLevels"> </fh-select>
          </fh-form-item>
          <fh-form-item class="form__submit-btn">
            <fh-button @click="save" block>
              {{ $t('trans0002') }}
            </fh-button>
          </fh-form-item>
        </template>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { setFirewall, getFirewall } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { EnableStatus } from '@/util/constant'
import { successTips } from '@/util/tool'

defineOptions({
  name: 'FirewallPage',
})

enum SecurityLevels {
  low = 'low',
  medium = 'medium',
  high = 'high',
  userdefined = 'userdefined',
}

const { convertBooleanStatus } = useDataClean()
const { t } = useI18n()
const dialog = inject('dialog')
const SecurityLevelsText = {
  [SecurityLevels.low]: t('trans0062'),
  [SecurityLevels.medium]: t('trans0063'),
  [SecurityLevels.high]: t('trans0064'),
  [SecurityLevels.userdefined]: t('trans0065'),
}
const securityLevels = [
  {
    value: SecurityLevels.low,
    text: SecurityLevelsText[SecurityLevels.low],
  },
  {
    value: SecurityLevels.medium,
    text: SecurityLevelsText[SecurityLevels.medium],
  },
  {
    value: SecurityLevels.high,
    text: SecurityLevelsText[SecurityLevels.high],
  },
  {
    value: SecurityLevels.userdefined,
    text: SecurityLevelsText[SecurityLevels.userdefined],
  },
]
const formEnableInitial = ref(false)
const currentLevel = ref(SecurityLevelsText[SecurityLevels.low])
const form = reactive({
  enable: true,
  level: SecurityLevels.low,
})

const isCustom = computed(() => {
  return form.level === SecurityLevels.userdefined
})

const switchEnable = () => {
  if (!form.enable && formEnableInitial.value) {
    dialog
      .confirm({
        okText: t('trans0019'),
        cancelText: t('trans0020'),
        message: t('trans0067'),
      })
      .then(() => {
        save()
      })
      .catch(() => {
        form.enable = true
      })
  }
}
const save = () => {
  const data: {
    enable: string
    level?: SecurityLevels
    custom?: EnableStatus
  } = {
    enable: convertBooleanStatus(form.enable) as string,
  }
  if (isCustom.value) {
    data.custom = EnableStatus.yes
  } else {
    data.custom = EnableStatus.no
    data.level = form.level
  }
  setFirewall(data).then(() => {
    successTips()
    getFirewallData()
  })
}
const getFirewallData = () => {
  getFirewall().then(({ data }) => {
    const { enable, level, custom } = data
    formEnableInitial.value = form.enable = convertBooleanStatus(enable) as boolean
    const isCustom = convertBooleanStatus(custom) as boolean
    if (isCustom) {
      currentLevel.value = SecurityLevelsText[SecurityLevels.userdefined]
      form.level = SecurityLevels.userdefined
    } else {
      form.level = level
      currentLevel.value = SecurityLevelsText[form.level]
    }
  })
}
onMounted(() => {
  getFirewallData()
})
</script>
