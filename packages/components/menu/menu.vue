<template>
  <ul class="menu" :class="[`menu--${mode}`]" :style="menuObj">
    <li
      v-for="menu in menuList"
      :key="menu.key"
      class="menu-item"
      :class="{ 'is-disabled': menu.disabled }"
      :style="getMenuStyleObj(menu, false)"
      @click="handleClick(menu)"
      @mouseenter="(e) => onMenuMouseEnter(e, menu)"
      @mouseleave="(e) => onMenuMouseLeave(e, menu)"
      @focus="(e) => onMenuMouseEnter(e, menu)"
      @blur="(e) => onMenuMouseLeave(e, menu)"
    >
      <div class="menu-item__main">
        <span
          :style="{
            transform:
              (menu.selected || menu.hovered) && isEnlargeFontSize ? 'scale(1.15)' : 'scale(1)',
          }"
        >
          {{ menu.label }}
        </span>
        <fh-icon
          class="menu-item__arrow"
          :class="{
            'menu-item__arrow--up': menu.showChild,
          }"
          :style="{
            color: textColor,
          }"
          name="icon-down"
          v-if="isShowChildMenu && menu.children"
        ></fh-icon>
      </div>
      <transition
        name="child-menu-animation"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <ul class="child-menu" v-if="isShowChildMenu && menu.children" v-show="menu.showChild">
          <li
            v-for="child in menu.children"
            :key="child.key"
            class="child-menu-item"
            :class="{ 'is-disabled': child.disabled }"
            :style="getMenuStyleObj(child, true)"
            @click.stop="handleClick(child)"
            @mouseenter="(e) => onMouseEnter(e, child)"
            @mouseleave="(e) => onMouseLeave(e, child)"
            @focus="(e) => onMouseEnter(e, child)"
            @blur="(e) => onMouseLeave(e, child)"
          >
            <div class="child-menu-item__main">
              <span
                :style="{
                  transform:
                    (child.selected || child.hovered) && isEnlargeFontSize
                      ? 'scale(1.15)'
                      : 'scale(1)',
                  fontSize: childMenuFontSizeCom,
                }"
              >
                {{ child.label }}
              </span>
            </div>
          </li>
        </ul>
      </transition>
    </li>
  </ul>
</template>

<script lang="ts">
import { ref, defineComponent, type PropType, type ExtractPublicPropTypes } from 'vue'
import { gsap } from 'gsap'

type MenuMode = 'horizontal' | 'vertical'

interface MenuItem {
  key: string
  label: string
  disabled?: boolean
  selected?: boolean
  hovered?: boolean
  showChild?: boolean
  children?: MenuItem[]
}

const menuProps = {
  mode: {
    type: String as PropType<MenuMode>,
    default: 'horizontal',
  },
  active: {
    type: String,
    required: true,
  },
  menus: {
    type: Array as PropType<MenuItem[]>,
    default: () => [],
  },
  isShowChildMenu: {
    type: Boolean,
    default: true,
  }, // 是否显示子菜单
  timeout: {
    type: Number,
    default: 200,
  }, // 子菜单显示或关闭延迟时间
  fontSize: {
    type: String,
    default: '18px',
  },
  childMenuFontSize: String,
  textColor: {
    type: String,
    default: '#303133',
  }, // 菜单的文字颜色 （仅支持 hex 格式）
  backgroundColor: {
    type: String,
    default: '#fff',
  }, // 菜单的背景色 （仅支持 hex 格式）
  hoverTextColor: String, // 鼠标hover菜单的文字颜色 （仅支持 hex 格式）
  hoverBackgroundColor: String, // 鼠标hover菜单的背景色 （仅支持 hex 格式）
  hoverChildMenuTextColor: String, // 鼠标hover子菜单的文字颜色 （仅支持 hex 格式）
  hoverChildMenuBackgroundColor: String, // 鼠标hover子菜单的背景色 （仅支持 hex 格式），不设置此项是使用 hoverBackgroundColor
  activeTextColor: String, // 激活菜单的文字颜色 （仅支持 hex 格式）
  activeBackgroundColor: String, // 激活菜单的背景颜色 （仅支持 hex 格式）
  activeChildMenuTextColor: String, // 激活子菜单的文字颜色 （仅支持 hex 格式），不设置此项是使用 activeTextColor
  activeChildMenuBackgroundColor: String, // 激活子菜单的背景颜色 （仅支持 hex 格式），不设置此项是使用 activeBackgroundColor
  isEnlargeFontSize: {
    type: Boolean,
    default: false,
  }, // hover或激活时是否放大文本
  accordion: {
    type: Boolean,
    default: true,
  }, // 是否开启手风琴效果
} as const

