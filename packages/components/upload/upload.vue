<template>
  <div class="upload">
    <div class="upload__box">
      <fh-upload-dragger v-if="dragable" :disabled="uploadDisabled" @file="uploadDragFiles">
        <svg
          class="upload__icon"
          :class="uploadDisabled ? 'is-upload-loading' : ''"
          viewBox="0 0 1536 1024"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1241.6 378.24C1196.8 163.936 1004.8 0 768 0c-185.6 0-345.6 100.864-422.4 252.16C147.2 277.44 0 435.04 0 630.464c0 208.064 172.8 378.272 384 378.272h832c179.2 0 320-138.688 320-315.2 0-163.936-134.4-302.624-294.4-315.232zM896 567.424v252.16h-256v-252.16h-192l320-315.2 320 315.2h-192z"
            fill="#D6001C"
          ></path>
        </svg>
        <p class="upload__text">
          {{ $t('trans0205') }}
        </p>
        <fh-button class="fileinput-button" :disabled="uploadDisabled" @click="click" size="small">
          <label>{{ labelText }}</label>
        </fh-button>
      </fh-upload-dragger>
      <template v-else>
        <fh-button class="fileinput-button" :disabled="uploadDisabled" @click="click" size="small">
          <label>{{ labelText }}</label>
        </fh-button>
      </template>
      <input
        type="file"
        @change="handleChange"
        ref="uploadRef"
        :multiple="multiple"
        :accept="accept"
        :name="name"
        :id="id"
        :disabled="uploadDisabled"
        hidden="hidden"
      />
    </div>
    <div class="upload__files" v-if="files.length">
      <div class="file" v-for="file in files" :key="file.lastModified">
        <div class="file__info">
          <div class="icon-wrap">
            <img :src="fileIcon" />
          </div>
          <div class="des-cnt">
            <div class="description">
              <div class="fileinfo">
                <span class="fileinfo__name single-line-text-omitted" :title="file.name">
                  {{ file.name }}
                </span>
                <span class="fileinfo__size">{{ getSize(file) }}</span>
              </div>
              <div
                class="packageinfo"
                v-if="uploadSuccess && packageInfo && packageInfo.product && packageInfo.version"
              >
                <div class="packageinfo__product">
                  <span class="single-line-text-omitted">{{ packageInfo.product }}</span>
                </div>
                <div class="packageinfo__version">
                  <span class="single-line-text-omitted">{{ packageInfo.version }}</span>
                </div>
              </div>
            </div>
            <div class="upgradeing" v-if="uploadLoading || uploadSuccess">
              <div
                class="upgradeing__loading-bar"
                :class="{
                  'upgradeing__loading-bar--loading': uploadLoading,
                  'upgradeing__loading-bar--success': uploadSuccess,
                }"
                :style="{ width: uploadWidth }"
              ></div>
            </div>
            <div v-if="uploadLoading" class="upgradeing__percent">{{ uploadWidth }}</div>
          </div>
          <div class="delete-wrap">
            <img src="@/assets/images/ic_delete.png" alt="" width="24" @click="cancel(file)" />
          </div>
        </div>
        <div class="file__error" v-if="uploadFail">{{ err || $t('trans0206') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, useTemplateRef } from 'vue'
import {
  FormContextKey,
  FormItemContextKey,
  type IFormContext,
  type IFormItemContext,
} from '@fhtek-ui/components/form'
import { useInjectDisabled } from '@fhtek-ui/components/config-provider/disabled-context'
import FhUploadDragger from './upload-dragger.vue'
import { toLocaleNumber } from '@/i18n/index'
import { getFileExtendName } from '@/util/tool'
import IcFolderError from '@/assets/images/ic_folder_error.png'
import IcFolder from '@/assets/images/ic_folder.png'
import { UploadStatus, type IUploadProps } from './interface'

defineOptions({
  name: 'FhUpload',
})

const from = inject<IFormContext | null>(FormContextKey, null)
const formItem = inject<IFormItemContext | null>(FormItemContextKey, null)
const disabledContext = useInjectDisabled()
const props = withDefaults(defineProps<IUploadProps>(), {
  multiple: false,
  dragable: false,
  limit: 500 * 1000 * 1000,
  isFormUpload: false,
  disabled: false,
})
const uploadRef = useTemplateRef('uploadRef')
const files = ref([])
const draggerFiles = ref<FileList | null>(null)
const uploadPercentage = ref(0)
const status = ref<UploadStatus>(UploadStatus.ready)
const err = ref('')

const id = computed(() => {
  return formItem?.value.id
})
const uploadSuccess = computed(() => {
  return status.value === UploadStatus.success
})
const uploadLoading = computed(() => {
  return status.value === UploadStatus.uploading
})
const uploadFail = computed(() => {
  return status.value === UploadStatus.fail
})
const uploadDisabled = computed(() => {
  return props.disabled || disabledContext.value || uploadLoading.value
})
const uploadPercent = computed(() => {
  return Math.min(uploadPercentage.value, 100)
})
const uploadWidth = computed(() => {
  return `${uploadPercent.value}%`
})
const fileIcon = computed(() => {
  return uploadFail.value ? IcFolderError : IcFolder
})
const labelText = computed(() => {
  return props.label || formItem?.value.label || ''
})

const uploadDragFiles = (files: FileList) => {
  if (files && !files.length) return
  draggerFiles.value = files
  let postFiles = [].slice.call(files)
  if (!props.multiple) {
    postFiles = postFiles.slice(0, 1)
  }
  files.value = postFiles
  validateFileFormat()
}

const getSize = (file: File) => {
      return `${toLocaleNumber(file.size / 1000 / 1000, this.$i18n.locale, 2, 2)}MB`
    }
    click() {
      this.initUploadStatus()
      this.$refs.upload.click()
    }
    initUploadStatus() {
      this.files = []
      this.err = ''
      this.uploadPercentage = 0
      this.status = UploadStatus.ready
      this.$refs.upload.value = null
      this.onChange && this.onChange()
    }
    validateFileFormat() {
      const isZeroSize = !!this.files.find((file) => file.size === 0)
      let flag = true
      if (isZeroSize) {
        this.status = UploadStatus.fail
        this.err = this.$t('trans0206')
        flag = false
      }
      const isLimitOver = !!this.files.find((file) => file.size >= this.limit)
      if (isLimitOver) {
        this.status = UploadStatus.fail
        this.err = this.$t('trans0211')
        flag = false
      }
      if (this.accept) {
        const reg = new RegExp(`^${this.accept.slice(1)}$`, 'i')
        const isInvalidFile = !!this.files.find((file) => {
          const entendName = getFileExtendName(file)
          return !reg.test(entendName)
        })
        if (isInvalidFile) {
          this.status = UploadStatus.fail
          this.err = this.$t('trans0208').format(this.accept)
          flag = false
        }
      }
      if (this.beforeUpload && !this.beforeUpload(this.files)) {
        this.status = UploadStatus.fail
        flag = false
      }
      if (!flag && this.onError) {
        this.onError()
        return
      }
      if (this.isFormUpload) {
        this.status = UploadStatus.success
      } else {
        this.upload()
        if (this.onSuccess) {
          this.onSuccess()
        }
      }
    }
    handleChange(ev) {
      const { files } = ev.target
      if (files && !files.length) return
      let postFiles = Array.prototype.slice.call(files)
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1)
      }
      this.files = postFiles
      this.validateFileFormat()
    }
    upload() {
      if (!this.request) {
        // 组件内部实现自己的上传逻辑
      } else {
        // 外部上传
        this.request(this.files)
      }
      return true
    }
    cancel(file) {
      // 组件内部的取消逻辑
      this.files = this.files.filter((v) => v.name !== file.name)
      this.$refs.upload.value = null
      this.status = UploadStatus.ready
      this.onCancel && this.onCancel(file)
    }
