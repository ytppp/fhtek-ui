<template>
  <div class="table">
    <div class="table__header" v-if="showHeader">
      <div class="table__filter-group" v-if="$slots.filtergroup">
        <slot name="filtergroup"></slot>
      </div>
      <div class="table__title" v-if="title || $slots.title">
        <template v-if="title"> {{ title }} </template>
        <slot name="title" v-else></slot>
      </div>
      <div class="table__operation-group" v-if="$slots.operationgroup">
        <slot name="operationgroup"></slot>
      </div>
    </div>
    <div class="table__header" v-if="showSearch">
      <div class="table__filter-group">
        <fh-input
          v-model="filterInputVal"
          :placeholder="$t('trans0854')"
          class="table__header-search-input"
        ></fh-input>
        <fh-icon
          class="page__header-icon"
          @click="search"
          name="icon-search"
          :title="$t('trans0863')"
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
        :class="{ 'is-border': border || headerRowsMaxLevel > 1 }"
      >
        <thead class="table-main__header" v-if="showTableHeader">
          <tr class="table-main__header-row" v-for="(row, rowIndex) in headerRows" :key="rowIndex">
            <template v-for="(col, colIndex) in row" :key="`${rowIndex}-${colIndex}`">
              <th
                class="table-main__cell"
                :style="cellStyle(col, colIndex)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :ref="(el) => (headerColRefs[colIndex] = el)"
                v-if="col.key === 'checkbox'"
              ></th>
              <th
                class="table-main__cell"
                :style="cellStyle(col, colIndex)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :ref="(el) => (headerColRefs[colIndex] = el)"
                v-else-if="col.key === 'index'"
              >
                {{ $t('trans0454') }}
              </th>
              <th
                class="table-main__cell"
                :style="cellStyle(col, colIndex)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :ref="(el) => (headerColRefs[colIndex] = el)"
                v-else-if="col.key === 'operation'"
              >
                {{ $t('trans0141') }}
              </th>
              <th
                class="table-main__cell"
                :title="col.title"
                :style="cellStyle(col, colIndex)"
                :colspan="col.colspan"
                :rowspan="col.rowspan"
                :ref="(el) => (headerColRefs[colIndex] = el)"
                v-else
              >
                {{ col.title }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="table-main__content">
          <template v-if="dataSourceDisplay.length">
            <tr
              v-for="(item, index) in dataSourceDisplay"
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
                  :style="cellStyle(col, colIndex)"
                  :ref="`content_cell_${index}_${colIndex}_ref`"
                  v-if="col.key === 'checkbox'"
                >
                  <fh-checkbox @change="(val) => select(val, item)" />
                </td>
                <td
                  class="table-main__cell"
                  :style="cellStyle(col, colIndex)"
                  :ref="`content_cell_${index}_${colIndex}_ref`"
                  v-else-if="col.key === 'index'"
                >
                  {{ index + 1 }}
                </td>
                <td
                  class="table-main__cell"
                  :style="cellStyle(col, colIndex)"
                  :ref="`content_cell_${index}_${colIndex}_ref`"
                  v-else-if="col.key === 'operation'"
                >
                  <slot name="operation" :row="item"></slot>
                </td>
                <td
                  class="table-main__cell"
                  :title="item[col.key]"
                  :style="cellStyle(col, colIndex)"
                  :ref="`content_cell_${index}_${colIndex}_ref`"
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
              {{ $t('trans0142') }}
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
    <div class="table__footer" v-if="footer || $slots.footer">
      <template v-if="footer"> {{ footer }} </template>
      <slot name="footer" v-else></slot>
    </div>
  </div>
</template>

<script>
import { useDataClean } from '@/hooks/data-clean'
import { findObjectsWithValue } from '@/util/tool'
import { extractDimension, flatten } from './table-util'

const { defaultVal } = useDataClean()

const Fixed = {
  left: 'left',
  right: 'right',
  none: '',
}
export default {
  name: 'FhTable',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    title: String,
    footer: String,
    showRowCheckbox: {
      type: Boolean,
      default: false,
    },
    showIndex: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: false,
    },
    hover: {
      type: Boolean,
      default: true,
    },
    showTableHeader: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      default: 'center',
      validator: function (value) {
        return ['left', 'center', 'right'].indexOf(value) !== -1
      },
    },
  },
  data() {
    return {
      listSelected: [],
      headerColRefs: [],
      isScrollLeft: false,
      isScrollRight: false,
      lastScrollLeft: 0,
      pagination: {
        current: 1,
        pageSize: 20,
      },
      filterInputVal: '',
      filterVal: '',
    }
  },
  computed: {
    dataSourceDisplay() {
      let data = this.dataSource
      if (this.showSearch) {
        data = findObjectsWithValue(this.dataSource, this.filterVal)
      }
      if (this.showPagination) {
        const { current, pageSize } = this.pagination
        const start = (current - 1) * pageSize
        const end = current * pageSize
        data = data.slice(start, end)
      }
      return data
    },
    isShowOperation() {
      return this.$slots.operation
    },
    isShowIndex() {
      return this.showIndex
    },
    isShowRowCheckbox() {
      return this.showRowCheckbox
    },
    columnsNew() {
      let list = []
      if (this.isShowRowCheckbox) {
        list.push({
          key: 'checkbox',
          title: '',
          fixed: Fixed.left,
          width: '60',
        })
      }
      if (this.isShowIndex) {
        list.push({
          key: 'index',
          title: '',
          fixed: Fixed.left,
          width: '60',
        })
      }
      list = [
        ...list,
        ...this.columns.map((col) => {
          return {
            ...col,
            fixed: col.fixed ? col.fixed : Fixed.none,
          }
        }),
      ]
      if (this.isShowOperation) {
        list.push({
          key: 'operation',
          title: '',
          fixed: Fixed.right,
          minWidth: '100',
        })
      }
      return list
    },
    headerRowsMaxLevel() {
      // 计算表头的最大深度
      const calculateMaxLevel = (columns, currentLevel = 1) => {
        return columns.reduce((max, col) => {
          if (Array.isArray(col.children) && col.children.length > 0) {
            return Math.max(max, calculateMaxLevel(col.children, currentLevel + 1))
          }
          return max
        }, currentLevel)
      }
      return calculateMaxLevel(this.columnsNew)
    },
    columnsFlattened() {
      // 扁平化的叶子列（用于数据渲染）
      return flatten(this.columnsNew)
    },
    headerRows() {
      // 生成表头行数据
      if (this.headerRowsMaxLevel <= 1) return [this.columnsFlattened]
      const rows = []
      for (let level = 0; level < this.headerRowsMaxLevel; level++) {
        let item = extractDimension(this.columnsNew, level)
        item = item.map((col) => {
          const hasChildren = Array.isArray(col.children) && col.children.length > 0
          if (hasChildren) {
            return {
              colspan: col.children.length,
              rowspan: 1,
              ...col,
            }
          } else {
            return {
              colspan: 1,
              rowspan: this.headerRowsMaxLevel - level,
              ...col,
            }
          }
        })
        rows.push(item)
      }
      return rows
    },
  },
  watch: {
    dataSource(val, oldVal) {
      if (val.length !== oldVal.length) {
        this.handleScroll(true)
      }
    },
  },
  emits: ['select', 'click-row'],
  methods: {
    search() {
      this.filterVal = this.filterInputVal
    },
    changePagination(current, currentPageSize) {
      this.pagination.current = current
      this.pagination.pageSize = currentPageSize
    },
    select(val, row) {
      if (val && !this.listSelected.includes(row)) {
        this.listSelected.push(row)
      } else if (!val && this.listSelected.includes(row)) {
        this.listSelected.splice(this.listSelected.indexOf(row), 1)
      }
      this.$emit('select', this.listSelected)
    },
    clickRow(item) {
      this.$emit('click-row', item)
    },
    cellContent(item, key) {
      if (Array.isArray(item[key]) && !item[key].length) {
        return defaultVal
      }
      return item[key] ? item[key] : defaultVal
    },
    cellStyle(col) {
      const basicStyle = {
        textAlign: col.textAlign ? col.textAlign : this.align,
        height: '100%',
      }
      const widthStyle = this.dataSourceDisplay.length
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
    },
    getStickyLeftOffset(colIndex) {
      let offset = 0
      // 遍历当前列之前的所有列
      for (let i = 0; i < colIndex; i++) {
        const col = this.columnsFlattened[i]
        if (col.fixed === Fixed.left) {
          const { width } = this.headerColRefs[i].getBoundingClientRect()
          offset += width || 150
        }
      }
      return offset
    },
    getStickyRightOffset(colIndex) {
      let offset = 0
      // 遍历当前列后面的所有列
      for (let i = this.columnsFlattened.length - 1; i > colIndex; i--) {
        const col = this.columnsFlattened[i]
        if (col.fixed === Fixed.right) {
          const { width } = this.headerColRefs[i].getBoundingClientRect()
          offset += width
        }
      }
      return offset
    },
    handleScroll(isInit = false) {
      const currentScrollLeft = this.$refs.tableWrap.scrollLeft
      if (isInit) {
        this.isScrollLeft = this.$refs.scrollTable.scrollWidth > this.$refs.tableWrap.clientWidth
      } else {
        this.isScrollRight = currentScrollLeft > this.lastScrollLeft
        this.isScrollLeft = currentScrollLeft < this.lastScrollLeft
      }
      const parentRect = this.$refs.tableWrap.getBoundingClientRect()
      this.headerColRefs.forEach((col, index) => {
        if (!col) return
        const childRect = col.getBoundingClientRect()
        const column = this.columnsFlattened[index]
        if (this.isScrollRight && column.fixed === Fixed.left) {
          if (col.style.position === 'sticky') return
          if (childRect.left < parentRect.left) {
            const leftOffset = this.getStickyLeftOffset(index)
            this.setStickyStyle(col, index, 'left', leftOffset)
          }
        } else if (this.isScrollLeft && column.fixed === Fixed.right) {
          if (col.style.position === 'sticky') return
          if (childRect.right > parentRect.right) {
            const rightOffset = this.getStickyRightOffset(index)
            this.setStickyStyle(col, index, 'right', rightOffset)
          }
        }
      })
      this.lastScrollLeft = currentScrollLeft
    },
    setStickyStyle(col, index, direction, offset) {
      col.style.position = 'sticky'
      col.style[direction] = `${offset}px`
      col.classList.add('table-main__cell--fixed')

      this.dataSourceDisplay.forEach((item, rowIndex) => {
        const cell = this.$refs[`content_cell_${rowIndex}_${index}_ref`]?.[0]
        if (cell) {
          cell.style.position = 'sticky'
          cell.style[direction] = `${offset}px`
          cell.classList.add('table-main__cell--fixed')
        }
      })
    },
  },
  mounted() {
    this.handleScroll(true)
  },
}
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
