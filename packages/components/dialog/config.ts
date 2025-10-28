export enum DialogType {
  info = 'info',
  confirm = 'confirm',
}
export interface IDialogOpt {
  dialogType: DialogType
  title: string
  message: string
  okText: string
  cancelText?: string
}
export const DefaultOpt: {
  [key in DialogType]: IDialogOpt
} = {
  [DialogType.info]: {
    dialogType: DialogType.info,
    title: '',
    message: 'info',
    okText: 'ok',
  },
  [DialogType.confirm]: {
    dialogType: DialogType.confirm,
    title: '',
    message: 'confirm',
    okText: 'ok',
    cancelText: 'cancel',
  },
}
