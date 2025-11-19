import { withInstall } from '@fhtek-ui/utils/type'
import Step from './step.vue'

const FhStep = withInstall(Step)

export default FhStep
export { FhStep }
export type { IStepProps } from './step.vue'
