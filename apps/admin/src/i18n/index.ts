import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { getLangUsed } from '../util/tool'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'

export const locale = getLangUsed(__APP_CUSTOMER_CONFIG__.defaultLanguage)
// 定义语言映射
const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}
const i18n = createI18n({
  locale,
  fallbackLocale: 'en-US', // default locale env
  globalInjection: true, // 全局生效$t方法
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
  messages,
  datetimeFormats: {
    'zh-CN': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      },
      long: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
      },
    },
  },
  numberFormat: {
    'zh-CN': {
      decimal: {
        style: 'decimal',
      },
    },
    'en-US': {
      decimal: {
        style: 'decimal',
      },
    },
  },
})

const setupI18n = (app: App) => {
  app.use(i18n)
}

export function changeLanguage(lang: string) {
  if (__APP_CUSTOMER_CONFIG__.languages.includes(lang)) {
    localStorage.setItem('lang', lang)
    window.location.reload()
  } else {
    console.log('language not exist!')
  }
}

export function translate(key: string, locale?: string) {
  if (!key) return ''
  try {
    return i18n.global.t(key, locale || i18n.global.locale)
  } catch (err) {
    console.warn(`翻译键 "${key}" 不存在：`, err)
  }
}

export function toLocaleNumber(
  number: number,
  locale = 'en-US',
  minimumFractionDigits = 1,
  maximumFractionDigits = 1,
) {
  return i18n.global.n(number, {
    locale,
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

export default setupI18n
