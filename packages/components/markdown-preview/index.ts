import { withInstall } from '@fhtek-ui/utils/type'
import MarkdownPreview from './markdown-preview.vue'

const FhMarkdownPreview = withInstall(MarkdownPreview)

export default FhMarkdownPreview
export { FhMarkdownPreview }
export type { IMarkdownPreviewProps } from './markdown-preview.vue'
