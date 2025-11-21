export const DefaultVal = '-'

export type align = 'left' | 'center' | 'right'

export enum Fixed {
  left = 'left',
  right = 'right',
  none = '',
}
export interface IColumnProps {
  key: string
  title: string
  align?: align
  fixed?: Fixed
  width?: number
  minWidth?: number
  colspan?: number
  rowspan?: number
  children?: IColumnProps[]
}
