import { withInstall } from '@fhtek-ui/utils/type'
import Button from './button.vue'

const FhButton = withInstall(Button)

export default FhButton
export { FhButton }
export type { IButtonProps, IButtonEmits } from './button.vue'
