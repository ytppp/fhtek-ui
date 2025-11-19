import { withInstall } from '@fhtek-ui/utils/type'
import Radio from './radio.vue'
import RadioGroup from './radio-group.vue'

const FhRadio = withInstall(Radio)
const FhRadioGroup = withInstall(RadioGroup)

export default FhRadio
export { FhRadioGroup, FhRadio }
export type {
  IRadioGroupProps,
  IRadioGroupEmits,
  IRadioProps,
  IRadioEmits,
} from './interface.ts'
