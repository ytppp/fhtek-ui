export enum UploadStatus {
  ready = 'ready',
  success = 'success',
  fail = 'fail',
  uploading = 'uploading',
}

export interface IPackageInfo {
  version: string
  product: string
}

export interface IUploadProps {
  label?: string
  multiple?: boolean
  accept?: string
  packageInfo?: IPackageInfo
  dragable?: boolean
  limit?: number
  isFormUpload?: boolean
  disabled?: boolean
  name?: string
  request?: (file: File) => Promise<IUploadFile>
  beforeUpload?: (file: File) => boolean | Promise<boolean>
  onSuccess?: (file: IUploadFile) => void
  onError?: (file: IUploadFile) => void
  onChange?: (file: IUploadFile) => void
  onCancel?: (file: IUploadFile, percent: number) => void
}

export interface IUploadFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: UploadStatus
}
