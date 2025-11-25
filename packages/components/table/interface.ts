export const DefaultVal = '-'

export type align = 'left' | 'center' | 'right'

export enum Fixed {
  left = 'left',
  right = 'right',
  none = '',
}
export interface TableColumn {
  key: string
  title: string
  textAlign?: align
  fixed?: Fixed
  width?: number
  minWidth?: number
  maxWidth?: number
  colspan?: number
  rowspan?: number
  children?: TableColumn[]
}

// 分页参数类型
export interface Pagination {
  // 当前页码
  current?: number
  // 每页条数
  pageSize: number
  // 总条数
  total?: number
  // 可选的每页条数选项
  pageSizes?: number[]
}

export interface DataTableProps<T = Record<string, any>> {
  // 列配置
  columns: TableColumn[]
  // 表格数据
  dataSource: T[]
  // 表格标题
  title?: string
  // 表格页脚
  footer?: string
  // 是否显示行选择器
  showRowCheckbox?: boolean
  // 是否显示索引列
  showIndex?: boolean
  // 是否显示分页
  showPagination?: boolean
  // 是否显示搜索框
  showSearch?: boolean
  // 是否显示斑马纹
  stripe?: boolean
  // 是否显示边框
  bordered?: boolean
  // 是否显示悬停效果
  hover?: boolean
  // 是否显示表格表头
  showTableHeader?: boolean
  // 是否显示头部
  showHeader?: boolean
  // 对齐方式
  align?: align
  // 分页配置
  pagination?: Pagination
}

export interface TableEmits {
  (e: 'select', selectedRows: Record<string, any>[]): void
  (e: 'click-row', row: Record<string, any>): void
}
