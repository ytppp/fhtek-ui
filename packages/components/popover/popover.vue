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

<script>
import { computePosition, flip, shift, offset, arrow } from '@floating-ui/vue'

const Positions = {
  topStart: 'top-start',
  top: 'top',
  topEnd: 'top-end',
  bottomStart: 'bottom-start',
  bottom: 'bottom',
  bottomEnd: 'bottom-end',
  left: 'left',
  right: 'right',
}
const StaticSide = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}
const Trigger = {
  click: 'click',
  hover: 'hover',
}
export default {
  name: 'FhPopover',
  props: {
    position: {
      type: String,
      default: Positions.bottom,
    },
    trigger: {
      type: String,
      default: Trigger.hover,
      validator(value) {
        return [Trigger.click, Trigger.hover].includes(value)
      },
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    positionContent() {
      computePosition(this.$refs.triggerWrapper, this.$refs.popoverWrapper, {
        placement: this.position,
        middleware: [flip(), shift(), offset(6), arrow({ element: this.$refs.popoverTriangle })],
      }).then(({ x, y, placement, strategy, middlewareData }) => {
        Object.assign(this.$refs.popoverWrapper.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
        const { x: arrowX, y: arrowY } = middlewareData.arrow
        const staticSide = StaticSide[placement.split('-')[0]]
        Object.assign(this.$refs.popoverTriangle.style, {
          left: arrowX != null ? `${arrowX}px` : '',
          top: arrowY != null ? `${arrowY}px` : '',
          right: '',
          bottom: '',
          [staticSide]: '-4px',
        })
      })
    },
    handleClick(event) {
      if (this.$refs.triggerWrapper.contains(event.target)) {
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
    eventHandler(e) {
      if (
        this.$refs.popover &&
        (this.$refs.popover === e.target || this.$refs.popover.contains(e.target))
      ) {
        return
      }
      if (
        this.$refs.popoverWrapper &&
        (this.$refs.popoverWrapper === e.target || this.$refs.popoverWrapper.contains(e.target))
      ) {
        return
      }
      this.onClose()
    },
  },
  mounted() {
    if (this.trigger === Trigger.click) {
      this.$refs.popover.addEventListener('click', this.handleClick)
    } else {
      this.$refs.popover.addEventListener('mouseenter', this.onShow)
      this.$refs.popover.addEventListener('mouseleave', this.onClose)
    }
  },
  beforeUnmount() {
    if (this.trigger === Trigger.click) {
      this.$refs.popover.removeEventListener('click', this.handleClick)
    } else {
      this.$refs.popover.removeEventListener('mouseenter', this.onShow)
      this.$refs.popover.removeEventListener('mouseleave', this.onClose)
    }
  },
}
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
