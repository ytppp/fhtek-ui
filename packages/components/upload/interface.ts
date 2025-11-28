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
  request?: (file: File[]) => void
  beforeUpload?: (file: File[]) => boolean | Promise<boolean>
  onSuccess?: (file: File[]) => void
  onError?: (file: File[]) => void
  onChange?: (file: File[]) => void
  onCancel?: (file: File) => void
}
