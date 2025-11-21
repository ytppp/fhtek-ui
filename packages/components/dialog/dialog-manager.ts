import { h } from 'vue'
import { withInstall } from '@fhtek-ui/utils/type'
import { usePopup } from '@fhtek-ui/hooks/popup'
import { type DialogType, DefaultOpt, type IDialogProps } from './interface'
import Dialog from './dialog.vue'

export type InfoDialogProps = Omit<IDialogProps, 'dialogType' | 'cancelText'>
export type ConfirmDialogProps = Omit<IDialogProps, 'dialogType'>
export interface IDialogManager {
  info(options: InfoDialogProps): Promise<void>
  confirm(options: ConfirmDialogProps): Promise<void>
}

const FhDialog = withInstall(Dialog)
const dialogMethod = (
  options: InfoDialogProps | ConfirmDialogProps,
  type: DialogType = 'info',
): Promise<void> => {
  const opt: IDialogProps = {
    ...DefaultOpt[type],
    ...options,
  }
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

export const dialogManager: IDialogManager = {
  info(options: InfoDialogProps) {
    return dialogMethod(options)
  },
  confirm(options: ConfirmDialogProps) {
    return dialogMethod(options, 'confirm')
  },
}
