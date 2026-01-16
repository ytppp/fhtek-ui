<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0248') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules">
        <!-- 1: router 2: bridge  -->
        <!-- 1: ipv4 2: ipv6 3: ipv4/ipv6 -->
        <fh-form-item :label="statusText">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="isRoute">
          <template v-if="isEnable">
            <fh-form-item :label="versionText">
              <fh-select v-model="form.igmpversion" :options="versionList" name="IGMPPV">
              </fh-select>
            </fh-form-item>
            <!-- <fh-form-item v-for="(item, name) in FormDataRange" :prop="name" :label="$t(item.label)">
                    <fh-input :name="name" v-model="form[name]"></fh-input>
                    <template #extra>
                      {{eval(`${name}Tips`)}}
                    </template>
                  </fh-form-item> -->
          </template>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { IP, WanMode } from '@/util/constant'
import { isValidInteger } from '@/util/tool'

const Version = {
  v2: '2',
  v3: '3',
}
const FormDataRange = {
  robustness: {
    min: 1,
    max: 7,
    default: 2,
    unit: '',
    label: 'trans0381',
  },
  queryInterval: {
    min: 30,
    max: 300,
    default: 125,
    unit: 'trans0488',
    label: 'trans0382',
  },
  queryResInterval: {
    min: 1,
    max: 60,
    default: 1,
    unit: 'trans0488',
    label: 'trans0383',
  },
  lastMemQueryInterval: {
    min: 1,
    max: 5,
    default: 1,
    unit: 'trans0488',
    label: 'trans0384',
  },
  unsolicitedReportInterval: {
    min: 1,
    max: 6,
    default: 1,
    unit: 'trans0488',
    label: 'trans0385',
  },
}
export default {
  name: 'igmpMldPage',
  data() {
    return {
      wanInfo: {
        ifName: '',
        ipType: '',
        mode: '',
      },
      wanOptions: [],
      form: {
        enable: true,
        igmpversion: Version.v2,
        robustness: FormDataRange.robustness.default,
        queryInterval: FormDataRange.queryInterval.default,
        queryResInterval: FormDataRange.queryResInterval.default,
        lastMemQueryInterval: FormDataRange.lastMemQueryInterval.default,
        unsolicitedReportInterval: FormDataRange.unsolicitedReportInterval.default,
      },
      versionList: [
        {
          value: Version.v2,
          text: 'V2',
        },
        {
          value: Version.v3,
          text: 'V3',
        },
      ],
      FormDataRange,
      rules: {
        ...(() => {
          const result = {}
          Object.keys(FormDataRange).forEach((key) => {
            const item = FormDataRange[key]
            result[key] = [
              {
                rule: (value) => value,
                message: this.$t('trans0004'),
              },
              {
                rule: (value) => isValidInteger(value, item.min, item.max),
                message: this.$t('trans0388').format(
                  `'${this.$t(item.label)}'`,
                  item.min,
                  item.max,
                ),
              },
            ]
          })
          return result
        })(),
      },
    }
  },
  computed: {
    ...(() => {
      const result = {}
      Object.keys(FormDataRange).forEach((key) => {
        const item = FormDataRange[key]
        result[`${key}Tips`] = function temp() {
          let tipsText = ''
          if (item.min && item.max) {
            tipsText += `${this.$t('trans0380')}: ${item.min} - ${item.max}`
          }
          if (item.default) {
            tipsText += `; ${this.$t('trans0632')}: ${item.default}`
          }
          if (item.unit) {
            tipsText += `; ${this.$t('trans0498')}: ${this.$t(item.unit)}`
          }
          return tipsText
        }
      })
      return result
    })(),
    isEnable() {
      if (this.isBridge || this.isIPv6) {
        return false
      }
      if (this.isRoute) {
        return this.form.enable
      }
    },
    isIPv4() {
      return this.wanInfo.ipType === IP.IPv4
    },
    isIPv6() {
      return this.wanInfo.ipType === IP.IPv6
    },
    isMix() {
      return this.wanInfo.ipType === IP.mix
    },
    isBridge() {
      return this.wanInfo.mode === WanMode.bridge
    },
    isRoute() {
      return this.wanInfo.mode === WanMode.route
    },
    type() {
      let text = ''
      if (this.isIPv4) {
        text = this.$t('trans0375')
      }
      if (this.isIPv6) {
        text = this.$t('trans0376')
      }
      if (this.isMix) {
        text = this.$t('trans0377')
      }
      return text
    },
    mode() {
      let mode = ''
      if (this.isBridge) {
        mode = this.$t('trans0387') // snopp
      }
      if (this.isRoute) {
        mode = this.$t('trans0386') // proxy
      }
      return mode
    },
    statusText() {
      if (this.isBridge) {
        return this.$t('trans0387') // snopp
      }
      return `${this.type} ${this.mode}`
    },
    versionText() {
      return `${this.type} ${this.mode} ${this.$t('trans0379')}`
    },
    isIPv4Route() {
      return this.isIPv4 && this.isRoute
    },
    isIPv4Bridge() {
      return this.isIPv4 && this.isBridge
    },
    isIPv6Route() {
      return this.isIPv6 && this.isRoute
    },
    isIPv6Bridge() {
      return this.isIPv6 && this.isBridge
    },
    isMixRoute() {
      return this.isMix && this.isRoute
    },
    isMixBridge() {
      return this.isMix && this.isBridge
    },
  },
  methods: {
    save() {
      if (this.isRoute) {
        this.form.mode_Flag = '1'
      } else {
        this.form.mode_Flag = '2'
      }
      if (this.isIPv4) {
        this.form.ip_Flag = '1'
      } else if (this.isIPv6) {
        this.form.ip_Flag = '2'
      } else {
        this.form.ip_Flag = '3'
      }
      if (this.isEnable) {
        if (this.$refs.form.validate()) {
          this.loadingBeforeAction(() => {
            this.submit('form')
          })
        }
      } else {
        this.loadingBeforeAction(() => {
          this.submit('form')
        })
      }
    },
  },
  created() {
    // this.wanInfo = wanInfo
    // if (this.isIPv4Route || this.isMixRoute) {
    //   this.form.enable = igmpproxy_active
    //   this.form.igmpversion = igmpproxy_igmpversion
    //   this.form.robustness = igmpproxy_robustness
    //   this.form.queryInterval = igmpproxy_queryInterval
    //   this.form.queryResInterval = igmpproxy_queryResInterval
    //   this.form.lastMemQueryInterval = igmpproxy_lastMemQueryInterval
    //   this.form.unsolicitedReportInterval = igmpproxy_unsolicitedReportInterval
    // }
    // if (this.isIPv4Bridge || this.isMixBridge) {
    //   this.form.enable = igmpsnoop_active
    // }
    // if (this.isIPv6) {
    //   this.form.enable = mldproxy_active
    // }
  },
}
</script>
