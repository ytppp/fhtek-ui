<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0647') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="vpnForm" :model="vpnForm" :rules="rules">
        <fh-form-item :label="$t('trans0660')">
          <fh-radio-group v-model="vpnForm.type" @change="changeVpnType">
            <fh-radio
              name="vpn_type"
              v-for="type in vpnTypes"
              :key="type.value"
              :label="type.value"
              >{{ type.text }}</fh-radio
            >
          </fh-radio-group>
        </fh-form-item>
        <fh-form-item :label="statusText">
          <fh-switch v-model="vpnForm.enable"></fh-switch>
        </fh-form-item>
        <template v-if="vpnForm.enable">
          <fh-form-item :label="serverText" prop="server">
            <fh-input name="serverIpAddr" v-model="vpnForm.server"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0053')" prop="username">
            <fh-input name="username" v-model="vpnForm.username"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0196')" prop="password">
            <fh-input
              name="password"
              type="password"
              show-password
              v-model="vpnForm.password"
            ></fh-input>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button id="submitbutton" block @click="save">{{ $t('trans0002') }}</fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import {
  isValidLength,
  isValidSymbol,
  specialChar,
  isIP,
  getIpBefore,
  isMulticast,
  isLoopback,
  ip2int,
  isValidDomain,
  isBoardcastIP,
  successTips,
} from '@/util/tool'
import { getVpn, setVpn, getLan } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { VpnType, VpnTypeText } from '@/util/constant'

const { convertBooleanStatus } = useDataClean()
export default {
  name: 'VpnPage',
  data() {
    return {
      vpnForm: {
        type: VpnType.l2tp,
        enable: false,
        server: '',
        username: '',
        password: '',
      },
      lanIp: '',
      vpnTypeInitial: VpnType.l2tp,
      enableInitial: false,
      vpnTypes: [
        {
          value: VpnType.l2tp,
          text: VpnTypeText[VpnType.l2tp],
        },
        {
          value: VpnType.pptp,
          text: VpnTypeText[VpnType.pptp],
        },
      ],
      rules: {
        server: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => {
              if (isIP(value)) {
                return (
                  !isMulticast(value) &&
                  !isLoopback(value) &&
                  !isBoardcastIP(value) &&
                  ip2int(value) != 0
                )
              } else {
                return true
              }
            },
            message: this.$t('trans0397'),
          },
          {
            rule: (value) => {
              if (isIP(value)) {
                return true
              }
              return isValidDomain(value) && isValidSymbol(value)
            },
            message: this.$t('trans0013').format('', this.$t('trans0042').format(specialChar)),
          },
          {
            rule: (value) => {
              if (isValidDomain(value)) {
                return true
              }
              if (!this.lanIp) {
                return true
              }
              const lanIpBefore = getIpBefore(this.lanIp)
              const ipBefore = getIpBefore(value)
              if (ipBefore === lanIpBefore || this.lanIp === value) {
                return false
              }
              return true
            },
            message: this.$t('trans0397'),
          },
        ],
        username: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 1, 16),
            message: this.$t('trans0003').format(this.$t('trans0053'), 1, 16),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0053'),
              this.$t('trans0042').format(specialChar),
            ),
          },
        ],
        password: [
          {
            rule: (value) => value,
            message: this.$t('trans0004'),
          },
          {
            rule: (value) => isValidLength(value, 1, 16),
            message: this.$t('trans0003').format(this.$t('trans0196'), 1, 16),
          },
          {
            rule: (value) => isValidSymbol(value),
            message: this.$t('trans0013').format(
              this.$t('trans0196'),
              this.$t('trans0042').format(specialChar),
            ),
          },
        ],
      },
    }
  },
  computed: {
    isVpnTypeL2tp() {
      return this.vpnForm.type === VpnType.l2tp
    },
    isVpnTypePptp() {
      return this.vpnForm.type === VpnType.pptp
    },
    statusText() {
      return this.isVpnTypeL2tp ? this.$t('trans0650') : this.$t('trans0657')
    },
    serverText() {
      return this.isVpnTypeL2tp ? this.$t('trans0651') : this.$t('trans0658')
    },
  },
  methods: {
    save() {
      if (this.$refs.vpnForm.validate()) {
        setVpn({
          type: this.vpnForm.type,
          enable: convertBooleanStatus(this.vpnForm.enable),
          server: this.vpnForm.server,
          username: this.vpnForm.username,
          password: this.vpnForm.password,
        }).then(() => {
          successTips()
          this.getVpnData()
        })
      }
    },
    changeVpnType() {
      if (!this.enableInitial) {
        return
      }
      let message = ''
      if (this.vpnTypeInitial == VpnType.pptp && this.isVpnTypeL2tp) {
        // pptp => l2tp
        message = this.$t('trans0659').format(this.$t('trans0657'), this.$t('trans0650'))
      } else if (this.vpnTypeInitial == VpnType.l2tp && this.isVpnTypePptp) {
        // l2tp => pptp
        message = this.$t('trans0659').format(this.$t('trans0650'), this.$t('trans0657'))
      }
      this.$dialog
        .info({
          okText: this.$t('trans0019'),
          message,
        })
        .then(() => {
          this.vpnForm.type = this.isVpnTypePptp ? VpnType.l2tp : VpnType.pptp
        })
    },
    getLanData() {
      getLan().then(({ data }) => {
        this.lanIp = data.lan.ip
      })
    },
    getVpnData() {
      getVpn().then(({ data }) => {
        this.vpnTypeInitial = this.vpnForm.type = data.type
        this.enableInitial = this.vpnForm.enable = convertBooleanStatus(data.enable)
        this.vpnForm.server = data.server
        this.vpnForm.username = data.username
        this.vpnForm.password = data.password
      })
    },
  },
  created() {
    this.getLanData()
    this.getVpnData()
  },
}
</script>
