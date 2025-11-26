<template>
  <div class="pagination" :class="{ 'pagination--disabled': disabled }" v-if="isShowOnlyOnePage">
    <div class="pagination__total" v-if="slots.total || showTotal">
      <slot name="total" v-if="slots.total"></slot>
      <template v-else-if="showTotal && total">
        {{ totalText }}
      </template>
    </div>
    <div class="pagination__main">
      <span
        @click="prev"
        class="pagination__item"
        :class="{ 'pagination__item--disabled': currentPage === 1 }"
        ><fh-icon name="icon-left"
      /></span>
      <span
        class="pagination__item"
        :class="{ 'pagination__item--active': val === currentPage }"
        v-for="val in list"
        :key="val"
        @click="jump(val)"
      >
        <template v-if="val !== ellipsis">{{ val }}</template>
        <fh-icon name="icon-ellipsis" v-else />
      </span>
      <span
        @click="next"
        class="pagination__item"
        :class="{ 'pagination__item--disabled': currentPage === pages }"
        ><fh-icon name="icon-right"
      /></span>
    </div>
    <fh-select
      class="pagination__select"
      v-model="currentPageSize"
      :options="pageSizeOpt"
      v-if="showSizeChanger"
    ></fh-select>
    <div class="pagination__jump" v-if="showQuickJumper">
      <span class="pagination__jump-text pagination__jump-text--left">{{
        $t('pagination.jump')
      }}</span>
      <fh-input @change="changePageJump" class="pagination__input" v-model="pageJump"></fh-input>
      <span class="pagination__jump-text pagination__jump-text--right">{{
        $t('pagination.page')
      }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots, watchEffect, watch, withDefaults } from 'vue'
import { isValidInteger } from '@fhtek-ui/utils/tool'
import { useI18n } from '@fhtek-ui/locale'

defineOptions({
  name: 'FhPagination',
})

export interface IPaginationProps {
  total?: number
  defaultPageSize?: number
  defaultCurrent?: number
  showTotal?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  disabled?: boolean
  pageSizeOptions?: number[]
}

export interface IPaginationEmits {
  (e: 'change', current: number, pageSize: number): void
}

const props = withDefaults(defineProps<IPaginationProps>(), {
  total: 0,
  defaultPageSize: 10,
  defaultCurrent: 1,
  showTotal: true,
  showSizeChanger: true,
  showQuickJumper: true,
  disabled: false,
  pageSizeOptions: () => [10, 20, 50, 100],
})

const { t } = useI18n()
const slots = useSlots()
const ellipsis = 'ellipsis'
const pageJump = ref('')
const currentPage = ref(props.defaultCurrent || 1)
const currentPageSize = ref(props.defaultPageSize || 10)

const pages = computed(() => Math.ceil(props.total / currentPageSize.value))
const isShowOnlyOnePage = computed(() => {
  if (!props.total) return false
  if (props.showSizeChanger && pages.value > 1) return true
  return pages.value > 1
})
const pageSizeOpt = computed(() => {
  const result = []
  for (let i = 0; i < props.pageSizeOptions.length; i++) {
    result.push({
      value: props.pageSizeOptions[i],
      text: t('pagination.pageSize', { items: props.pageSizeOptions[i] }),
    })
  }
  return result
})
const totalText = computed(() => {
  return t('pagination.total', { items: props.total })
})
const list = computed(() => {
  const result = []
  if (pages.value < 7) {
    for (let i = 1; i <= pages.value; i++) {
      result.push(i)
    }
  } else {
    if (currentPage.value < 5) {
      for (let i = 1; i <= 5; i++) {
        result.push(i)
      }
      result.push(ellipsis)
      result.push(pages.value)
    } else if (currentPage.value > pages.value - 5) {
      result.push(1)
      result.push(ellipsis)
      for (let i = pages.value - 4; i <= pages.value; i++) {
        result.push(i)
      }
    } else {
      result.push(1)
      result.push(ellipsis)
      for (let i = currentPage.value - 2; i <= currentPage.value + 2; i++) {
        result.push(i)
      }
      result.push(ellipsis)
      result.push(pages.value)
    }
  }
  return result
})

const emit = defineEmits<IPaginationEmits>()
watchEffect(() => {
  emit('change', currentPage.value, currentPageSize.value)
})
watch(currentPageSize, () => {
  currentPage.value = 1
})
watch(
  () => props.total,
  () => {
    currentPage.value = 1
  },
)

const prev = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const next = () => {
  if (currentPage.value < pages.value) {
    currentPage.value++
  }
}
const jump = (val: number | string) => {
  if (val !== ellipsis) {
    currentPage.value = val as number
    pageJump.value = ''
  }
}
const changePageJump = () => {
  if (!pageJump.value || !isValidInteger(pageJump.value, 1, pages.value)) {
    pageJump.value = ''
    return
  }
  jump(Number(pageJump.value))
}
</script>

<style lang="less">
.pagination {
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    > * {
      margin-top: 8px;
    }
    .pagination__jump {
      margin-left: 0;
    }
  }
  &.pagination--disabled {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.25);
  }
  .pagination__main {
    display: flex;
    align-items: center;
  }
  .pagination__item {
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
    width: 25px;
    height: 25px;
    border-radius: 4px;
    border: 1px solid transparent;
    &:hover {
      &:not(.pagination__item--active, .pagination__item--disabled) {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
    &.pagination__item--active {
      border-color: @primaryColor;
    }
    &.pagination__item--disabled {
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.25);
    }
  }
  .pagination__select {
    width: 120px;
  }
  .pagination__jump {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
  .pagination__input {
    width: 50px;
  }
  .pagination__jump-text--right {
    margin-left: 4px;
  }
  .pagination__jump-text--left {
    margin-right: 4px;
  }
}
</style>
