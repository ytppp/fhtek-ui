<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0823') }}</h1>
    </div>
    <div class="page__content">
      <fh-form
        class="form form--padding"
        ref="formRef"
        :model="form"
        :rules="rules"
        v-if="hasUsbDevice"
      >
        <fh-form-item :label="t('trans0824')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <fh-form-item :label="$t('trans0825')" prop="sharingPath" v-if="form.enable">
          <fh-input v-model="form.sharingPath"></fh-input>
          <template #extra>
            <ul style="list-style: disc">
              <li>{{ $t('trans0826') }}</li>
              <li>{{ $t('trans0855') }}</li>
            </ul>
          </template>
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div style="padding-left: 20px; font-size: 16px" v-else>
        {{ $t('trans0821') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUsb, editMediaSharing, getMediaSharing } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { isValidUnixPath, successTips, isInvalidSymbol, invalidChar } from '@/util/tool'

const { t } = useI18n()
const { convertBooleanStatus } = useDataClean()
const hasUsbDevice = ref(false)
const formRef = ref(null)
const form = reactive({
  enable: false,
  sharingPath: '',
})
const rules = {
  sharingPath: [
    {
      rule: (value) => {
        if (!value) return true
        return !isInvalidSymbol(value)
      },
      message: t('trans0957').format(t('trans0825'), invalidChar),
    },
    {
      rule: (value) => (value) => {
        if (!value) return true
        return isValidUnixPath(value)
      },
      message: t('trans0830'),
    },
  ],
}
const getUsbInfo = () => {
  getUsb().then(({ data }) => {
    hasUsbDevice.value = convertBooleanStatus(data.has_usb)
    if (hasUsbDevice.value) {
      getMediaSharingData()
    }
  })
}
const getMediaSharingData = () => {
  getMediaSharing().then(({ data }) => {
    form.enable = convertBooleanStatus(data.enable)
    form.sharingPath = data.sharing_path
  })
}
const save = () => {
  if (!formRef.value.validate()) return
  const data = {
    enable: convertBooleanStatus(form.enable),
    sharing_path: form.sharingPath,
  }
  editMediaSharing(data).then(() => {
    successTips()
  })
}

onMounted(() => {
  getUsbInfo()
})
</script>
