import { h } from 'vue'
import FhToast from './toast.vue'
import { usePopup } from '@/hooks/popup'
import { mergeOptions } from '@/util/tool'

const DefaultOpt = {
  duration: 3000,
  text: '',
  type: 'error',
}

const toast = (options) => {
  let opt = null
  if (typeof options === 'string') {
    opt = mergeOptions(DefaultOpt, {
      text: options,
    })
  } else {
    opt = mergeOptions(DefaultOpt, options)
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
