<template>
  <fh-popup ref="popupRef" :is-manual="true">
    <div class="upgrade">
      <img v-if="url" class="upgrade__img" :src="url" alt="" />
      <div v-if="title" class="upgrade__title">{{ title }}</div>
      <div v-if="tip" class="upgrade__tip" v-html="tip"></div>
      <!-- 升级进度条 -->
      <div class="progress" v-if="progressVisible">
        <div class="progress__main">
          <div class="progress__bar" :style="styles">
            <span class="progress__text">{{ percentText }}</span>
          </div>
        </div>
      </div>
    </div>
  </fh-popup>
</template>

<script lang="ts">
import { ref, reactive, computed, defineComponent, onMounted } from 'vue'
import { useCountDown } from '@/hooks/countdown'
import { getUpgradeStatus } from '@/http/api'
import FhPopup from '@/components/popup/popup.vue'

export default defineComponent({
  name: 'FhUpgrade',
  components: {
    FhPopup,
  },
  props: {
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    tip: {
      type: String,
      default: '',
    },
    timeout: {
      type: Number,
      default: 120000,
    },
    interval: {
      type: Number,
      default: 1000,
    },
    progressVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['hide'],
  setup(props, { emit }) {
    const timer = ref<number | undefined>(undefined)
    const average = 100 / (props.timeout / props.interval)
    const reqFreq = 5000
    const percent = ref(0)
    const styles = reactive({
      width: 0,
    })
    const percentText = computed(() => `${parseInt(percent.value)}%`)
    const doingHandle = (countdown: number) => {
      percent.value = Math.min(100, percent.value + average)
      styles.width = `${percent.value}%`
      if (!(countdown % reqFreq)) {
        getUpgradeStatus().then(({ data }) => {
          const { upgradestatus } = data
          if (upgradestatus === 0) {
            cleanCountDown()
          }
        })
      }
    }
    const doneHandle = () => {
      timer.value = setTimeout(() => {
        clearTimeout(timer.value)
        timer.value = undefined
        emit('hide')
      }, 310)
    }
    const { createCountDown, cleanCountDown } = useCountDown(
      props.timeout,
      props.interval,
      doingHandle,
      doneHandle,
    )
    onMounted(() => {
      createCountDown()
    })
    return {
      percentText,
      styles,
    }
  },
})
</script>

<style lang="less">
.upgrade {
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  padding: 20px 20px 30px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
  .upgrade__img {
    width: 120px;
  }
  .upgrade__title {
    font-size: 24px;
    // margin-top: 10px;
    color: #333;
  }
  .upgrade__tip {
    color: #333;
    display: block;
    margin-top: 10px;
    max-width: 400px;
    font-size: 16px;
  }
}

.progress {
  margin-top: 20px;
  width: 300px;
  display: inline-block;
  .progress__main {
    height: 14px;
    background: @progress-background-color;
    border-radius: 50px;
    overflow: hidden;
  }
  .progress__bar {
    float: left;
    width: 0;
    height: 100%;
    border-radius: 50px;
    font-size: 12px;
    max-width: 100%;
    line-height: 20px;
    overflow: hidden;
    color: @progress-bar-color;
    text-align: center;
    background-color: #00d061;
    transition: width 1s ease;
    position: relative;
  }
  .progress__text {
    color: #fff;
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8px;
  }
}
</style>
