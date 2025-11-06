import { withInstall } from '@fhtek-ui/utils/type'
import Input from './input.vue'

const FhInput = withInstall(Input)

export default FhInput
export { FhInput }
export type { IInputProps, IInputEmits } from './input.vue'
