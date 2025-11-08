import { withInstall } from '@fhtek-ui/utils/type'
import Pagination from './pagination.vue'

const FhPagination = withInstall(Pagination)

export default FhPagination
export { FhPagination }
export type { IPaginationProps, IPaginationEmits } from './pagination.vue'
