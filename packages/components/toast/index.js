import { h } from 'vue'
import FhToast from './toast.vue'
import { usePopup } from '@/hooks/popup'
import { shallowMergeOptions } from '@/util/tool'

const DefaultOpt = {
  duration: 3000,
  text: '',
  type: 'error',
}

const toast = (options) => {
  let opt = null
  if (typeof options === 'string') {
    opt = shallowMergeOptions(DefaultOpt, {
      text: options,
    })
  } else {
    opt = shallowMergeOptions(DefaultOpt, options)
  }
  const toastInstance = usePopup(
    h(FhToast, {
      ...opt,
      onHide: () => {
        toastInstance.close()
      },
    }),
  )
  toastInstance.show()
}

export default toast
