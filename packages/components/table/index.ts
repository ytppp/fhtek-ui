import { withInstall } from '@fhtek-ui/utils/type'
import Table from './table.vue'

const FhTable = withInstall(Table)

export default FhTable
export type { TableColumn as ITableColumnProps, TableEmits as ITableEmits } from './interface'
