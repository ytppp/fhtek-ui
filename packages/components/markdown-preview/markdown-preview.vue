<template>
  <div class="markdown-preview">
    <aside
      class="markdown-preview__toc toc"
      :class="{ toc__collapsed: isCollapsed }"
      v-if="isShowToc"
    >
      <div class="toc__header">
        <h3>{{ t('markdownPreview.directory') }}</h3>
        <!-- <p>{{ t('markdownPreview.noCheckedFormat', { total: tocItems.length }) }}</p> -->
      </div>
      <nav class="toc__nav" ref="tocNavRef">
        <ul class="toc-list" v-if="tocItems.length" ref="tocListRef">
          <li
            v-for="(item, index) in tocItems"
            :key="index"
            class="toc-list__item"
            :class="[
              `toc-list__item-level-${item.level}`,
              { 'toc-list__item--actived': activeAnchor === item.id },
            ]"
            :ref="(el) => (tocItemRefs[index] = el as HTMLElement | null)"
          >
            <a
              :href="`#${item.id}`"
              class="ellipsis"
              @click.prevent="scrollToActiveAnchor(item.id)"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
        <p class="toc-list__empty" v-else>{{ t('markdownPreview.empty') }}</p>
      </nav>
      <div class="toc__footer" v-if="!isMobile">
        <fh-icon
          class="toc__btn-toggle-size"
          :name="isCollapsed ? 'icon-right' : 'icon-left'"
          @click="isCollapsed = !isCollapsed"
        >
        </fh-icon>
      </div>
    </aside>
    <main class="markdown-preview__content">
      <div class="markdown-body" v-html="renderedMarkdown" @click="handleContentClick"></div>
    </main>
    <fh-button
      class="markdown-preview__btn-toggle-display"
      @click="isOpenMobileNoc = !isOpenMobileNoc"
      v-if="isMobile && showToc"
    >
      {{ isOpenMobileNoc ? t('markdownPreview.show') : t('markdownPreview.hide') }}
    </fh-button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, withDefaults, onUnmounted } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import FhIcon from '@fhtek-ui/components/icon'
import { useIsMobile } from '@fhtek-ui/hooks/is-mobile'
import { useI18n } from '@fhtek-ui/locale'
import './github-markdown.css'

defineOptions({
  name: 'FhMarkdownPreview',
})

export interface IMarkdownPreviewProps {
  content: string
  showToc?: boolean
  scrollOffset?: number // 偏移距离，避免被顶部导航栏遮挡
}

interface ITocItem {
  id: string
  text: string
  level: number
}

const props = withDefaults(defineProps<IMarkdownPreviewProps>(), {
  content: '',
  showToc: true,
  scrollOffset: 0,
})

const { isMobile } = useIsMobile()
const { t } = useI18n()
const renderedMarkdown = ref<string>('')
const tocItems = ref<ITocItem[]>([])
const activeAnchor = ref<string>('')
const isCollapsed = ref<boolean>(false)
const isOpenMobileNoc = ref<boolean>(false)
const marked = new Marked(
  markedHighlight({
    highlight: (code: string, lang?: string) => {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value
      }
      return hljs.highlightAuto(code).value
    },
  }),
)

const tocNavRef = ref<HTMLElement | null>(null)
const tocListRef = ref<HTMLElement | null>(null)
const tocItemRefs = ref<(HTMLElement | null)[]>([]) // 存储每个目录项的DOM引用

const isShowToc = computed(() => {
  if (!props.showToc) return false
  if (isMobile.value) {
    return isOpenMobileNoc.value
  }
  return true
})

const processMarkdown = (md: string) => {
  if (!md) {
    renderedMarkdown.value = ''
    tocItems.value = []
    return
  }

  const toc: ITocItem[] = []
  let headingIndex = 0

  const renderer = {
    heading({ text, depth }: { text: string; depth: number }): string {
      const id = `heading-${headingIndex++}`
      toc.push({
        id,
        text,
        level: depth,
      })
      return `<h${depth} id="${id}">${text}</h${depth}>`
    },
  }
  marked.use({ renderer })
  renderedMarkdown.value = marked.parse(md) as string
  tocItems.value = toc
}

const handleScroll = () => {
  if (!tocItems.value.length) return

  for (let i = tocItems.value.length - 1; i >= 0; i--) {
    const item = tocItems.value[i]
    if (!item) continue
    const element = document.getElementById(item.id)
    const scrollPosition =
      window.scrollY + props.scrollOffset + (element ? element.getBoundingClientRect().height : 0)
    if (element && element.offsetTop <= scrollPosition) {
      // 只有当激活项变化时才更新，避免不必要的滚动
      if (activeAnchor.value !== item.id) {
        activeAnchor.value = item.id
        // 自动滚动目录到当前激活项
        scrollTocToActiveItem()
      }
      break
    }
  }
}

