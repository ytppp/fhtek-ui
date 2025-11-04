import type { App } from 'vue'
import { loadingManager } from './loading-manager'
import { type ILoadingProps, default as FhLoading } from './loading.vue'

export { type ILoadingProps }

export function registerLoading(app: App) {
  app.config.globalProperties.$loading = loadingManager
  app.provide('$loading', loadingManager)
}

export default FhLoading
