import { withInstall } from '@fhtek-ui/utils/type'
import Alert from './alert.vue'

const FhAlert = withInstall(Alert)

export default FhAlert
export type { IAlertProps, IAlertEmits } from './alert.vue'
