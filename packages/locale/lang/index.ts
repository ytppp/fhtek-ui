import en from './en'
import zhCN from './zh-CN'

export type Locale = typeof zhCN

export interface LocaleMap {
  [key: string]: Locale
}

export const locales: LocaleMap = {
  en: en,
  'zh-CN': zhCN,
}

export type Language = keyof typeof locales

export { en, zhCN }
