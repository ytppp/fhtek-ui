<template>
  <div v-bind="$attrs" class="display-form" :class="{ 'display-form-has-border': border }">
    <template v-for="(item, key, index) in data" :key="index">
      <div
        class="display-form__item"
        :class="{ 'is-stripe': hasStripe && (index + 1) % 2 === 0, 'is-hover': hasHover }"
      >
        <div class="display-form__label">{{ item.label }}{{ colonText }}</div>
        <div class="display-form__value">{{ item.value }}</div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from '@fhtek-ui/locale'

defineOptions({
  name: 'FhDescriptions',
})

export interface IDescriptionsProps {
  border?: boolean
  data: {
    [key: string]: {
      label: string
      value: string
      show?: boolean
    }
  }
  colon?: boolean
  stripe?: boolean
  hover?: boolean
}

const { t } = useI18n()
const {
  border = false,
  colon = true,
  stripe = true,
  hover = true,
} = defineProps<IDescriptionsProps>()

const hasColon = computed(() => {
  if (border) return false
  return colon
})
const colonText = computed(() => {
  return hasColon.value && t('colon')
})
const hasStripe = computed(() => {
  return border && stripe
})
const hasHover = computed(() => {
  return border && hover
})
</script>

<style lang="less">
.display-form {
  font-size: 16px;
  margin: 20px 0;
  @media screen and (max-width: 768px) {
    padding: 10px;
  }
  .display-form__item {
    display: flex;
    font-weight: 200;
    + .display-form__item {
      margin-top: 10px;
      @media screen and (max-width: 768px) {
        margin-top: 15px;
      }
    }
  }
  .display-form__label {
    width: 230px;
    text-align: right;
    padding-right: 30px;
    flex-shrink: 0;
    @media screen and (max-width: 768px) {
      width: 120px;
      padding-right: 20px;
    }
  }
  .display-form__value {
    width: 100%;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .display-form__empty {
    width: 350px;
    padding: 20px;
  }
  &.display-form-has-border {
    @media screen and (max-width: 768px) {
      padding: 0;
    }
    .display-form__item {
      &.is-stripe {
        background-color: #fafafa;
      }
      &.is-hover {
        &:hover {
          background-color: #f5f7fa;
        }
      }
      + .display-form__item {
        margin-top: 0;
        .display-form__label,
        .display-form__value {
          border-top: none;
        }
        @media screen and (max-width: 768px) {
          margin-top: 0;
        }
      }
    }
    .display-form__label,
    .display-form__value {
      padding-top: 12px;
      padding-bottom: 12px;
      border: 1px solid #c9c9c9;
    }
    .display-form__label {
      border-right: none;
    }
    .display-form__value {
      padding-left: 20px;
    }
  }
}
</style>
