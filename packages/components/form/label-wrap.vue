<script lang="ts">
import { h, defineComponent, inject } from 'vue'
import { withInstall } from '@fhtek-ui/utils/type'
import {
  FormContextKey,
  FormItemContextKey,
  type IFormContext,
  type IFormItemContext,
} from './interface'

const LabelWrap = defineComponent({
  name: 'LabelWrap',
  inheritAttrs: false,
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean,
    labelPosition: String,
  },
  data() {
    return {
      computedWidth: 0,
    }
  },
  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        this.form?.registerLabelWidth(val, oldVal)
        this.formItem?.updateComputedLabelWidth(val)
      }
    },
  },
  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width
        return Math.ceil(parseFloat(computedWidth))
      } else {
        return 0
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default?.() && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth()
        } else if (action === 'remove') {
          this.form?.deregisterLabelWidth(this.computedWidth)
        }
      }
    },
  },
  mounted() {
    this.updateLabelWidth('update')
  },
  updated() {
    this.updateLabelWidth('update')
  },
  beforeUnmount() {
    this.updateLabelWidth('remove')
  },
  setup() {
    const form = inject<IFormContext | null>(FormContextKey, null)
    const formItem = inject<IFormItemContext | null>(FormItemContextKey, null)
    return {
      form,
      formItem,
    }
  },
  render() {
    const slots = this.$slots.default?.()
    if (!slots) return null
    if (this.isAutoWidth) {
      const autoLabelWidth = this.form?.autoLabelWidth
      const style: { marginLeft?: string; marginRight?: string } = {}
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const margin = parseInt(autoLabelWidth, 10) - this.computedWidth
        if (margin) {
          if (this.labelPosition === 'right') {
            style.marginLeft = margin + 'px'
          }
          if (this.labelPosition === 'right') {
            style.marginRight = margin + 'px'
          }
        }
      }
      return h(
        'div',
        {
          class: 'form-item__label-wrap',
          style,
        },
        slots,
      )
    } else {
      return slots[0]
    }
  },
})
export default withInstall(LabelWrap)
</script>
