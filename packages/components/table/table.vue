<template>
  <div class="table">
    <div class="table__header" v-if="showHeader">
      <div class="table__filter-group" v-if="slots.filtergroup">
        <slot name="filtergroup"></slot>
      </div>
      <div class="table__title" v-if="isShowTitle">
        <template v-if="title"> {{ title }} </template>
        <slot name="title" v-else></slot>
      </div>
      <div class="table__operation-group" v-if="slots.operationgroup">
        <slot name="operationgroup"></slot>
      </div>
    </div>
    <div class="table__header" v-if="showSearch">
      <div class="table__filter-group">
        <fh-input
          v-model="filterInputVal"
          :placeholder="$t('table.searchContent')"
          class="table__header-search-input"
        ></fh-input>
        <fh-icon
          class="page__header-icon"
          @click="search"
          name="icon-search"
          :title="$t('table.search')"
        />
      </div>
    </div>
    <div class="table__main" ref="tableWrap" @scroll="() => handleScroll()">
      <table
        cellspacing="0"
        cellpadding="0"
        border="0"
        ref="scrollTable"
        class="table-main"
        :class="{ 'is-border': bordered || headerRowsMaxLevel > 1 }"
      >
        <thead class="table-main__header" v-if="showTableHeader">
          <tr class="table-main__header-row" v-for="(row, rowIndex) in headerRows" :key="rowIndex">
            <template v-for="(col, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
              <th
                class="table-main__cell"
                :style="cellStyle(col)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="headerColRefs"
                v-if="col.key === 'checkbox'"
              ></th>
              <th
                class="table-main__cell"
                :style="cellStyle(col)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="headerColRefs"
                v-else-if="col.key === 'index'"
              >
                {{ $t('table.index') }}
              </th>
              <th
                class="table-main__cell"
                :style="cellStyle(col)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="headerColRefs"
                v-else-if="col.key === 'operation'"
              >
                {{ $t('operation') }}
              </th>
              <th
                class="table-main__cell"
                :title="col.title"
                :style="cellStyle(col)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                ref="headerColRefs"
                v-else
              >
                {{ col.title }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="table-main__content">
          <template v-if="displayDataSource.length">
            <tr
              v-for="(item, index) in displayDataSource"
              :key="index"
              class="table-main__content-row"
              :class="{
                'is-stripe': stripe && (index + 1) % 2 === 0,
                'is-hover': hover,
              }"
              @click="() => clickRow(item)"
            >
              <template v-for="(col, colIndex) in columnsFlattened" :key="col.key">
                <td
                  class="table-main__cell"
                  :style="cellStyle(col)"
                  :id="`content_cell_${index}_${colIndex}_ref`"
                  v-if="col.key === 'checkbox'"
                >
                  <fh-checkbox
                    name="table-checkbox"
                    :checked="selectedRow.includes(item)"
                    @change="(val: boolean) => select(val, item)"
                  />
                </td>
                <td
                  class="table-main__cell"
                  :style="cellStyle(col)"
                  :id="`content_cell_${index}_${colIndex}_ref`"
                  v-else-if="col.key === 'index'"
                >
                  {{ index + 1 }}
                </td>
                <td
                  class="table-main__cell"
                  :style="cellStyle(col)"
                  :id="`content_cell_${index}_${colIndex}_ref`"
                  v-else-if="col.key === 'operation'"
                >
                  <slot name="operation" :row="item"></slot>
                </td>
                <td
                  class="table-main__cell"
                  :title="item[col.key]"
                  :style="cellStyle(col)"
                  :id="`content_cell_${index}_${colIndex}_ref`"
                  v-else
                >
                  <slot :name="col.key" :row="item">
                    {{ cellContent(item, col.key) }}
                  </slot>
                </td>
              </template>
            </tr>
          </template>
          <tr class="table-main__content-row empty-row" v-else>
            <td class="empty-row__cell" :colspan="columnsFlattened.length">
              {{ $t('noData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="table__pagination" v-if="showPagination">
      <fh-pagination
        :total="dataSource.length"
        :default-current="pagination.current"
        :default-pageSize="pagination.pageSize"
        @change="changePagination"
      ></fh-pagination>
    </div>
    <div class="table__footer" v-if="footer || slots.footer">
      <template v-if="footer"> {{ footer }} </template>
      <slot name="footer" v-else></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, withDefaults, useSlots, watch, onMounted, useTemplateRef } from 'vue'
import { extractDimension, flatten, findObjectsWithValue } from './table-util'
import {
  DefaultVal,
  Fixed,
  type TableColumn,
  type DataTableProps,
  type TableEmits,
  type align,
} from './interface'

defineOptions({
  name: 'FhTable',
})

const props = withDefaults(defineProps<DataTableProps>(), {
  title: '',
  footer: '',
  showRowCheckbox: false,
  showIndex: false,
  showPagination: false,
  showSearch: false,
  stripe: true,
  bordered: false,
  hover: true,
  showTableHeader: true,
  align: 'center',
  // pagination: () => ({
  //   current: 1,
  //   pageSize: 20,
  // }),
})
const slots = useSlots()
const selectedRow = ref<any[]>([])
const headerColRefs = ref<HTMLTableCellElement[]>([])
const tableWrap = useTemplateRef('tableWrap')
const isScrollLeft = ref(false)
const isScrollRight = ref(false)
const lastScrollLeft = ref(0)
const filterInputVal = ref('')
const filterVal = ref('')
const pagination = ref({
  current: 1,
  pageSize: 20,
})

const displayDataSource = computed(() => {
  let data = props.dataSource
  if (props.showSearch) {
    data = findObjectsWithValue(props.dataSource, filterVal.value)
  }
  if (props.showPagination) {
    const { current = 1, pageSize = 20 } = pagination.value
    const start = (current - 1) * pageSize
    const end = current * pageSize
    data = data.slice(start, end)
  }
  return data
})

const isShowOperation = computed(() => {
  return slots.operation
})
const isShowIndex = computed(() => {
  return props.showIndex
})
const isShowRowCheckbox = computed(() => {
  return props.showRowCheckbox
})
const isShowTitle = computed(() => {
  return props.title || slots.title
})
const showHeader = computed(() => {
  return slots.filtergroup || isShowTitle.value || slots.operationgroup
})
const columnsList = computed(() => {
  let list: TableColumn[] = []
  if (isShowRowCheckbox.value) {
    list.push({
      key: 'checkbox',
      title: '',
      fixed: Fixed.left,
      width: 60,
    })
  }
  if (isShowIndex.value) {
    list.push({
      key: 'index',
      title: '',
      fixed: Fixed.left,
      width: 60,
    })
  }
  list = [
    ...list,
    ...props.columns.map((col) => {
      return {
        ...col,
        fixed: col.fixed ? col.fixed : Fixed.none,
      }
    }),
  ]
  if (isShowOperation.value) {
    list.push({
      key: 'operation',
      title: '',
      fixed: Fixed.right,
      minWidth: 100,
    })
  }
  return list
})
const headerRowsMaxLevel = computed(() => {
  const calculateMaxLevel = (columns: TableColumn[], currentLevel = 1): number => {
    return columns.reduce((max, col) => {
      if (Array.isArray(col.children) && col.children.length > 0) {
        return Math.max(max, calculateMaxLevel(col.children, currentLevel + 1))
      }
      return max
    }, currentLevel)
  }
  return calculateMaxLevel(columnsList.value)
})
const columnsFlattened = computed(() => {
  return flatten(columnsList.value)
})
const headerRows = computed(() => {
  // 生成表头行数据
  if (headerRowsMaxLevel.value <= 1) return [columnsFlattened.value]
  const rows = []
  for (let level = 0; level < headerRowsMaxLevel.value; level++) {
    let item = extractDimension(columnsList.value, level)
    item = item.map((col) => {
      const hasChildren = Array.isArray(col.children) && col.children.length > 0
      if (hasChildren) {
        return {
          colspan: col.children?.length || 1,
          rowspan: 1,
          ...col,
        }
      } else {
        return {
          colspan: 1,
          rowspan: headerRowsMaxLevel.value - level,
          ...col,
        }
      }
    })
    rows.push(item)
  }
  return rows
})

const emit = defineEmits<TableEmits>()

const search = () => {
  filterVal.value = filterInputVal.value
}
const changePagination = (current: number, currentPageSize: number) => {
  pagination.value.current = current
  pagination.value.pageSize = currentPageSize
}
const select = (val: boolean, row: any) => {
  if (val && !selectedRow.value.includes(row)) {
    selectedRow.value.push(row)
  } else if (!val && selectedRow.value.includes(row)) {
    selectedRow.value.splice(selectedRow.value.indexOf(row), 1)
  }
  emit('select', selectedRow.value)
}
const clickRow = (row: any) => {
  emit('click-row', row)
}
const cellStyle = (col: TableColumn) => {
  const basicStyle: {
    textAlign: align
    height: string
  } = {
    textAlign: col.textAlign ? col.textAlign : props.align ? props.align : 'center',
    height: '100%',
  }
  const widthStyle = displayDataSource.value.length
    ? {
        width: col.width && `${col.width}px`,
        minWidth: col.minWidth ? `${col.minWidth}px` : col.width ? `${col.width}px` : 'auto',
        maxWidth: col.maxWidth ? `${col.maxWidth}px` : col.width ? `${col.width}px` : 'auto',
      }
    : {}
  return {
    ...basicStyle,
    ...widthStyle,
  }
}
const cellContent = (row: any, key: string) => {
  if (Array.isArray(row[key]) && !row[key].length) {
    return DefaultVal
  }
  return row[key] ? row[key] : DefaultVal
}
const getStickyLeftOffset = (colIndex: number) => {
  let offset = 0
  // 遍历当前列之前的所有列
  for (let i = 0; i < colIndex; i++) {
    const col = columnsFlattened.value[i]
    if (col?.fixed === Fixed.left) {
      const { width } = headerColRefs.value[i]?.getBoundingClientRect() || { width: 150 }
      offset += width || 150
    }
  }
  return offset
}
const getStickyRightOffset = (colIndex: number) => {
  let offset = 0
  // 遍历当前列后面的所有列
  for (let i = columnsFlattened.value.length - 1; i > colIndex; i--) {
    const col = columnsFlattened.value[i]
    if (col?.fixed === Fixed.right) {
      const { width } = headerColRefs.value[i]?.getBoundingClientRect() || { width: 150 }
      offset += width || 150
    }
  }
  return offset
}
const handleScroll = (isInit = false) => {
  if (!tableWrap.value) return
  const currentScrollLeft = tableWrap.value.scrollLeft
  if (isInit) {
    isScrollLeft.value = tableWrap.value.scrollWidth > tableWrap.value.clientWidth
  } else {
    isScrollRight.value = currentScrollLeft > lastScrollLeft.value
    isScrollLeft.value = currentScrollLeft < lastScrollLeft.value
  }
  const parentRect = tableWrap.value.getBoundingClientRect()
  headerColRefs.value.forEach((col, index) => {
    if (!col) return
    const childRect = col.getBoundingClientRect()
    const column = columnsFlattened.value[index]
    if (isScrollRight.value && column?.fixed === Fixed.left) {
      if (col.style.position === 'sticky') return
      if (childRect.left < parentRect.left) {
        const leftOffset = getStickyLeftOffset(index)
        setStickyStyle(col, index, 'left', leftOffset)
      }
    } else if (isScrollLeft.value && column?.fixed === Fixed.right) {
      if (col.style.position === 'sticky') return
      if (childRect.right > parentRect.right) {
        const rightOffset = getStickyRightOffset(index)
        setStickyStyle(col, index, 'right', rightOffset)
      }
    }
  })
  lastScrollLeft.value = currentScrollLeft
}
const setStickyStyle = (
  el: HTMLTableCellElement,
  index: number,
  direction: 'left' | 'right',
  offset: number,
) => {
  el.style.position = 'sticky'
  el.style[direction] = `${offset}px`
  el.classList.add('table-main__cell--fixed')

  displayDataSource.value.forEach((item, rowIndex) => {
    const cell = document.getElementById(`content_cell_${rowIndex}_${index}_ref`)
    if (cell) {
      cell.style.position = 'sticky'
      cell.style[direction] = `${offset}px`
      cell.classList.add('table-main__cell--fixed')
    }
  })
}

watch(
  () => props.dataSource,
  (val, oldVal) => {
    if (val.length !== oldVal.length) {
      handleScroll(true)
    }
  },
)

onMounted(() => {
  handleScroll(true)
})
</script>

<style lang="less">
.table {
  border-radius: 8px;
  width: 100%;
  .table__header {
    position: relative;
    height: 50px;
  }
  .table__title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 18px;
    text-align: center;
    color: #262626;
    @media screen and (max-width: 768px) {
      justify-content: flex-start;
    }
  }
  .table__filter-group,
  .table__operation-group {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }
  .table__filter-group {
    left: 0;
  }
  .table__operation-group {
    right: 0;
  }
  .table__main {
    min-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .table__footer,
  .table__pagination {
    padding: 10px 0;
  }
  .table__pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    @media screen and (max-width: 768px) {
      justify-content: center;
    }
  }
  .table-main {
    table-layout: fixed;
    border-collapse: separate;
    box-sizing: border-box;
    min-width: 100%;
    &.is-border {
      border: 1px solid #c9c9c9;
      .table-main__header-row,
      .table-main__content-row {
        th,
        td {
          border-right: 1px solid #c9c9c9;
          &:last-child {
            border-right: none;
          }
        }
      }
    }
    .table-main__header-row {
      .table-main__cell {
        font-weight: 600;
        background-color: @table-header-background-color;
        &.table-main__cell--fixed {
          background-color: @table-header-background-color;
        }
      }
    }
    .table-main__content-row {
      .table-main__cell {
        background-color: @table-background-color;
      }
      &:last-child {
        .table-main__cell {
          border-bottom: none;
        }
      }
      &.is-stripe {
        .table-main__cell {
          background-color: #fafafa;
          &.table-main__cell--fixed {
            background-color: #fafafa;
          }
        }
      }
      &.is-hover {
        &:hover {
          .table-main__cell {
            background-color: #f5f7fa !important;
            &.table-main__cell--fixed {
              background-color: #f5f7fa !important;
            }
          }
        }
      }
      &.empty-row {
        .empty-row__cell {
          height: 80px;
          vertical-align: middle;
          text-align: center;
          color: #666;
          font-size: 16px;
        }
      }
    }
    .table-main__cell {
      z-index: 1;
      padding: 12px 5px;
      font-size: 16px;
      color: #262626;
      border-bottom: 1px solid #c9c9c9;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      &.table-main__cell--fixed {
        z-index: 2;
        &.table-main__cell--fixed-left-last,
        &.table-main__cell--fixed-right-first {
          &::after {
            position: absolute;
            top: 0;
            bottom: -1px;
            width: 30px;
            transition: box-shadow 0.3s;
            content: '';
            pointer-events: none;
          }
        }
        &.table-main__cell--fixed-left-last {
          &::after {
            right: 0;
            transform: translate(100%);
            box-shadow: inset 10px 0 8px -8px #ccc;
          }
        }
        &.table-main__cell--fixed-right-first {
          &::after {
            left: 0;
            transform: translate(-100%);
            box-shadow: inset -10px 0 8px -8px #ccc;
          }
        }
      }
    }
  }
}
</style>
