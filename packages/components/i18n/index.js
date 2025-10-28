import { createI18n } from 'vue-i18n'
import zhCN from '@fhtek-ui/i18n/trans/lang/zh-CN.json'
import enUS from '@fhtek-ui/i18n/trans/lang/en-US.json'

const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US', // default locale env
  globalInjection: true, // 全局生效$t方法
  silentTranslationWarn: true, // 关闭翻译警告
  silentFallbackWarn: true, // 关闭回退警告
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
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

const registerI18n = (app) => {
  app.use(i18n)
}

export function changeLanguage(lang) {
  if (VITE_CUSTOMER_CONFIG.languages.includes(lang)) {
    localStorage.setItem('lang', lang)
    window.location.reload()
  } else {
    console.log('language not exist!')
  }
}

export function translate(key, locale) {
  return i18n.global.t(key, locale || i18n.global.locale)
}

export function toLocaleNumber(
  number,
  locale = 'en-US',
  minimumFractionDigits = 1,
  maximumFractionDigits = 1,
) {
  // 有时候传入是不是数字，是占位符字符串
  if (typeof number === 'number') {
    return i18n.global.n(number, {
      locale,
      minimumFractionDigits,
      maximumFractionDigits,
    })
  }
}

export default registerI18n
