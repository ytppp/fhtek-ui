<template>
  <div class="layout" ref="layout">
    <fh-header :menus="menus" ref="layoutHeader" />
    <main class="layout__main" :style="!isMobile && { marginTop: `${layoutMainMarginTop}px` }">
      <template v-if="hasChildPage">
        <aside class="layout__aside" ref="layoutAside" :style="{ top: `${layoutAsideTop}px` }">
          <div class="aside" :style="{ backgroundColor: asideBgColor }">
            <fh-menu
              :menus="childMenus"
              :active="url"
              :background-color="asideBgColor"
              child-menu-font-size="16px"
              mode="vertical"
              active-key-name="url"
              text-color="#333"
              hover-text-color="#333"
              hover-background-color="#FFF"
              active-text-color="#FFF"
              active-background-color="#D6001C"
              active-child-menu-text-color="#333"
              active-child-menu-background-color="#FFF"
              @click="handleMenuItemClick"
            >
            </fh-menu>
          </div>
        </aside>
        <slot></slot>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </main>
    <fh-footer v-if="isNoAuthPage" />
    <div class="layout__toolbar-wrap" v-if="!isNoAuthPage && menus.length <= toolbarMaxShowTotal">
      <ul class="layout__toolbar toolbar">
        <li
          v-for="(menu, index) in menus"
          :key="index"
          class="toolbar__item"
          :class="isToolbarActive(menu) && 'toolbar-item--active'"
          @click="() => handleMenuItemClick(menu)"
        >
          <fh-icon class="toolbar__icon" :name="menu.icon"></fh-icon>
          <span class="toolbar__text">{{ $t(menu.text) }}</span>
        </li>
      </ul>
    </div>
    <fh-drawer size="90%" v-model:visible="drawer" :appendToBody="true" v-if="isMobile">
      <div :style="{ height: '100%', backgroundColor: asideBgColor }">
        <fh-menu
          :menus="childMenus"
          :active="url"
          :background-color="asideBgColor"
          child-menu-font-size="16px"
          mode="vertical"
          active-key-name="url"
          text-color="#333"
          hover-text-color="#333"
          hover-background-color="#FFF"
          active-text-color="#FFF"
          active-background-color="#D6001C"
          active-child-menu-text-color="#333"
          active-child-menu-background-color="#FFF"
          @click="handleMenuItemClick"
        >
        </fh-menu>
      </div>
    </fh-drawer>
  </div>
</template>

<script>
import { mapStores, mapActions } from 'pinia'
import { getMenu } from '@/util/menu'
import { isMobileDevice, isObjArrHasVal, handleLogout } from '@/util/tool'
import { getDevModel, getLoginTimeout } from '@/http/api'
import { loginPath } from '@/router'
import { useDataClean } from '@/hooks/data-clean'
import { useAppStore } from '@/stores/app-store'

