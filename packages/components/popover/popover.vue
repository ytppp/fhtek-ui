<template>
  <div class="popover" ref="popover">
    <div ref="triggerWrapper" class="popover__trigger">
      <slot></slot>
    </div>
    <div ref="popoverWrapper" class="popover__wrap" v-if="visible">
      <div ref="popoverTriangle" class="popover__triangle"></div>
      <template v-if="title || $slots.title">
        <div class="popover__title" v-if="title">{{ title }}</div>
        <slot name="title" v-else></slot>
      </template>
      <template v-if="content || $slots.content">
        <div class="popover__content" v-if="content">{{ content }}</div>
        <slot name="content" v-else></slot>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { useTemplateRef, type ExtractPublicPropTypes, type PropType, defineComponent } from 'vue'
import {
  computePosition,
  flip,
  shift,
  offset,
  arrow,
  type ReferenceElement,
  type FloatingElement,
} from '@floating-ui/vue'

enum Positions {
  topStart = 'top-start',
  top = 'top',
  topEnd = 'top-end',
  bottomStart = 'bottom-start',
  bottom = 'bottom',
  bottomEnd = 'bottom-end',
  left = 'left',
  right = 'right',
}
enum StaticSide {
  top = 'bottom',
  right = 'left',
  bottom = 'top',
  left = 'right',
}
enum Trigger {
  click = 'click',
  hover = 'hover',
}
const popoverProps = {
  position: {
    type: String as PropType<Positions>,
    default: Positions.bottom,
  },
  trigger: {
    type: String as PropType<Trigger>,
    default: Trigger.hover,
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
}

export type IPopoverProps = ExtractPublicPropTypes<typeof popoverProps>

export default defineComponent({
  name: 'FhPopover',
  props: popoverProps,
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    positionContent() {
      computePosition(
        this.triggerWrapperRef as ReferenceElement,
        this.popoverWrapperRef as FloatingElement,
        {
          placement: this.position,
          middleware: [flip(), shift(), offset(6), arrow({ element: this.popoverTriangleRef })],
        },
      ).then(({ x, y, placement, middlewareData }) => {
        if (this.popoverWrapperRef) {
          Object.assign(this.popoverWrapperRef.style, {
            left: `${x}px`,
            top: `${y}px`,
          })
        }
        const arrowX = middlewareData.arrow?.x
        const arrowY = middlewareData.arrow?.y
        const staticSide = StaticSide[placement.split('-')[0] as StaticSide]
        if (this.popoverTriangleRef) {
          Object.assign(this.popoverTriangleRef.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            right: '',
            bottom: '',
            [staticSide]: '-4px',
          })
        }
      })
    },
    handleClick(event: MouseEvent) {
      if (this.triggerWrapperRef?.contains(event.target as Node)) {
        if (this.visible === true) {
          this.onClose()
        } else {
          this.onShow()
        }
      }
    },
    onShow() {
      this.visible = true
      this.$nextTick(() => {
        this.positionContent()
        document.addEventListener('click', this.eventHandler)
      })
    },
    onClose() {
      this.visible = false
      document.removeEventListener('click', this.eventHandler)
    },
    eventHandler(e: MouseEvent) {
      if (
        this.popoverRef &&
        (this.popoverRef === e.target || this.popoverRef?.contains(e.target as Node))
      ) {
        return
      }
      if (
        this.popoverWrapperRef &&
        (this.popoverWrapperRef === e.target || this.popoverWrapperRef.contains(e.target as Node))
      ) {
        return
      }
      this.onClose()
    },
  },
  mounted() {
    if (this.trigger === Trigger.click) {
      this.popoverRef?.addEventListener('click', this.handleClick)
    } else {
      this.popoverRef?.addEventListener('mouseenter', this.onShow)
      this.popoverRef?.addEventListener('mouseleave', this.onClose)
    }
  },
  beforeUnmount() {
    if (this.trigger === Trigger.click) {
      this.popoverRef?.removeEventListener('click', this.handleClick)
    } else {
      this.popoverRef?.removeEventListener('mouseenter', this.onShow)
      this.popoverRef?.removeEventListener('mouseleave', this.onClose)
    }
  },
  setup() {
    const popoverRef = useTemplateRef<HTMLDivElement>('popover')
    const popoverWrapperRef = useTemplateRef<HTMLDivElement>('popoverWrapper')
    const triggerWrapperRef = useTemplateRef<HTMLDivElement>('triggerWrapper')
    const popoverTriangleRef = useTemplateRef<HTMLDivElement>('popoverTriangle')
    return {
      popoverRef,
      popoverWrapperRef,
      triggerWrapperRef,
      popoverTriangleRef,
    }
  },
})
</script>

<style lang="less">
.popover {
  display: inline-block;
}
.popover__trigger {
  cursor: pointer;
}
.popover__wrap {
  position: absolute;
  z-index: 2000;
  padding: 0 10px;
  min-width: 100px;
  background-color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  font-size: 12px;
  color: #fff;
  padding: 10px;
}
.popover__triangle {
  position: absolute;
  background-color: #333;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}
.popover__title {
  line-height: 1;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}
.popover__content {
  padding-top: 10px;
  font-weight: normal;
  white-space: normal;
}
</style>