export type IMenuProps = ExtractPublicPropTypes<typeof menuProps>

export default defineComponent({
  name: 'FhMenu',
  props: menuProps,
  computed: {
    isHorizontal() {
      return this.mode === 'horizontal'
    },
    isVertical() {
      return this.mode === 'vertical'
    },
    menuObj() {
      return {
        fontSize: this.fontSize,
        backgroundColor: this.backgroundColor,
      }
    },
    childMenuFontSizeCom() {
      return this.childMenuFontSize ? this.childMenuFontSize : this.fontSize
    },
  },
  watch: {
    menus() {
      this.menuList = this.cleanMenu(this.menus, this.active)
    },
    active() {
      this.menuList = this.cleanMenu(this.menus, this.active)
    },
  },
  emits: ['click'],
  methods: {
    isActiveMenu(arr: MenuItem[], val: string): boolean {
      if (!Array.isArray(arr)) {
        return false
      }
      return arr.some((item) => {
        if (!item) return false

        if (item.key === val) {
          return true
        }

        const children = item.children
        if (Array.isArray(children) && children.length > 0) {
          return this.isActiveMenu(children, val)
        }

        return false
      })
    },
    cleanMenu(arr: MenuItem[], active: string): MenuItem[] {
      return arr.map((item) => {
        if (item.children) {
          const flag = this.isActiveMenu(item.children, active)
          const menuCleaned = {
            ...item,
            showChild: flag, // 是否展开子菜单
            selected: flag, // 是否选中
            hovered: false,
            children: this.cleanMenu(item.children, active),
          }
          if (flag && this.accordion && this.isVertical) {
            this.prevMenu = menuCleaned
          }
          return menuCleaned
        } else {
          const childMenuCleaned = {
            ...item,
            selected: active === item.key,
            hovered: false,
          }
          if (active === item.key) {
            this.activeMenu = childMenuCleaned
          }
          return childMenuCleaned
        }
      }) as MenuItem[]
    },
    getColorChannels(color: string) {
      color = color.replace('#', '')
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        const colorArr = color.split('')
        for (let i = 2; i >= 0; i--) {
          colorArr.splice(i, 0, colorArr[i]!)
        }
        color = colorArr.join('')
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16),
        }
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255,
        }
      }
    },
    mixColor(color: string, percent: number) {
      let { red, green, blue } = this.getColorChannels(color)
      if (percent > 0) {
        // shade given color
        red *= 1 - percent
        green *= 1 - percent
        blue *= 1 - percent
      } else {
        // tint given color
        red += (255 - red) * percent
        green += (255 - green) * percent
        blue += (255 - blue) * percent
      }
      return `rgb(${Math.round(red)}, ${Math.round(green)}, ${Math.round(blue)})`
    },
    onMenuMouseEnter(e: Event, menu: MenuItem) {
      if (menu.selected) {
        return
      }
      this.onMouseEnter(e, menu)
      if (menu.hasOwnProperty('showChild') && this.isHorizontal && this.isShowChildMenu) {
        menu.showChild = !menu.showChild
      }
    },
    onMenuMouseLeave(e: Event, menu: MenuItem) {
      if (menu.selected) {
        return
      }
      this.onMouseLeave(e, menu)
      if (menu.hasOwnProperty('showChild') && this.isHorizontal && this.isShowChildMenu) {
        menu.showChild = !menu.showChild
      }
    },
    onMouseEnter(e: Event, menu: MenuItem) {
      if (menu.selected) {
        return
      }
      menu.hovered = true
    },
    onMouseLeave(e: Event, menu: MenuItem) {
      if (menu.selected) {
        return
      }
      menu.hovered = false
    },
    beforeEnter(el: Element) {
      if (el instanceof HTMLElement) {
        el.style.height = '0'
      }
    },
    enter(el: Element, done: () => void) {
      setTimeout(() => {
        let height = 0
        for (let i = 0; i < el.childElementCount; i++) {
          height += (el.children[i] as HTMLElement).clientHeight
        }
        gsap.to(el, {
          height: `${height}px`,
          duration: 0.2,
          ease: 'power2.inOut',
          onComplete: done,
        })
      })
    },
    leave(el: Element, done: () => void) {
      gsap.to(el, { height: 0, duration: 0.2, ease: 'power2.inOut', onComplete: done })
    },
    handleClick(menu: MenuItem) {
      if (menu.hasOwnProperty('showChild') && this.isVertical && this.isShowChildMenu) {
        if (this.accordion) {
          if (!this.prevMenu) {
            menu.showChild = !menu.showChild
          } else {
            if (this.prevMenu == menu) {
              menu.showChild = !menu.showChild
            } else {
              this.prevMenu.showChild = false
              menu.showChild = true
            }
          }
          this.prevMenu = menu
        } else {
          menu.showChild = !menu.showChild
        }
      } else {
        this.$emit('click', menu)
      }
    },
    getMenuStyleObj(menu: MenuItem, isChildMenu: boolean) {
      if (menu.selected) {
        return {
          backgroundColor: this.getColor(isChildMenu, 'active', 'Background'),
          color: this.getColor(isChildMenu, 'active', 'Text'),
        }
      }
      if (menu.hovered) {
        return {
          backgroundColor: this.getColor(isChildMenu, 'hover', 'Background'),
          color: this.getColor(isChildMenu, 'hover', 'Text'),
        }
      }
      return {
        backgroundColor: this.backgroundColor,
        color: this.textColor,
      }
    },
    getColor(isChildMenu: boolean, action: 'hover' | 'active', type: 'Background' | 'Text') {
      if (action === 'active') {
        if (type === 'Background') {
          const color = this.activeBackgroundColor
            ? this.activeBackgroundColor
            : this.backgroundColor
          if (isChildMenu) {
            return this.activeChildMenuBackgroundColor ? this.activeChildMenuBackgroundColor : color
          }
          return color
        }
        if (type === 'Text') {
          const color = this.activeTextColor ? this.activeTextColor : this.textColor
          if (isChildMenu) {
            return this.activeChildMenuTextColor ? this.activeChildMenuTextColor : color
          }
          return color
        }
      }
      if (action === 'hover') {
        if (type === 'Background') {
          const color = this.hoverBackgroundColor
            ? this.hoverBackgroundColor
            : this.mixColor(this.backgroundColor, 0.8)
          if (isChildMenu) {
            return this.hoverChildMenuBackgroundColor ? this.hoverChildMenuBackgroundColor : color
          }
          return color
        }
        if (type === 'Text') {
          const color = this.hoverTextColor ? this.hoverTextColor : this.textColor
          if (isChildMenu) {
            return this.hoverChildMenuTextColor ? this.hoverChildMenuTextColor : color
          }
          return color
        }
      }
    },
  },
  mounted() {
    this.menuList = this.cleanMenu(this.menus, this.active)
  },
  setup() {
    const menuList = ref<MenuItem[]>([])
    const prevMenu = ref<MenuItem>()
    const activeMenu = ref<MenuItem>()
    return {
      menuList,
      prevMenu,
      activeMenu,
    }
  },
})
</script>

