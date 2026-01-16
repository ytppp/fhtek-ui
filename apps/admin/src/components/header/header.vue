<template>
  <header
    class="header"
    :class="{
      'is-login-header': isNoAuthPage,
    }"
    :style="{ height: `${layoutHeaderHeight}px` }"
  >
    <div class="header__center-wrap">
      <div class="logo">
        <img class="logo__img" v-show="isNoAuthPage || !isMobile" :src="logoSrc" alt="" />
        <span class="logo__title" v-show="(isNoAuthPage || !isMobile) && title">{{ title }}</span>
        <fh-icon
          class="logo__drawer-toggle"
          :name="`icon-${drawer ? 'close' : 'menu'}`"
          @click="toggleDrawer"
          v-if="!isNoAuthPage && isMobile && hasChildPage"
        ></fh-icon>
      </div>
      <div class="nav-wrap" v-if="!isNoAuthPage">
        <div class="nav-active-text" v-if="activeMenuText">{{ $t(activeMenuText) }}</div>
        <fh-menu
          class="nav"
          :menus="menus"
          :active="url"
          mode="horizontal"
          :is-show-child-menu="false"
          active-key-name="url"
          background-color="#474747"
          hover-background-color="#474747"
          text-color="#fff"
          active-text-color="#fff"
          active-background-color="#D6001C"
          :is-enlarge-font-size="true"
          @click="handleMenuItemClick"
          ref="headerMenu"
        >
        </fh-menu>
      </div>
      <div class="right-wrap">
        <!-- lang selector -->
        <div
          class="lang-selector"
          :class="{ open: showPopup }"
          @mouseenter="setLangPopupVisible(true)"
          @mouseleave="setLangPopupVisible(false)"
          v-if="Languages.length > 1"
        >
          <div class="current" @click.stop="setLangPopupVisible(true)">
            <span class="current-text">{{ language.text }}</span>
            <span class="drop-trangle" :class="{ down: !showPopup, up: showPopup }"></span>
            <fh-icon name="icon-translate" class="current-mobile"></fh-icon>
          </div>
          <transition name="popup">
            <ul class="popup" v-show="showPopup">
              <li
                :key="lang.value"
                v-for="lang in Languages"
                :class="{ selected: $i18n.locale === lang.value }"
                @click="selectLang(lang)"
              >
                {{ lang.text }}
                <i v-if="$i18n.locale === lang.value" class="is-checked"></i>
              </li>
            </ul>
          </transition>
        </div>
        <!-- help -->
        <div class="exit" @click="handleHelpClick" v-if="!isNoAuthPage">
          <span class="exit-text">{{ $t('trans0947') }}</span>
          <fh-icon name="icon-version" class="exit-mobile"></fh-icon>
        </div>
        <!-- exit -->
        <div class="exit" @click="exit" v-if="!isNoAuthPage">
          <span class="exit-text">{{ $t('trans0018') }}</span>
          <fh-icon name="icon-logout" class="exit-mobile"></fh-icon>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { getPublicFile, handleLogout } from '@/util/tool'
import { changeLanguage } from '@/i18n'

const LanguagesArr = [
  {
    text: 'English',
    value: 'en-US',
    show: false,
  },
  {
    text: '简体中文',
    value: 'zh-CN',
    show: false,
  },
  {
    text: 'Deutsch',
    value: 'de-DE',
    show: false,
  },
  {
    text: 'Nederlands',
    value: 'nl-NL',
    show: false,
  },
  {
    text: 'Srpski',
    value: 'sr-RS',
    show: false,
  },
  {
    text: 'Norsk bokmål',
    value: 'nb-NO',
    show: false,
  },
  {
    text: 'Français',
    value: 'fr-FR',
    show: false,
  },
  {
    text: 'Español',
    value: 'es-ES',
    show: false,
  },
]
__APP_CUSTOMER_CONFIG__.languages.forEach((sl) => {
  const language = LanguagesArr.filter((l) => l.value === sl)[0]
  if (language) {
    language.show = true
  }
})

export default {
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menuMode: 'horizontal',
      showPopup: false,
      Languages: LanguagesArr.filter((l) => l.show),
      current: null,
      navVisible: true,
      logoSrc: getPublicFile(__APP_CUSTOMER_CONFIG__.logo),
      activeMenuText: '',
    }
  },
  computed: {
    language() {
      return this.getDefaultLanguage()
    },
    title() {
      return this.$parent.title
    },
    url() {
      return this.$parent.url
    },
    layoutHeaderHeight() {
      return this.$parent.layoutHeaderHeight
    },
    isNoAuthPage() {
      return this.$parent.isNoAuthPage
    },
    isMobile() {
      return this.$parent.isMobile
    },
    hasChildPage() {
      return this.$parent.hasChildPage
    },
    drawer() {
      return this.$parent.drawer
    },
  },
  watch: {
    menus() {
      if (this.$refs.headerMenu) {
        this.activeMenuText = this.$refs.headerMenu.activeMenu.text
      }
    },
  },
  methods: {
    toggleDrawer() {
      this.$parent.drawer = true
    },
    handleMenuItemClick(menu) {
      this.$parent.handleMenuItemClick(menu)
    },
    getDefaultLanguage() {
      const language = this.Languages.filter((l) => l.value === this.$i18n.locale)[0]
      if (!language) {
        return this.Languages[0]
      }
      return language
    },
    setLangPopupVisible(visible) {
      this.showPopup = visible
    },
    selectLang(lang) {
      changeLanguage(lang.value)
      this.showPopup = false
    },
    exit() {
      this.$dialog
        .confirm({
          okText: this.$t('trans0019'),
          cancelText: this.$t('trans0020'),
          message: this.$t('trans0021'),
        })
        .then(() => {
          handleLogout()
        })
        .catch(() => {})
    },
    close() {
      this.showPopup = false
    },
    handleHelpClick() {
      this.$router.push({ path: '/help' })
    },
  },
  mounted() {
    if (this.$refs.headerMenu?.activeMenu) {
      this.activeMenuText = this.$refs.headerMenu.activeMenu.text
    }
    this.$i18n.locale = this.language.value
    window.addEventListener('click', this.close)
  },
  beforeUnmount() {
    window.removeEventListener('click', this.close)
  },
}
</script>

