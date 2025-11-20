import { withInstall } from '@fhtek-ui/utils/type'
import TimePicker from './time-picker.vue'

const FhTimePicker = withInstall(TimePicker)

export default FhTimePicker
export { FhTimePicker }
export type { ITimePickerProps, ITimePickerEmits } from './time-picker.vue'
