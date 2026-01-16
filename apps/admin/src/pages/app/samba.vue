<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0822') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules" v-if="hasUsbDevice">
        <fh-form-item :label="$t('trans0829')">
          <fh-switch v-model="form.enable"> </fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input v-model="form.username"> </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0185')" prop="pwd">
            <fh-input v-model="form.pwd" type="password" show-password @blur="changePwd">
            </fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0186')" prop="confirmPwd" ref="confirmPwd">
            <fh-input v-model="form.confirmPwd" type="password" show-password> </fh-input>
          </fh-form-item>
        </template>
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

<script>
import { isValidLength, isValidSymbol, specialChar, format, successTips } from '@/util/tool'
import { editSamba, getSamba, getUsb } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'

const { convertBooleanStatus } = useDataClean()
export default {
  data() {
    return {
      hasUsbDevice: false,
      form: {
        enable: false,
        username: '',
        pwd: '',
        confirmPwd: '',
      },
      rules: {
        username: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: format(this.$t('trans0013'), [
              this.$t('trans0053'),
              format(this.$t('trans0042'), [specialChar]),
            ]),
          },
        ],
        pwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 8, 64),
            message: format(this.$t('trans0003'), [this.$t('trans0196'), 8, 64]),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: format(this.$t('trans0013'), [
              this.$t('trans0196'),
              format(this.$t('trans0042'), [specialChar]),
            ]),
          },
        ],
        confirmPwd: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 8, 64),
            message: format(this.$t('trans0003'), [this.$t('trans0186'), 8, 64]),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: format(this.$t('trans0013'), [
              this.$t('trans0186'),
              format(this.$t('trans0042'), [specialChar]),
            ]),
          },
          {
            rule: () => this.validatePwd(),
            message: this.$t('trans0195'),
          },
        ],
      },
    }
  },
  methods: {
    changePwd() {
      if (this.$refs.confirmPwd && this.form.confirmPwd) {
        this.$refs.confirmPwd.extraValidate(this.validatePwd, this.$t('trans0195'))
      }
    },
    validatePwd() {
      if (this.form.pwd) {
        return this.form.pwd === this.form.confirmPwd
      }
      return true
    },
    save() {
      if (!this.$refs.form.validate()) return
      editSamba({
        enable: convertBooleanStatus(this.form.enable),
        username: this.form.username,
        password: this.form.pwd,
      }).then(() => {
        successTips()
      })
    },
    getSambaData() {
      getSamba().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
        this.form.username = data.username
        this.form.confirmPwd = this.form.pwd = data.password
      })
    },
    getUsbInfo() {
      getUsb().then(({ data }) => {
        this.hasUsbDevice = convertBooleanStatus(data.has_usb)
        if (this.hasUsbDevice) {
          this.getSambaData()
        }
      })
    },
  },
  mounted() {
    this.getUsbInfo()
  },
}
</script>
