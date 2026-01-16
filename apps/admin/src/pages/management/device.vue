<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0227') }}</h1>
    </div>
    <div class="page__content">
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0075') }}</h2>
      </div>
      <fh-form class="form form--padding">
        <fh-form-item>
          <fh-button block @click="reboot">
            {{ $t('trans0075') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0224') }}</h2>
      </div>
      <fh-form class="form form--padding">
        <fh-form-item>
          <fh-button block @click="resetDefaults">
            {{ $t('trans0224') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="page__sub-header">
        <h2 class="page__title">{{ $t('trans0643') }}</h2>
      </div>
      <fh-form ref="form" class="form form--padding">
        <fh-form-item :label="$t('trans0226')">
          <fh-button block @click="backConfig">
            {{ $t('trans0226') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item :label="$t('trans0634')">
          <fh-upload
            ref="uploader"
            dragable
            :accept="accept"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
            :disabled="saveBtnDisabled"
          />
        </fh-form-item>
        <fh-form-item>
          <fh-button block :disabled="saveBtnDisabled" @click="save">
            {{ $t('trans0634') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  startReboot,
  rebootStatus,
  startReset,
  resetStatus,
  backup,
  uploadConfig,
  getLan,
} from '@/http/api'
import { useCountDown } from '@/hooks/countdown'
import { useAppStore } from '@/stores/modules/app-store'
import { handleLogout } from '@/util/tool'
import { loading, dialog, toast } from '@fhtek-ui/components'

defineOptions({
  name: 'DevicePage',
})

enum Status {
  doing = 'doing',
  done = 'done',
  fail = 'fail',
}

const { t } = useI18n()
const timeout = 1000 * 60 * 2 // 2 minutes
const interval = 5000 // 5 second
const accept = '.tgz'
const saveBtnDisabled = ref(false)
const uploader = useTemplateRef('uploader')
const lanIp = ref('')
const appStore = useAppStore()

function createDoingHandle(checkStatus: () => Promise<string>, cleanCountDown: () => void) {
  return () => {
    checkStatus().then((status) => {
      if (status === Status.done || status === Status.fail) {
        cleanCountDown()
        handleLogout(false)
      }
    })
  }
}
function createDoneHandle(key: string) {
  return () => {
    sessionStorage.setItem(key, '0')
    loading.close()
    window.location.reload()
  }
}

// eslint-disable-next-line prefer-const
let cleanRebootCountDown: () => void
// eslint-disable-next-line prefer-const
let cleanResetCountDown: () => void
const checkRebootStatus = () => rebootStatus().then(({ data }) => data.status)
const checkResetStatus = () => resetStatus().then(({ data }) => data.status)
const doingRebootHandle = createDoingHandle(checkRebootStatus, () => cleanRebootCountDown())
const doingResetHandle = createDoingHandle(checkResetStatus, () => cleanResetCountDown())
const doneRebootHandle = createDoneHandle('reboot')
const doneResetHandle = createDoneHandle('reset')

const { createCountDown: createRebootCountDown, cleanCountDown: _cleanRebootCountDown } =
  useCountDown(timeout, interval, doingRebootHandle, doneRebootHandle)
const { createCountDown: createResetCountDown, cleanCountDown: _cleanResetCountDown } =
  useCountDown(timeout, interval, doingResetHandle, doneResetHandle)
cleanRebootCountDown = _cleanRebootCountDown
cleanResetCountDown = _cleanResetCountDown
const createRebootCountDownAlias = () => {
  appStore.stopLoginTimeoutCheck()
  createRebootCountDown()
}
const createResetCountDownAlias = () => {
  appStore.stopLoginTimeoutCheck()
  createResetCountDown()
}
const handleReboot = () => {
  loading.open({
    tip: t('trans0229'),
  })
  sessionStorage.setItem('reboot', '1')
  createRebootCountDownAlias()
}
const handleReset = () => {
  loading.open({
    tip: t('trans0617'),
  })
  sessionStorage.setItem('reset', '1')
  createResetCountDownAlias()
}
const reboot = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0242'),
    })
    .then(() => {
      startReboot().then(({ data }) => {
        const status = data.status
        if (status === Status.doing) {
          handleReboot()
        }
      })
    })
    .catch(() => {})
}
const reset = () => {
  startReset().then(({ data }) => {
    const status = data.status
    if (status === Status.doing) {
      handleReset()
    }
  })
}
const resetDefaults = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0225'),
    })
    .then(() => {
      reset()
    })
    .catch(() => {})
}
const getBackupFile = () => {
  backup().then(({ data }) => {
    window.location.href = `${import.meta.env.DEV ? `http://${lanIp.value}` : location.origin}/${data.cfg_name}`
  })
}
const backConfig = () => {
  dialog
    .confirm({
      okText: t('trans0019'),
      cancelText: t('trans0020'),
      message: t('trans0228'),
    })
    .then(() => {
      getBackupFile()
    })
    .catch(() => {})
}
const handleUploadError = () => {
  saveBtnDisabled.value = true
}
const handleUploadsuccess = () => {
  saveBtnDisabled.value = false
}
const handleUploadcancel = () => {
  saveBtnDisabled.value = false
}
// const beforeUpload = (files) => {
//   this.isHasfile = files.length > 0
//   const isValidFileName = !!files.find((file) => {
//     return true // file.name.split('_')[0] === this.uploadFileName // eg: file name: FTG6214X-B4I_V1.0.0-rc.1.bin
//   })
//   if (!isValidFileName) {
//     this.$toast({ text: this.$t('trans0366') })
//   }
//   return isValidFileName
// }
const save = () => {
  if (!uploader.value.files.length) {
    toast(t('trans0222'), 3000, 'error')
    return
  }
  saveBtnDisabled.value = true
  const fd = new FormData()
  fd.append('file', uploader.value.files[0])
  uploadConfig(fd, (progressEvent) => {
    const { loaded, total, lengthComputable } = progressEvent
    if (lengthComputable) {
      uploader.value.uploadPercentage = Math.floor((loaded / total) * 100)
      if (loaded >= total) {
        uploader.value.status = uploader.value.UploadStatus.success
      } else {
        uploader.value.status = uploader.value.UploadStatus.uploading
      }
    }
  })
    .then(() => {
      handleReboot()
    })
    .catch(() => {
      uploader.value.status = uploader.value.UploadStatus.fail
    })
    .finally(() => {
      saveBtnDisabled.value = false
    })
}
const getLanData = () => {
  getLan(false, false).then(({ data }) => {
    const { lan } = data
    const { ip } = lan
    lanIp.value = ip
  })
}
onMounted(() => {
  if (sessionStorage.getItem('reboot') === '1') {
    loading.open({
      tip: t('trans0229'),
    })
    checkRebootStatus()
      .then((status) => {
        if (status === Status.doing) {
          createRebootCountDownAlias()
        } else if (status === Status.done) {
          doneRebootHandle()
        }
      })
      .catch(() => {
        createRebootCountDownAlias()
      })
  }
  if (sessionStorage.getItem('reset') === '1') {
    loading.open({
      tip: t('trans0617'),
    })
    checkResetStatus()
      .then((status) => {
        if (status === Status.doing) {
          createResetCountDownAlias()
        } else if (status === Status.done) {
          doneResetHandle()
        }
      })
      .catch(() => {
        createResetCountDownAlias()
      })
  }
  getLanData()
})
</script>
