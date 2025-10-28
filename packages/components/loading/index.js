import { h } from 'vue'
import FhLoading from './loading.vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import Popup from '@/components/popup/popup.vue'

const defaultOptions = {
  tip: '',
  title: '',
}
let instance = null
export default {
  open(options) {
    const opt = mergeOptions(defaultOptions, options)
    if (!instance) {
      instance = usePopup(
        h(
          Popup,
          {
            isManual: true,
          },
          () =>
            h(FhLoading, {
              tip: opt.tip,
              title: opt.title,
            }),
        ),
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