watch(
  () => props.content,
  (newVal) => {
    processMarkdown(newVal)
    nextTick(() => {
      handleScroll()
    })
  },
  { immediate: true },
)

watch(isMobile, (newVal) => {
  if (newVal) {
    isCollapsed.value = false
  }
})

watch(isShowToc, (newVal) => {
  if (newVal) {
    scrollTocToActiveItem()
  }
})

const scrollToActiveAnchor = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const targetPosition = window.scrollY + element.getBoundingClientRect().top - props.scrollOffset
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    })
    activeAnchor.value = id
    scrollTocToActiveItem()
    if (isMobile.value) {
      isOpenMobileNoc.value = false
    }
  }
}

const scrollTocToActiveItem = () => {
  if (!tocNavRef.value || !activeAnchor.value) return

  // 找到当前激活的目录项索引
  const activeIndex = tocItems.value.findIndex((item) => item.id === activeAnchor.value)
  if (activeIndex === -1) return

  const activeItem = tocItemRefs.value[activeIndex]
  if (!activeItem) return

  const tocNav = tocNavRef.value

  // 计算激活项在目录容器中的位置
  const itemTop = activeItem.offsetTop
  const itemHeight = activeItem.offsetHeight
  const navHeight = tocNav.offsetHeight

  // 计算需要滚动的位置（使激活项居中显示）
  const targetScrollTop = itemTop - navHeight / 2 + itemHeight / 2

  // 滚动目录
  tocNav.scrollTo({
    top: targetScrollTop,
    behavior: 'smooth',
  })
}

const handleContentClick = () => {
  if (isMobile.value && isOpenMobileNoc.value) {
    isOpenMobileNoc.value = false
  }
}

const handleResize = () => {
  if (!isMobile.value) {
    isOpenMobileNoc.value = false
  }
}

onMounted(() => {
  handleScroll()
  handleResize()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="less" scoped>
@text-color: #333;
@text-color-secondary: #495057;
@text-color-tertiary: #6c757d;
@border-color: #e9ecef;
@bg-color: #f8f9fa;
@code-bg-color: #2d2d2d;
@code-text-color: #f8f8f2;
@transition-speed: 0.3s;
@mobile-breakpoint: 768px;

.markdown-preview {
  display: flex;
  width: 100%;
  .markdown-preview__toc {
    position: sticky;
    top: 90px;
    padding: 1rem;
  }
  .markdown-preview__content {
    flex: 1;
    padding: 1rem;
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;
  }
  .markdown-preview__btn-toggle-display {
    position: fixed;
    bottom: 70px;
    right: 20px;
    z-index: 100;
    border: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
}

.toc {
  display: flex;
  flex-direction: column;
  width: 280px;
  background-color: @bg-color;
  border-right: 1px solid @border-color;
  transition: width @transition-speed ease;
  overflow-y: auto;
  max-height: 600px;
  &.toc__collapsed {
    width: 50px;
    overflow: hidden;
  }
  .toc__header {
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid @border-color;
    h3 {
      margin: 0;
      font-size: 2rem;
      color: @text-color;
    }
  }
  .toc__nav {
    flex: 1;
    overflow-y: auto;
  }
  .toc__footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid @border-color;
  }
  .toc__btn-toggle-size {
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background-color 0.2s;

    &:hover {
      background-color: @border-color;
    }
  }
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  .toc-list__item {
    margin-bottom: 0.5rem;
    a {
      text-decoration: none;
      color: @text-color-secondary;
      display: block;
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
      &:hover {
        background-color: @border-color;
        color: #212529;
      }
    }
    &.toc-list__item--actived {
      a {
        background-color: @primaryColor;
        color: white;
        font-weight: 500;
      }
    }
    &.toc-list__item-level-1 {
      padding-left: 0;
    }
    &.toc-list__item-level-2 {
      padding-left: 1rem;
    }
    &.toc-list__item-level-3 {
      padding-left: 2rem;
    }
    &.toc-list__item-level-4,
    &.toc-list__item-level-5,
    &.toc-list__item-level-6 {
      padding-left: 3rem;
    }
  }
  .toc-list__empty {
    color: @text-color-tertiary;
    text-align: center;
    padding: 1rem;
    margin: 0;
  }
}

@media (max-width: @mobile-breakpoint) {
  .markdown-preview {
    .markdown-preview__toc {
      position: fixed;
      left: 0;
      top: 70px;
      z-index: 90;
    }
  }
}
</style>
