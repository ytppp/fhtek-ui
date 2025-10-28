import { withInstall } from '@fhtek-ui/utils/type'
import Checkbox from './checkbox.vue'
import CheckboxGroup from './checkbox-group.vue'

const FhCheckbox = withInstall(Checkbox)
const FhCheckboxGroup = withInstall(CheckboxGroup)

export default FhCheckbox
export { FhCheckboxGroup, FhCheckbox }
export type {
  ICheckboxGroupProps,
  ICheckboxGroupEmits,
  ICheckboxProps,
  ICheckboxEmits,
} from './interface.ts'
