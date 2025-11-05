import { withInstall } from '@fhtek-ui/utils/type'
import Drawer from './drawer.vue'

const FhDrawer = withInstall(Drawer)

export default FhDrawer
export { FhDrawer }
export type { IDrawerProps, IDrawerEmits } from './drawer.vue'
