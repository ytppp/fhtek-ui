<template>
  <div class="loading">
    <div class="loading__spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
    </div>
    <div v-if="title" class="loading__title">{{ title }}</div>
    <div v-if="tip" class="loading__tip">{{ tip }}</div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'

defineOptions({
  name: 'FhLoading',
})

export interface ILoadingProps {
  title?: string
  tip?: string
}

withDefaults(defineProps<ILoadingProps>(), {
  title: '',
  tip: '',
})
</script>

<style lang="less">
.loading {
  box-sizing: border-box;
  text-align: center;
  background: #fff;
  padding: 20px 20px 30px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 @loading-box-shadow-color;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
  .loading__spinner {
    .circular {
      height: 42px;
      width: 42px;
      animation: loading-rotate 2s linear infinite;
    }
    .path {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 4;
      stroke: @primaryColor;
      stroke-linecap: round;
    }
  }
  .loading__title,
  .loading__tip {
    margin-top: 10px;
    color: @loading-text-color;
  }
  .loading__title {
    font-size: 24px;
  }
  .loading__tip {
    font-size: 18px;
  }
  @keyframes loading-rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes loading-dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40px;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120px;
    }
  }
}
</style>
