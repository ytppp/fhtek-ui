<template>
  <div class="page">
    <div class="page__header">
      <h1 class="page__title">{{ $t('trans0188') }}</h1>
    </div>
    <div class="page__content">
      <fh-form class="form" :model="form">
        <fh-form-item :label="$t('trans0188')">
          <fh-switch v-model="form.enable" />
        </fh-form-item>
        <fh-form-item :label="$t('trans0239')">
          <fh-select v-model="form.level" :options="logLevelList" />
        </fh-form-item>
        <fh-form-item class="form__submit-btn">
          <fh-button @click="save" block>
            {{ $t('trans0002') }}
          </fh-button>
        </fh-form-item>
      </fh-form>
      <div class="log" v-if="enableInitial">
        <div class="log__header">
          <fh-button @click="backupSyslog">
            {{ $t('trans0241') }}
          </fh-button>
          <fh-button @click="reloadFrame">
            {{ $t('trans0240') }}
          </fh-button>
        </div>
        <div class="log__main">
          <pre>{{ previous }}</pre>
          <pre class="increase" :class="{ 'not-empty': increase }">{{ increase }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setLog, getLog, getSyslog, getLan } from '@/http/api'
import { useDataClean } from '@/hooks/data-clean'
import { http } from '@/http'
import { successTips } from '@/util/tool'

const { convertBooleanStatus } = useDataClean()
const LogLevel = {
  Emergency: '0',
  Alarm: '1',
  Importance: '2',
  Error: '3',
  Warning: '4',
  Note: '5',
  Notice: '6',
  Debug: '7',
}
export default {
  data() {
    return {
      form: {
        enable: false,
        level: LogLevel.Debug,
      },
      enableInitial: false,
      lanIp: '',
      previousArray: [],
      increaseArray: [],
      logLevelList: [
        {
          value: LogLevel.Emergency,
          text: this.$t('trans0231'),
        },
        {
          value: LogLevel.Alarm,
          text: this.$t('trans0232'),
        },
        {
          value: LogLevel.Importance,
          text: this.$t('trans0233'),
        },
        {
          value: LogLevel.Error,
          text: this.$t('trans0234'),
        },
        {
          value: LogLevel.Warning,
          text: this.$t('trans0235'),
        },
        {
          value: LogLevel.Note,
          text: this.$t('trans0236'),
        },
        {
          value: LogLevel.Notice,
          text: this.$t('trans0237'),
        },
        {
          value: LogLevel.Debug,
          text: this.$t('trans0238'),
        },
      ],
    }
  },
  computed: {
    previous() {
      return this.previousArray.join('\n')
    },
    increase() {
      return this.increaseArray.join('\n')
    },
  },
  methods: {
    save() {
      setLog({
        enable: convertBooleanStatus(this.form.enable),
        level: this.form.level,
      }).then(() => {
        successTips()
        this.getLogData()
      })
    },
    getSyslogData() {
      return getSyslog().then(({ data }) => {
        if (data && data.cfg_name) {
          return data.cfg_name
        }
        throw reject(new Error('No log file found'))
      })
    },
    downloadFile(logFile, data) {
      const blob = new Blob([data], { type: 'application/octet-stream' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = logFile
      downloadElement.click()
      URL.revokeObjectURL(href)
    },
    backupSyslog() {
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message: this.$t('trans0391'),
        })
        .then(() => {
          this.getSyslogData().then((logFile) => {
            http
              .download(`/${logFile}?t=${Date.now()}`, undefined, { baseURL: '' })
              .then((data) => {
                this.downloadFile(logFile, data)
              })
          })
        })
        .catch(() => {})
    },
    reloadFrame() {
      this.getSyslogData().then((logFile) => {
        http.get(`/${logFile}?t=${Date.now()}`, undefined, { baseURL: '' }).then((data) => {
          const preArray = [...this.previousArray, ...this.increaseArray]
          this.getIncremental(preArray, data)
        })
      })
    },
    getIncremental(preArray, nowStr) {
      const nowArray = nowStr.split('\n').filter((n) => n !== '')
      if (!preArray.length) {
        this.previousArray = []
        this.increaseArray = nowArray
      } else {
        const preStart = preArray[0]
        const preEnd = preArray[preArray.length - 1]
        // 全包含
        if (nowArray.includes(preStart) && nowArray.includes(preEnd)) {
          // this.previousArray = preArray
          // const index = nowArray.lastIndexOf(preEnd)
          // this.increaseArray = nowArray.slice(index + 1)
        } else {
          // 部分包含,首先找到包含的起始位置
          const index = nowArray.lastIndexOf(preEnd)
          if (index === -1) {
            this.previousArray = preArray
            this.increaseArray = nowArray
          } else {
            this.previousArray = preArray
            this.increaseArray = nowArray.slice(index + 1)
          }
        }
      }
      this.$nextTick(() => {
        const el = this.$el.querySelector('.increase')
        const wrap = this.$el.querySelector('.log__main')
        if (el && wrap) this.scrollTo(wrap, 0, el.offsetTop)
      })
    },
    scrollTo(el, x = 0, y = 0) {
      if (el.scrollTo) {
        el.scrollTo(x, y)
      } else {
        el.scrollLeft = x
        el.scrollTop = y
      }
    },
    getLogData() {
      getLog().then(({ data }) => {
        this.enableInitial = this.form.enable = convertBooleanStatus(data.enable)
        this.form.level = data.level
        if (this.form.enable) {
          this.previousArray = []
          this.increaseArray = []
          this.reloadFrame()
        }
      })
    },
    getLanData() {
      getLan().then(({ data }) => {
        const { lan } = data
        const { ip } = lan
        this.lanIp = ip
      })
    },
  },
  mounted() {
    this.getLanData()
    this.getLogData()
  },
}
</script>

<style lang="less">
.log {
  border-top: 1px solid #c9c9c9;
  padding-top: 20px;
  margin-top: 20px;
  .log__header {
    font-size: 0;
    .btn {
      height: 40px !important;
      margin-right: 5px;
    }
  }
  .log__header-select {
    width: 245px;
    display: inline-block;
    @media screen and (max-width: 768px) {
      margin-top: 5px;
    }
  }
  .log__main {
    margin-top: 20px;
    border-radius: 4px;
    border: solid 1px #bdbdbd;
    padding: 10px;
    max-height: 600px;
    overflow-x: hidden;
    font-size: 14px;
    pre {
      font-family: 'Courier New', Courier, monospace;
      color: #000;
      white-space: pre-wrap;
      word-wrap: break-word;
      &:first-child {
        color: #ccc;
      }
    }
  }
}
</style>