// 若多维对象数组中存在某个值，返回其顶级对象
const getTopObjFromObjArr = (arr, val, childNodeName = 'children', keyName = 'url') => {
  return arr.find((item) => {
    if (item[childNodeName]) {
      return getTopObjFromObjArr(item[childNodeName], val, childNodeName, keyName)
    } else {
      return item[keyName] === val
    }
  })
}
// 返回多维对象数组不存在children的第一个对象
const getObjFromObjArr = (arr, childNodeName = 'children', keyName = 'url') => {
  let menu = null
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    if (item[childNodeName]) {
      return getObjFromObjArr(item[childNodeName], childNodeName, keyName)
    } else {
      return (menu = item)
    }
  }
  return menu
}
const { convertBooleanStatus } = useDataClean()
export default {
  data() {
    return {
      title: '',
      url: location.hash.replace('#', ''),
      layoutMainMarginTop: 30,
      layoutHeaderHeight: 70,
      toolbarMaxShowTotal: 6, // 最多显示的菜单数量
      asideBgColor: '#DDDDDD',
      isMobile: false,
      drawer: false,
      loginTimeoutTimer: null,
    }
  },
  computed: {
    ...mapStores(useAppStore),
    isNoAuthPage() {
      return [loginPath, '/guide'].includes(this.url)
    },
    hasChildPage() {
      return this.childMenus.length > 0
    },
    menus() {
      return getMenu(
        VITE_CUSTOMER_CONFIG.name,
        this.appStore.role,
        this.appStore.mode,
        this.appStore.meshRole,
      )
    },
    childMenus() {
      if (!this.url.length) return
      const arr = getTopObjFromObjArr(this.menus, this.url)
      if (arr && arr.children) {
        return arr.children
      } else {
        return []
      }
    },
    layoutAsideTop() {
      return this.isMobile
        ? this.layoutHeaderHeight
        : this.layoutMainMarginTop + this.layoutHeaderHeight
    },
  },
  watch: {
    $route(val) {
      this.url = val.path
      this.startLoginTimeoutCheck()
    },
  },
  methods: {
    ...mapActions(useAppStore, ['loadFromStorage']),
    isToolbarActive(menu) {
      if (menu.children) {
        return isObjArrHasVal(menu.children, this.url)
      }
      return menu.url === this.url
    },
    handleMenuItemClick(menuObj) {
      let menu = null
      if (menuObj.children) {
        menu = getObjFromObjArr(menuObj.children)
      } else {
        menu = menuObj
      }
      if (this.drawer) this.drawer = false
      this.$router.push(`${menu.url}?t=${Date.now()}`)
    },
    setHeight() {
      const contentMinHeight = 600 // 定义内容区域最小高度
      const height = Math.max(document.body.clientHeight, contentMinHeight)
      this.$refs.layout.style.minHeight = `${height}px`
      if (this.$refs.layoutAside) {
        const height =
          document.body.clientHeight -
          this.$refs.layoutHeader.$el.offsetHeight -
          this.layoutMainMarginTop
        this.$refs.layoutAside.style.maxHeight = `${height}px`
      }
    },
    showMobileMenu(menu) {
      this.childList.forEach((l) => {
        if (l !== menu) {
          l.selected = false
        }
      })
      menu.selected = !menu.selected
    },
    changeScreen() {
      this.setHeight()
      this.isMobile = isMobileDevice()
    },
    getDevInfoData() {
      const productName = sessionStorage.getItem('product_name')
      if (productName) {
        this.title = productName
        return
      }
      getDevModel().then(({ data }) => {
        this.title = data.model
        sessionStorage.setItem('product_name', this.title)
      })
    },
    getLoginTimeoutData() {
      getLoginTimeout().then(({ data }) => {
        if (convertBooleanStatus(data.timeout)) {
          handleLogout()
        }
      })
    },
    startLoginTimeoutCheck() {
      if (this.loginTimeoutTimer) return
      this.loginTimeoutTimer = setInterval(() => {
        if (this.isNoAuthPage) {
          this.stopLoginTimeoutCheck()
        } else {
          this.getLoginTimeoutData()
        }
      }, 1000 * 10)
    },
    stopLoginTimeoutCheck() {
      clearInterval(this.loginTimeoutTimer)
      this.loginTimeoutTimer = null
    },
  },
  created() {
    this.loadFromStorage()
  },
  mounted() {
    this.getDevInfoData()
    this.changeScreen()
    this.startLoginTimeoutCheck()
    if (window.addEventListener) {
      window.addEventListener('resize', this.changeScreen)
    } else if (window.attachEvent) {
      window.attachEvent('resize', this.changeScreen)
    }
  },
  beforeUnmount() {
    this.stopLoginTimeoutCheck()
    if (window.addEventListener) {
      window.removeEventListener('resize', this.changeScreen)
    } else if (window.attachEvent) {
      window.detachEvent('resize', this.changeScreen)
    }
  },
}
</script>

<style lang="less">
.layout {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #f5f6f8;
  .layout__main {
    flex: 1;
    display: flex;
    justify-content: center;
    @media screen and (max-width: 768px) {
      flex-direction: column;
      justify-content: flex-start;
      padding-bottom: 70px;
    }
  }
  .layout__toolbar-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    display: none;
    width: 100%;
    height: 70px;
    z-index: 1001;
    background-color: #fff;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }
  .layout__toolbar {
    height: 100%;
  }
  .toolbar {
    display: flex;
    justify-content: space-around;
    .toolbar__item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      &.toolbar-item--active {
        color: @primaryColor;
      }
    }
    .toolbar__icon {
      font-size: 22px;
    }
    .toolbar__text {
      margin-top: 5px;
    }
  }
  .layout__aside {
    width: 280px;
    position: sticky;
    @media screen and (max-width: 768px) {
      display: none;
    }
    .aside {
      height: 100%;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      overflow: auto;
    }
  }
}
</style>
