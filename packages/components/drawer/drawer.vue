<template>
  <transition name="drawer-fade" @after-enter="afterEnter" @after-leave="afterLeave">
    <div class="drawer__wrapper" tabindex="-1" v-show="visible">
      <div
        class="drawer__container"
        :class="visible && 'drawer__open'"
        @click.self="handleWrapperClick"
        role="document"
        tabindex="-1"
      >
        <div
          aria-modal="true"
          aria-labelledby="drawer__title"
          :aria-label="title"
          class="drawer"
          :class="[direction, customClass]"
          :style="isHorizontal ? `width: ${drawerSize}` : `height: ${drawerSize}`"
          role="dialog"
          tabindex="-1"
        >
          <header class="drawer__header" id="el-drawer__title" v-if="withHeader">
            <slot name="title">
              <span role="heading" :title="title">{{ title }}</span>
            </slot>
            <fh-icon
              :aria-label="`close ${title || 'drawer'}`"
              class="drawer__close"
              name="icon-close"
              v-if="showClose"
              @click="closeDrawer"
            ></fh-icon>
          </header>
          <section class="drawer__body">
            <slot></slot>
          </section>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    appendToBody: {
      type: Boolean,
      default: false,
    },
    beforeClose: {
      type: Function,
    },
    customClass: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'ltr',
      validator(val) {
        return ['ltr', 'rtl', 'ttb', 'btt'].indexOf(val) !== -1
      },
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    size: {
      type: [Number, String],
      default: '30%',
    },
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
    },
    wrapperClosable: {
      type: Boolean,
      default: true,
    },
    withHeader: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      prevActiveElement: null,
      overflow: '',
    }
  },
  computed: {
    isHorizontal() {
      return this.direction === 'rtl' || this.direction === 'ltr'
    },
    drawerSize() {
      return typeof this.size === 'number' ? `${this.size}px` : this.size
    },
    parentNode() {
      if (this.appendToBody) {
        return document.body
      } else {
        return this.$el.parentNode
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.$emit('open')
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
        this.prevActiveElement = document.activeElement
        // desktop prevent scroll
        this.overflow = this.parentNode ? this.parentNode.style.overflow : ''
        this.parentNode.style.overflow = 'hidden'
        // mobile prevent scroll
        this.parentNode && this.parentNode.addEventListener('touchmove', this.preventDefault, false)
      } else {
        this.$nextTick(() => {
          if (this.prevActiveElement) {
            this.prevActiveElement.focus()
          }
          this.parentNode.style.overflow = this.overflow
          this.parentNode &&
            this.parentNode.removeEventListener('touchmove', this.preventDefault, false)
        })
      }
    },
  },
  methods: {
    preventDefault(e) {
      e.preventDefault()
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    },
    handleWrapperClick() {
      if (this.wrapperClosable) {
        this.closeDrawer()
      }
    },
    closeDrawer() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
  },
  mounted() {
    if (this.visible) {
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },
  unmounted() {
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
}
</script>

<style lang="less">
@keyframes drawer-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@directions: ltr, rtl, ttb, btt;
@in: in;
@out: out;
.drawer-animation(@direction) {
  @animationIn: e(%('%s-drawer-%s', @direction, @in));
  @animationOut: e(%('%s-drawer-%s', @direction, @out));
  @translateIn1: if(
    @direction = ltr,
    translate(-100%, 0px),
    if(
      @direction = rtl,
      translate(100%, 0px),
      if(@direction = ttb, translate(0px, -100%), if(@direction = btt, translate(0px, 100%), ''))
    )
  );
  @translateIn2: if(
    @direction = ltr,
    translate(0px, 0px),
    if(
      @direction = rtl,
      translate(0px, 0px),
      if(@direction = ttb, translate(0px, 0px), if(@direction = btt, translate(0px, 0px), ''))
    )
  );
  @translateOut1: if(
    @direction = ltr,
    translate(0px, 0px),
    if(
      @direction = rtl,
      translate(0px, 0px),
      if(@direction = ttb, translate(0px, 0px), if(@direction = btt, translate(0px, 0px), ''))
    )
  );
  @translateOut2: if(
    @direction = ltr,
    translate(-100%, 0px),
    if(
      @direction = rtl,
      translate(100%, 0px),
      if(@direction = ttb, translate(0px, -100%), if(@direction = btt, translate(0px, 100%), ''))
    )
  );
  @keyframes @animationIn {
    0% {
      transform: @translateIn1;
    }
    100% {
      transform: @translateIn2;
    }
  }
  @keyframes @animationOut {
    0% {
      transform: @translateOut1;
    }
    100% {
      transform: @translateOut2;
    }
  }
}
each(@directions, {
  .drawer-animation(@value);
}) .animation-in(@direction) {
  .drawer__open &.@{direction} {
    animation: e(%('%s-drawer-%s .3s 1ms', @direction, @in));
  }
}
.animation-out(@direction) {
  &.@{direction} {
    animation: e(%('%s-drawer-%s .3s', @direction, @out));
  }
}
.drawer {
  position: absolute;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  outline: 0;

  each(@directions, {
    .animation-in(@value);
    .animation-out(@value);
  });
  &__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    margin: 0;
    z-index: 1002;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &__header {
    align-items: center;
    color: rgb(114, 118, 123);
    display: flex;
    margin-bottom: 32px;
    padding: 10px;
    @media screen and (max-width: 768px) {
      margin-bottom: 0;
    }
    & > :first-child {
      flex: 1;
    }
  }

  &__title {
    margin: 0;
    flex: 1;
    line-height: inherit;
    font-size: 1rem;
  }

  &__close {
    cursor: pointer;
    font-size: 22px;
  }

  &__body {
    flex: 1;
    overflow: auto;
    & > * {
      box-sizing: border-box;
    }
  }

  &.ltr,
  &.rtl {
    height: 100%;
    top: 0;
    bottom: 0;
  }

  &.ttb,
  &.btt {
    width: 100%;
    left: 0;
    right: 0;
  }

  &.ltr {
    left: 0;
  }

  &.rtl {
    right: 0;
  }

  &.ttb {
    top: 0;
  }

  &.btt {
    bottom: 0;
  }
}

.drawer__container {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}

.drawer-fade-enter-active {
  animation: drawer-fade-in 0.3s;
}

.drawer-fade-leave-active {
  animation: drawer-fade-in 0.3s reverse;
}
</style>
