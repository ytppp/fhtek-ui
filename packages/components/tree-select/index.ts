import { withInstall } from '@fhtek-ui/utils/type'
import Select from './select.vue'

const FhSelect = withInstall(Select)

export default FhSelect
export { FhSelect }
export type { ISelectProps, ISelectEmits } from './select.vue'
