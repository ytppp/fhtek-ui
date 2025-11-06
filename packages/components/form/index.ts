import { withInstall } from '@fhtek-ui/utils/type' // 安装函数（见下文）
import Form from './form.vue'
import FormItem from './form-item.vue'

const FhForm = withInstall(Form)
const FhFormItem = withInstall(FormItem)

export default FhForm
export { FhForm, FhFormItem }

export {
  type IFormProps,
  type IFormItemProps,
  type IFormContext,
  type IFormItemContext,
  FormContextKey,
  FormItemContextKey,
} from './interface'
