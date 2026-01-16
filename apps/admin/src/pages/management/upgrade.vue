<template>
  <div class="page upgrade-page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0187') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :disabled="formDisabled">
        <fh-form-item>
          <fh-upload
            dragable
            ref="uploader"
            :accept="accept"
            :before-upload="beforeUpload"
            :on-error="handleUploadError"
            :on-success="handleUploadsuccess"
            :on-cancel="handleUploadcancel"
          />
        </fh-form-item>
        <fh-form-item>
          <fh-button @click="save" block>
            {{ $t('trans0187') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { upload, getUpgradeStatus } from '@/http/api'
import { useAppStore } from '@/stores/modules/app-store'

export default {
  data() {
    return {
      uploadFileName: '',
      accept: '.bin',
      formDisabled: false,
      isHasfile: false,
    }
  },
  computed: {
    ...mapStores(useAppStore),
  },
  methods: {
    handleUploadError() {
      this.formDisabled = true
    },
    handleUploadsuccess() {
      this.formDisabled = false
    },
    handleUploadcancel() {
      this.formDisabled = false
    },
    save() {
      if (!this.$refs.uploader.files.length) {
        this.$toast(this.$t('trans0222'), 3000, 'error')
        return
      }
      this.formDisabled = true
      const fd = new FormData()
      fd.append('file', this.$refs.uploader.files[0])
      upload(fd, (progressEvent) => {
        const { loaded, total, lengthComputable } = progressEvent
        if (lengthComputable) {
          this.$refs.uploader.uploadPercentage = Math.floor((loaded / total) * 100)
          if (loaded >= total) {
            this.$refs.uploader.status = this.$refs.uploader.UploadStatus.success
          } else {
            this.$refs.uploader.status = this.$refs.uploader.UploadStatus.uploading
          }
        }
      })
        .then(() => {
          this.upgrading()
        })
        .catch(() => {
          this.formDisabled = false
          this.$refs.uploader.status = this.$refs.uploader.UploadStatus.fail
        })
    },
    upgrading() {
      this.appStore.stopLoginTimeoutCheck()
      this.$upgrade.open({
        title: this.$t('trans0468'),
        tip: this.$t('trans0203'),
      })
    },
    beforeUpload(files) {
      this.isHasfile = files.length > 0
      const isValidFileName = !!files.find((file) => {
        return true // file.name.split('_')[0] === this.uploadFileName // eg: file name: FTG6214X-B4I_V1.0.0-rc.1.bin
      })
      if (!isValidFileName) {
        this.$toast({ text: this.$t('trans0366') })
      }
      return isValidFileName
    },
  },
  mounted() {
    getUpgradeStatus().then(({ data }) => {
      const { upgradestatus } = data
      if (upgradestatus == 1) {
        this.upgrading()
      }
    })
  },
}
</script>

<style lang="less">
.upgrade-page .button {
  width: 350px;
}
</style>
