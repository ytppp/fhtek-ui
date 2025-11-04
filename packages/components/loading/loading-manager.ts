import { h } from 'vue'
import FhLoading, { type ILoadingProps } from './loading.vue'
import { mergeOptions } from '@fhtek-ui/utils/type'
import { usePopup } from '@fhtek-ui/hooks/popup'
import FhPopup from '@fhtek-ui/components/popup'

const defaultOptions: ILoadingProps = {
  tip: '',
  title: '',
}
let instance: ReturnType<typeof usePopup> | null = null
export const loadingManager = {
  open(options: ILoadingProps) {
    const opt = mergeOptions(defaultOptions, options)
    if (!instance) {
      instance = usePopup(
        h(
          FhPopup,
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
