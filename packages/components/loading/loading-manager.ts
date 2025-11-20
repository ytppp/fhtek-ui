import { h } from 'vue'
import FhLoading, { type ILoadingProps } from './loading.vue'
import { shallowMergeOptions } from '@fhtek-ui/utils/tool'
import { usePopup } from '@fhtek-ui/hooks/popup'
import FhPopup from '@fhtek-ui/components/popup'

export interface ILoadingManager {
  open(options: ILoadingProps): void
  close(): void
}

const defaultOptions: ILoadingProps = {
  tip: '',
  title: '',
}
let instance: ReturnType<typeof usePopup> | null = null

export const loadingManager: ILoadingManager = {
  open(options: ILoadingProps) {
    const opt = shallowMergeOptions(defaultOptions, options)
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