</script>

<style lang="less">
.upload {
  width: 100%;
  max-width: @form-item-max-width;
  .single-line-text-omitted {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .upload__box {
    position: relative;
    input {
      cursor: pointer;
      position: absolute;
      right: 0px;
      top: 0px;
      opacity: 0;
      filter: alpha(opacity=0);
      width: 100%;
      height: 100%;
    }

    .upload__icon {
      width: 48px;
      height: 32px;
      path {
        fill: @primaryColor;
      }
      &.is-upload-loading {
        path {
          fill: @upload-button-disabled-color;
        }
      }
    }
    .upload__text {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin: 8px 0;
    }
    .fileinput-button {
      width: auto;
      height: 28px;
      min-width: 80px;
      cursor: pointer;
      &[disabled] {
        background: @upload-button-disabled-color;
        cursor: not-allowed;
        label {
          cursor: not-allowed;
        }
      }
      label {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: center;
        margin: 0;
        cursor: pointer;
        img {
          width: 14px;
          margin-right: 5px;
        }
        font-size: 12px;
        font-weight: normal;
      }
    }
  }
  .upload__files {
    margin-top: 20px;
  }
  .file {
    & + .file {
      margin-top: 20px;
    }
    .file__info {
      display: flex;
      align-items: center;
      transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
      font-size: 14px;
      color: @upload-file-text-color;
      border-radius: 5px;
      background: @upload-background-color;
      padding: 10px;
      .icon-wrap {
        background: @upload-icon-background-color;
        padding: 5px;
        border-radius: 50%;
        img {
          width: 38px;
          height: 38px;
          display: block;
        }
      }
      .des-cnt {
        position: relative;
        margin-left: 10px;
        flex: 1;
        .description {
          color: @upload-file-description-color;
          display: flex;
          // align-items: center;
          flex-direction: column;
        }
        .packageinfo {
          display: flex;
          .packageinfo__product,
          .packageinfo__version {
            display: flex;
            align-items: center;
            &::before {
              content: '';
              display: inline-block;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              margin-right: 5px;
              background: @upload-file-info-product-dot-color;
            }
          }
          .packageinfo__product {
            margin-right: 10px;
          }
          .packageinfo__version {
            &::before {
              background: @upload-file-info-version-dot-color;
            }
          }
        }
        .fileinfo {
          display: flex;
          justify-content: space-between;
          .fileinfo__name {
            flex: 0 0 auto;
            max-width: 120px;
          }
          .fileinfo__size {
            color: @upload-file-text-color;
          }
        }
        .upgradeing {
          width: 100%;
          height: 3px;
          background: @upload-progress-color;
          margin-top: 10px;
          margin-bottom: 10px;
          border-radius: 1.5px;
          .upgradeing__loading-bar {
            height: 100%;
            &.upgradeing__loading-bar--loading {
              transition: width 1s ease;
              background: @upload-progress-completed-color !important;
            }
            &.upgradeing__loading-bar--success {
              background: @upload-progress-completed-color;
            }
          }
          .upgradeing__percent {
            font-size: 12px;
            color: @upload-file-text-color;
            margin-top: 8px;
          }
        }
      }
      .delete-wrap {
        margin-left: 10px;
        img {
          cursor: pointer;
        }
      }
    }
    .file__error {
      margin-top: 10px;
      font-size: 12px;
      color: #ff0021;
    }
  }
  @media screen and (max-width: 768px) {
    .upload__files {
      width: 100%;
    }
    .file {
      .file__info {
        padding: 15px;
        .des-cnt {
          margin-left: 15px;
          .packageinfo {
            flex-direction: column;
          }
        }
        .delete-wrap {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
