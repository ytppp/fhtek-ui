import { h } from 'vue'
import { mergeOptions } from '@/util/tool'
import { usePopup } from '@/hooks/popup'
import { DialogType, DefaultOpt, type IDialogOpt } from './config'
import FhDialog from './dialog.vue'

const dialog = (options: IDialogOpt, type: DialogType = DialogType.info): Promise<void> => {
  const opt: IDialogOpt = mergeOptions(DefaultOpt[type], options)
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
  info(options: IDialogOpt) {
    return dialog(options)
  },
  confirm(options: IDialogOpt) {
    return dialog(options, DialogType.confirm)
  },
}
