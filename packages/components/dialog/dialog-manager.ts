import { h } from 'vue'
import { shallowMergeOptions } from '@fhtek-ui/utils/tool'
import { usePopup } from '@fhtek-ui/hooks/popup'
import { type DialogType, DefaultOpt, type IDialogProps } from './interface'
import FhDialog from './dialog.vue'

export const dialogManager = (options: IDialogProps, type: DialogType = 'info'): Promise<void> => {
  const opt: IDialogProps = shallowMergeOptions<IDialogProps>(DefaultOpt[type], options)
  return new Promise((resolve, reject) => {
    const dialogInstance = usePopup(
      h(FhDialog, {
        ...opt,
        onOk: () => {
          dialogInstance.close()
          resolve()
        },
        onCancel: () => {
          dialogInstance.close()
          reject()
        },
      }),
    )
    dialogInstance.show()
  })
}