<style lang="less">
.menu {
  display: flex;
  .menu-item {
    list-style: none;
    position: relative;
    .menu-item__main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      cursor: pointer;
      box-sizing: border-box;
      span {
        transition: transform 200ms linear;
      }
    }
    .menu-item__arrow {
      margin-left: 6px;
      color: #fff;
      transition: transform 0.3s linear;
      &.menu-item__arrow--up {
        transform: rotate(180deg);
      }
    }
  }
  .child-menu {
    position: absolute;
    top: 100%;
    left: 0;
    .child-menu-item {
      list-style: none;
      .child-menu-item__main {
        box-sizing: border-box;
        cursor: pointer;
        span {
          transition: transform 200ms linear;
        }
      }
    }
    // ?
    &.child-menu-animation-enter-active,
    &.child-menu-animation-leave-active {
      overflow: hidden;
    }
  }
  &.menu--vertical {
    flex-direction: column;
    .menu-item {
      .menu-item__main {
        flex-wrap: wrap;
        padding: 12px 20px;
      }
      &:first-child {
        margin-top: 0;
      }
    }
    .child-menu {
      position: static;
      flex-wrap: 1;
      width: 100%;
      .child-menu-item {
        width: 100%;
        .child-menu-item__main {
          padding: 12px 30px;
        }
      }
    }
  }
  &.menu--horizontal {
    height: 100%;
    line-height: 60px;
    .menu-item {
      .menu-item__main {
        padding: 0 30px;
      }
    }
    .child-menu {
      top: calc(100% + 5px);
      width: 100%;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: -10px 9px 21px 0 rgba(128, 152, 213, 0.08);
      .child-menu-item {
        .child-menu-item__main {
          display: flex;
          align-items: center;
          padding: 0 10px;
          line-height: 38px;
        }
      }
    }
  }
}
</style>
