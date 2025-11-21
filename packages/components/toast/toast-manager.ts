import { h } from 'vue'
import { withInstall } from '@fhtek-ui/utils/type'
import Toast from './toast.vue'
import { usePopup } from '@fhtek-ui/hooks/popup'
import { shallowMergeOptions } from '@fhtek-ui/utils/tool'
import type { IToastProps } from './interface'

const FhToast = withInstall(Toast)

const DefaultOpt: IToastProps = {
  duration: 3000,
  text: '',
  type: 'error',
}

export const toastManager = (options: IToastProps | string) => {
  let opt = null
  if (typeof options === 'string') {
    opt = shallowMergeOptions<IToastProps>(DefaultOpt, {
      text: options,
    })
  } else {
    opt = shallowMergeOptions<IToastProps>(DefaultOpt, options)
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
