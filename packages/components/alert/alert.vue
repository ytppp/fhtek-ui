<template>
  <transition name="alert-fade">
    <div
      class="alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-if="visible"
    >
      <fh-icon class="alert__icon" :class="[isBigIcon]" :name="iconClass" v-if="showIcon"></fh-icon>
      <div class="alert__content">
        <span
          class="alert__title"
          :class="[isBoldTitle]"
          v-if="title || $slots.title"
          :style="`${$slots.default || description ? 'margin-bottom: 5px;' : ''}`"
        >
          <slot name="title">{{ title }}</slot>
        </span>
        <div class="alert__description" v-if="$slots.default && !description">
          <slot></slot>
        </div>
        <p class="alert__description" v-if="!$slots.default && description">
          {{ description }}
        </p>
        <template v-if="closable">
          <i class="alert__closebtn is-customed" @click="close()" v-if="closeText">
            {{ closeText }}
          </i>
          <fh-icon class="alert__closebtn" @click="close()" name="icon-circle-close" v-else>
          </fh-icon>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref, withDefaults, useSlots } from 'vue'
import FhIcon from '@fhtek-ui/components/icon'

defineOptions({
  name: 'FhAlert',
})

type AlertIconType = 'success' | 'warning' | 'error' | 'info'
type AlertEffectType = 'light' | 'dark'

export interface IAlertProps {
  title?: string
  description?: string
  type?: AlertIconType
  closable?: boolean
  center?: boolean
  closeText?: string
  showIcon?: boolean
  effect?: AlertEffectType
}

// Emits 类型
export interface IAlertEmits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<IAlertProps>(), {
  title: '',
  description: '',
  type: 'success',
  closable: false,
  center: true,
  closeText: '',
  showIcon: true,
  effect: 'light',
})
const emit = defineEmits<IAlertEmits>()

const visible = ref<boolean>(false)
const slots = useSlots()

const typeClass = computed(() => {
  return `alert--${props.type}`
})
const iconClass = computed(() => {
  return `icon-${props.type || 'info'}`
})
const isBigIcon = computed(() => {
  return props.description || slots.default ? 'is-big' : ''
})
const isBoldTitle = computed(() => {
  return props.description || slots.default ? 'is-bold' : ''
})

const close = () => {
  visible.value = false
  emit('close')
}
</script>

<style lang="less">
.alert {
  width: 100%;
  padding: 8px 16px;
  margin: 0;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  background-color: #fff;
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: flex-start;
  transition: opacity 0.2s;
  &.is-light {
    .alert__closebtn {
      color: #c0c4cc;
    }
  }
  &.is-dark {
    .alert__closebtn {
      color: #fff;
    }
    .alert__description {
      color: #fff;
    }
  }
  &.is-center {
    justify-content: center;
  }
  &.alert--success {
    &.is-light {
      background-color: #f0f9eb;
      .alert__icon {
        color: #67c23a;
      }
      .alert__title,
      .alert__description {
        color: #909399;
      }
    }
    &.is-dark {
      background-color: #67c23a;
      color: #fff;
    }
  }
  &.alert--info {
    &.is-light {
      background-color: #f4f4f5;
      color: #909399;
    }
    &.is-dark {
      background-color: #909399;
      color: #fff;
    }
  }
  &.alert--warning {
    &.is-light {
      background-color: #fdf6ec;
      .alert__icon {
        color: #e6a23c;
      }
      .alert__title,
      .alert__description {
        color: #909399;
      }
    }
    &.is-dark {
      background-color: #e6a23c;
      color: #fff;
    }
  }
  &.alert--error {
    &.is-light {
      background-color: #fef0f0;
      .alert__icon {
        color: #f56c6c;
      }
      .alert__title,
      .alert__description {
        color: #909399;
      }
    }
    &.is-dark {
      background-color: #f56c6c;
      color: #fff;
    }
  }
  .alert__content {
    display: table-cell;
    padding: 0 8px;
  }
  .alert__icon {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    &.is-big {
      width: 24px;
      height: 24px;
    }
  }
  .alert__title {
    display: inline-block;
    font-size: 13px;
    line-height: 18px;
    .is-bold {
      font-weight: bold;
    }
  }
  .alert__description {
    font-size: 12px;
    margin: 0;
  }
  .alert__closebtn {
    font-size: 12px;
    opacity: 1;
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer;
    &.is-customed {
      font-style: normal;
      font-size: 13px;
      top: 9px;
    }
  }
  &.alert-fade-enter,
  &.alert-fade-leave-active {
    opacity: 0;
  }
}
</style>
