export type DialogType = 'info' | 'confirm'

export interface IDialogProps {
  dialogType: DialogType
  message: string
  title?: string
  okText: string
  cancelText?: string
}
export const DefaultOpt: {
  [key in DialogType]: IDialogProps
} = {
  info: {
    dialogType: 'info',
    title: '',
    message: 'info',
    okText: 'ok',
  },
  confirm: {
    dialogType: 'confirm',
    title: '',
    message: 'confirm',
    okText: 'ok',
    cancelText: 'cancel',
  },
}