<style lang="less">
.header {
  background: @header-background-color;
  position: sticky;
  width: 100%;
  left: 0;
  top: 0;
  color: @header-color;
  box-sizing: border-box;
  z-index: 100;
  .header__center-wrap {
    position: relative;
    max-width: 1920px;
    height: 100%;
    margin: 0 auto;
  }
  &.is-login-header {
    border-bottom: 1px solid #dee2e6;
    background: @header-nav-hide-background-color;
    color: @header-nav-hide-color;
    .logo {
      padding-right: 0;
      .logo__img {
        filter: grayscale(100%);
      }
      .logo__title {
        border-color: #000;
        color: #000;
      }
    }
    .right-wrap {
      .lang-selector {
        .current {
          &:hover {
            .current-text {
              color: @header-nav-item-hover-color;
            }
            .drop-trangle {
              &::after {
                border-top-color: @header-nav-item-hover-color;
              }
            }
          }
          .drop-trangle {
            &::after {
              border-top-color: @header-nav-hide-trangle-color;
            }
          }
        }
        .popup {
          box-shadow: 0 2px 8px 0 @header-nav-hide-popup-shadow-color;
          background-color: @header-nav-hide-popup-background-color;
          li {
            &:hover {
              background: @header-nav-hide-popup-item-hover-background-color;
              color: @header-nav-hide-popup-item-hover-color;
            }
            &.selected {
              color: @header-nav-hide-popup-item-selected-color;
              .is-checked {
                &::after {
                  border-color: @header-nav-hide-popup-item-checked-color;
                }
              }
            }
          }
        }
      }
    }
  }
  .logo {
    display: flex;
    align-items: center;
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translateY(-50%);
    @media screen and (max-width: 768px) {
      left: 4%;
    }
    .logo__img {
      height: 50px;
      @media screen and (max-width: 1400px) {
        display: none;
      }
    }
    .logo__title {
      padding-left: 10px;
      border-left: 2px solid @header-popup-item-color;
      color: @header-popup-item-color;
      font-weight: bold;
      white-space: nowrap;
      font-size: 20px;
      @media screen and (max-width: 1400px) {
        padding-left: 0;
        border-left: none;
      }
    }
    .logo__drawer-toggle {
      font-size: 22px;
    }
  }
  .nav-wrap {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 100%;
    z-index: 1000;
    @media screen and (max-width: 768px) {
      width: auto;
    }
    .nav-active-text {
      display: none;
      @media screen and (max-width: 768px) {
        display: inline-flex;
        font-size: 18px;
        height: 100%;
        align-items: center;
        text-align: center;
      }
    }
    .nav {
      @media screen and (max-width: 768px) {
        display: none;
      }
    }
  }
  .right-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    @media screen and (max-width: 768px) {
      right: 4%;
    }
    .lang-selector {
      height: 100%;
      cursor: pointer;
      position: relative;
      font-size: 18px;
      &:hover {
        .current {
          .current-text {
            color: @header-nav-item-hover-color;
          }
          .drop-trangle {
            &::after {
              border-top-color: @header-nav-item-hover-color;
            }
          }
        }
      }
      .current {
        height: 100%;
        display: flex;
        align-items: center;
        .current-text {
          display: inline-block;
          width: 100px;
          text-align: center;
        }
        .drop-trangle {
          display: inline-block;
          width: 10px;
          height: 5px;
          position: relative;
          &:after {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border-top: 5px solid @header-nav-item-color;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
          }
          transition: transform 0.3s linear;
          &.up {
            transform: rotate(180deg);
          }
          &.down {
            transform: rotate(0);
          }
        }
        .current-mobile {
          display: none;
        }
        @media screen and (max-width: 1400px) {
          .current-text,
          .drop-trangle {
            display: none;
          }
          .current-mobile {
            display: inline-block;
            font-size: 22px;
          }
        }
      }
      .popup {
        position: absolute;
        right: 0;
        width: 180px;
        margin-top: 6px;
        border-radius: 2px;
        box-shadow: -10px 9px 21px 0 @header-popup-shadow-color;
        background-color: @header-popup-background-color;
        padding: 25px 0;
        opacity: 1;
        &.popup-enter-active {
          transition: opacity 0.2s ease-in;
        }
        &.popup-leave-active {
          transition: opacity 0.2s ease-out;
        }
        &.popup-enter-from,
        &.popup-leave-to {
          opacity: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          list-style: none;
          line-height: 38px;
          padding: 0 30px;
          &:hover {
            background: @header-popup-item-hover-background-color;
            color: @header-popup-item-hover-color;
          }
          &:last-child {
            margin-bottom: 0;
          }
          &.selected {
            color: @header-popup-item-selected-color;
            .is-checked {
              &::after {
                border-color: @header-popup-item-checked-color;
              }
            }
          }
        }
      }
    }
    .exit {
      display: inline-block;
      cursor: pointer;
      margin-left: 25px;
      font-size: 18px;
      .exit-text {
        &:hover {
          color: @header-nav-item-hover-color;
        }
      }
      .exit-mobile {
        display: none;
      }
      @media screen and (max-width: 1400px) {
        margin-left: 15px;
        .exit-text {
          display: none;
        }
        .exit-mobile {
          display: inline-block;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
