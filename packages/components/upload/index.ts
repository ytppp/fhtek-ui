import { withInstall } from '@fhtek-ui/utils/type'
import Upload from './upload.vue'

const FhUpload = withInstall(Upload)

export default FhUpload
export { FhUpload }
export type { IUploadProps } from './interface'
