import type { App } from 'vue'
import { withInstall } from '@fhtek-ui/utils/type'
import { loadingManager, type ILoadingManager } from './loading-manager'
import { type ILoadingProps, default as Loading } from './loading.vue'

const FhLoading = withInstall(Loading)

export { type ILoadingProps, type ILoadingManager, loadingManager }

export function registerLoading(app: App) {
  app.config.globalProperties.$loading = loadingManager
}

export default FhLoading
