import type { I18nConfig, I18nInstance } from '../types'
import { type Language } from '../lang'
import { locales } from '../lang'

export class I18n implements I18nInstance {
  private config: Required<I18nConfig>
  private messages: Record<string, any> = {}

  constructor(config: I18nConfig) {
    this.config = {
      locale: config.locale || 'zh-CN',
      fallbackLocale: config.fallbackLocale || 'en-US',
      messages: config.messages || {},
    }

    // 初始化消息
    this.initializeMessages()
  }

  private initializeMessages() {
    // 合并内置语言包和用户自定义消息
    Object.keys(locales).forEach((lang) => {
      this.messages[lang] = {
        ...locales[lang as Language],
        ...this.config.messages[lang],
      }
    })
  }

  t(key: string, params: Record<string, any> = {}): string {
    const { locale, fallbackLocale } = this.config

    let message = this.getMessage(key, locale)

    // 回退到备用语言
    if (!message && fallbackLocale && fallbackLocale !== locale) {
      message = this.getMessage(key, fallbackLocale)
    }

    // 替换参数
    if (message && params) {
      message = this.replaceParams(message, params)
    }

    return message || key
  }

  private getMessage(key: string, locale: Language): string {
    const keys = key.split('.')
    let message: any = this.messages[locale]
    for (const k of keys) {
      if (message && typeof message === 'object' && k in message) {
        message = message[k]
      } else {
        return ''
      }
    }

    return typeof message === 'string' ? message : ''
  }

  private replaceParams(message: string, params: Record<string, any>): string {
    return message.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match
    })
  }

  setLocale(locale: Language): void {
    this.config.locale = locale
  }

  getLocale(): Language {
    return this.config.locale
  }

  mergeLocale(locale: Language, messages: any): void {
    if (!this.messages[locale]) {
      this.messages[locale] = {}
    }

    this.messages[locale] = {
      ...this.messages[locale],
      ...messages,
    }
  }

  // 获取所有支持的语言
  getSupportedLocales(): Language[] {
    return Object.keys(locales) as Language[]
  }
}

// 创建默认实例
export const createI18n = (config: I18nConfig = { locale: 'zh-CN' }) => {
  return new I18n(config)
}
