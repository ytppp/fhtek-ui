import type { Language } from '../lang'

export interface I18nConfig {
  locale: Language
  fallbackLocale?: Language
  messages?: Record<string, any>
}

export interface I18nInstance {
  t: (key: string, params?: Record<string, any>) => string
  setLocale: (locale: Language) => void
  getLocale: () => Language
  mergeLocale: (locale: Language, messages: any) => void
}

export interface UseI18nOptions {
  locale?: Language
  fallbackLocale?: Language
  messages?: Record<string, any>
}

// 组件 Props 类型
export interface LocaleProps {
  locale?: Language
}
