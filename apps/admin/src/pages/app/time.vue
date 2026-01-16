<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0247') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" ref="form" :model="form" :rules="rules">
        <fh-form-item :label="$t('trans0275')">
          <fh-switch v-model="form.enable"></fh-switch>
        </fh-form-item>
        <template v-if="form.enable">
          <fh-form-item :label="$t('trans0276')" v-if="systemTime">
            {{ systemTime }}
          </fh-form-item>
          <fh-form-item :label="$t('trans0277')">
            <fh-select v-model="form.masterSntpServer" :options="ntpServerList"> </fh-select>
          </fh-form-item>
          <fh-form-item prop="otherMasterSntpServer" v-if="isOtherMaster">
            <fh-input
              v-model="form.otherMasterSntpServer"
              :placeholder="$t('trans0356')"
            ></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0278')">
            <fh-select v-model="form.slaveSntpServer" :options="slaveNtpServerList"> </fh-select>
          </fh-form-item>
          <fh-form-item prop="otherSlaveSntpServer" v-if="isOtherSlave">
            <fh-input v-model="form.otherSlaveSntpServer" :placeholder="$t('trans0356')"></fh-input>
          </fh-form-item>
          <fh-form-item :label="$t('trans0279')">
            <fh-select v-model="form.timezone" :options="timezoneList" @change="changeTimezone">
            </fh-select>
          </fh-form-item>
        </template>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
        <fh-form-item>
          <fh-alert type="info" :title="$t('trans0121')" show-icon :center="false" />
        </fh-form-item>
      </fh-form>
    </div>
  </div>
</template>

<script>
import { translate } from '@/i18n/index'
import timezoneArr from '@/i18n/locales/timezone'
import { getSysTime, getTime, setTime } from '@/http/api'
import { Weeks } from '@/util/constant'
import { useDataClean } from '@/hooks/data-clean'
import { locale } from '@/i18n/index'
import { successTips } from '@/util/tool'

const ntpServers = [
  '0.openwrt.pool.ntp.org',
  '1.openwrt.pool.ntp.org',
  '2.openwrt.pool.ntp.org',
  '3.openwrt.pool.ntp.org',
  'clock.fmt.he.net',
  'clock.nyc.he.net',
  'clock.sjc.he.net',
  'clock.via.net',
  'ntp1.tummy.com',
  'time.cachenetworks.com',
  'time.nist.gov',
]
const other = 'Other'
const none = 'None'
const ntpServerList = ntpServers.map((val) => ({
  value: val,
  text: val,
}))
ntpServerList.push({
  value: other,
  text: translate('trans0355'),
})
const timezoneList = Object.entries(timezoneArr).map(([coutry, timezoneItem]) => {
  return {
    value: `${timezoneItem.id}`,
    text: `(${timezoneItem.timezone}) ${translate(coutry)}`,
    zonename_openwrt: timezoneItem.zonename_openwrt,
    timezone_openwrt: timezoneItem.timezone_openwrt,
  }
})
const { convertBooleanStatus } = useDataClean()
export default {
  name: 'TimePage',
  data() {
    return {
      form: {
        enable: false,
        masterSntpServer: ntpServerList[0].value,
        otherMasterSntpServer: '',
        slaveSntpServer: ntpServerList[0].value,
        otherSlaveSntpServer: '',
        timezone: timezoneList[0].value,
        zonename_openwrt: timezoneList[0].zonename_openwrt,
        timezone_openwrt: timezoneList[0].timezone_openwrt,
      },
      zonename_openwrt_initial: timezoneList[0].zonename_openwrt,
      systemTime: '',
      currTime: '',
      timer: null,
      timezoneList,
      ntpServerList,
      rules: {
        otherMasterSntpServer: [
          {
            rule: (value) => {
              if (this.isOtherMaster) {
                return value
              } else {
                return true
              }
            },
            message: this.$t('trans0004'),
          },
        ],
        otherSlaveSntpServer: [
          {
            rule: (value) => {
              if (this.isOtherSlave) {
                return value
              } else {
                return true
              }
            },
            message: this.$t('trans0004'),
          },
        ],
      },
      schedules: {
        [Weeks.sun]: this.$t('trans0663'),
        [Weeks.mon]: this.$t('trans0515'),
        [Weeks.tue]: this.$t('trans0525'),
        [Weeks.wed]: this.$t('trans0526'),
        [Weeks.thu]: this.$t('trans0527'),
        [Weeks.fri]: this.$t('trans0600'),
        [Weeks.sat]: this.$t('trans0601'),
      },
    }
  },
  computed: {
    isOtherMaster() {
      return this.form.masterSntpServer === other
    },
    isOtherSlave() {
      return this.form.slaveSntpServer === other
    },
    slaveNtpServerList() {
      return [
        {
          value: none,
          text: this.$t('trans0357'),
        },
        ...ntpServerList,
      ]
    },
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        if (this.isOtherMaster) {
          this.form.ntpServerOther1Flag = this.form.otherMasterSntpServer
        } else {
          this.form.ntpServerOther1Flag = this.form.masterSntpServer
        }
        if (this.isOtherSlave) {
          this.form.ntpServerOther2Flag = this.form.otherSlaveSntpServer
        } else {
          this.form.ntpServerOther2Flag = this.form.slaveSntpServer
        }
        setTime({
          enable: convertBooleanStatus(this.form.enable),
          timezone_id: this.form.timezone,
          zonename: this.form.zonename_openwrt,
          timezone: this.form.timezone_openwrt,
          sntpServer: [
            this.isOtherMaster ? this.form.otherMasterSntpServer : this.form.masterSntpServer,
            this.isOtherSlave ? this.form.otherSlaveSntpServer : this.form.slaveSntpServer,
          ],
        }).then(() => {
          successTips()
          this.getTimeData()
        })
      }
    },
    getTimeData() {
      getTime().then(({ data }) => {
        this.form.enable = convertBooleanStatus(data.enable)
        this.form.timezone = data.timezone_id
        this.changeTimezone()
        this.zonename_openwrt_initial = this.form.zonename_openwrt
        let isExist = false
        isExist = this.ntpServerList.some((item) => item.value === data.sntpServer[0])
        if (isExist) {
          this.form.masterSntpServer = data.sntpServer[0]
        } else {
          this.form.masterSntpServer = other
          this.form.otherMasterSntpServer = data.sntpServer[0]
        }
        isExist = this.slaveNtpServerList.some((item) => item.value === data.sntpServer[1])
        if (isExist) {
          this.form.slaveSntpServer = data.sntpServer[1]
        } else {
          this.form.slaveSntpServer = other
          this.form.otherSlaveSntpServer = data.sntpServer[1]
        }
        this.getSysTimeData()
      })
    },
    getSysTimeData() {
      const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: this.zonename_openwrt_initial,
        dateStyle: 'full',
        timeStyle: 'medium',
      })
      this.clearTimer()
      getSysTime().then(({ data }) => {
        this.currTime = Number(data.sysTime)
        this.systemTime = formatter.format(this.currTime)
        this.timer = setInterval(() => {
          this.currTime += 1000
          this.systemTime = formatter.format(this.currTime)
        }, 1000)
      })
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    changeTimezone() {
      const thisTimezoneItem = this.timezoneList.find((item) => item.value === this.form.timezone)
      this.form.zonename_openwrt = thisTimezoneItem.zonename_openwrt
      this.form.timezone_openwrt = thisTimezoneItem.timezone_openwrt
    },
  },
  created() {
    this.getTimeData()
  },
  beforeUnmount() {
    this.clearTimer()
  },
}
</script>
