<template>
  <div class="steps">
    <div class="steps__main">
      <div
        class="step"
        :class="{
          'is-fail': !step.success && index <= option.current,
          'is-success': step.success && index <= option.current,
        }"
        v-for="(step, index) in option.steps"
        :key="index"
      >
        <div class="step__main">
          <div class="step__number">
            <span v-show="(index === option.current && step.success) || index !== option.current">
              {{ index + 1 }}
            </span>
          </div>
          <div class="step__text">{{ step.text }}</div>
        </div>
      </div>
    </div>
    <div class="steps__line">
      <div class="steps__line--steped" :style="{ width: width }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FhStep',
  props: {
    option: {
      type: Object,
    },
  },
  data() {
    return {
      preLength: this.option.steps.length,
    }
  },
  computed: {
    width() {
      return `${(this.option.current * 100) / (this.length - 1)}%`
    },
    length() {
      return this.option.steps.length
    },
  },
  watch: {
    option: {
      handler(nv) {
        if (nv.steps.length !== this.preLength) {
          this.layout()
        }
      },
      deep: true,
    },
  },
  methods: {
    layout() {
      this.$nextTick(() => {
        const width = this.$el.clientWidth
        const stepItems = this.$el.querySelectorAll('.step')
        const stepItemArr = Array.from(stepItems)
        const stepItemWidth = stepItemArr.reduce((sum, current) => {
          sum += current.clientWidth
          return sum
        }, 0)
        const perOffset = ((width - stepItemWidth) / (this.length - 1) / width) * 100
        stepItemArr.forEach((step, index) => {
          step.style.left = `${(perOffset * index).toFixed(2)}%`
        })
        this.preLength = this.length
      })
    },
  },
  mounted() {
    this.layout()
    window.addEventListener('resize', this.layout)
  },
  beforeDestory() {
    window.removeEventListener('resize', this.layout)
  },
}
</script>

<style lang="less">
.steps {
  height: 36px;
  position: relative;
  .steps__line {
    height: 2px;
    background: @step-line-color;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    z-index: 0;
    .steps__line--steped {
      background: @step-item-steped-background-color;
      height: 2px;
    }
  }
  .steps__main {
    width: 100%;
    display: flex;
    position: relative;
    z-index: 1;
    .step {
      position: absolute;
      display: flex;
      top: 0;
      position: relative;
      justify-content: center;
      align-items: center;
      &:first-child {
        justify-content: flex-start;
        .step-text {
          text-align: center;
        }
      }
      &:last-child {
        justify-content: flex-end;
        .step-text {
          text-align: center;
        }
      }
      .step__main {
        display: flex;
        justify-content: center;
        text-align: center;
        position: relative;
      }
      .step__number {
        border-radius: 50%;
        border: 1px solid @step-item-border-color;
        text-align: center;
        width: 36px;
        height: 36px;
        line-height: 36px;
        font-weight: bold;
        font-size: 24px;
        color: @step-item-color;
        background: @step-background-color;
      }
      .step__text {
        text-align: center;
        font-size: 12px;
        color: @step-item-text-color;
        position: absolute;
        left: 50%;
        top: 46px;
        min-width: 50px;
        transform: translateX(-50%);
      }
      &.is-fail {
        .step__number {
          background: @step-item-failed-background-color;
          border-color: @step-item-failed-border-color;
          color: @step-item-failed-color;
          position: relative;
          &::before {
            content: 'x';
            display: block;
            color: @step-item-failed-icon-color;
            font-style: normal;
            font-size: 24px;
          }
        }
      }
      &.is-success {
        .step__number {
          background: @step-item-success-background-color;
          border-color: @step-item-success-border-color;
          color: @step-item-success-color;
        }
      }
    }
  }
  @media screen and(max-width: 768px) {
    .steps__line {
      width: auto;
      left: 20px;
      right: 20px;
    }
    .steps__main {
      .step {
        .step__text {
          font-size: 12px;
          width: 80px;
        }
      }
    }
  }
}
</style>
