import { withInstall } from '@fhtek-ui/utils/type'
import SelectPopup from './select.vue'

const FhSelectPopup = withInstall(SelectPopup)

export default FhSelectPopup
export { FhSelectPopup }
export type { ISelectProps, ISelectEmits } from './select.vue'
