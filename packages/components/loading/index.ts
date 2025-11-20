import type { App, InjectionKey } from 'vue'
import { loadingManager, type ILoadingManager } from './loading-manager'
import { type ILoadingProps, default as FhLoading } from './loading.vue'

export { type ILoadingProps }

export const LoadingKey: InjectionKey<ILoadingManager> =
  Symbol('$loading')

export function registerLoading(app: App) {
  app.config.globalProperties.$loading = loadingManager
  app.provide('$loading', loadingManager)
}

export default FhLoading
