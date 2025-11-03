import { h } from 'vue'
import { mergeOptions } from '@fhtek-ui/utils/type'
import { usePopup } from '@fhtek-ui/hooks/popup'
import { type DialogType, DefaultOpt, type IDialogProps } from './interfac'
import FhDialog from './dialog.vue'

const dialog = (options: IDialogProps, type: DialogType = 'info'): Promise<void> => {
  const opt: IDialogProps = mergeOptions<IDialogProps>(DefaultOpt[type], options)
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

export default {
  info(options: IDialogProps) {
    return dialog(options)
  },
  confirm(options: IDialogProps) {
    return dialog(options, 'confirm')
  },
}
