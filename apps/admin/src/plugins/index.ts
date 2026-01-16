import type { App } from 'vue'
import setupRouter from '../router'
import setupStore from '../stores'
import setupI18n from '../i18n'

export default {
  install(app: App<Element>) {
    // 国际化
    setupI18n(app)
    // 状态管理(store)
    setupStore(app)
    // 路由(router)
    setupRouter(app)
  },
}
