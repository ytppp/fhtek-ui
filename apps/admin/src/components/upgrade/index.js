import { h } from 'vue'
import FhUpgrade from './upgrade.vue'
import { mergeOptions, handleLogout } from '@/util/tool'
import { usePopup } from '@/hooks/popup'

const defaultOptions = {
  url: '',
  title: '',
  tip: '',
  timeout: 80 * 1000,
  interval: 1000,
  progressVisible: true,
}
let instance = null

export default {
  open(options) {
    const opt = mergeOptions(defaultOptions, options)
    if (!instance) {
      instance = usePopup(
        h(FhUpgrade, {
          ...opt,
          onHide: () => {
            this.close()
            handleLogout(false)
          },
        }),
      )
      instance.show()
    }
  },
  close() {
    if (instance) {
      instance.close()
      instance = null
    }
  },
}
