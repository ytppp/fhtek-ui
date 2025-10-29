<template>
  <div class="markdown-preview-container">
    <aside class="toc-sidebar" :class="{ 'toc-collapsed': isCollapsed }" v-if="isShowToc">
      <div class="toc-header">
        <h3>文章目录</h3>
        <button class="toggle-btn" @click="isCollapsed = !isCollapsed" aria-label="切换目录显示">
          {{ isCollapsed ? '→' : '←' }}
        </button>
      </div>
      <nav class="toc-nav" v-if="!isCollapsed || isMobileView">
        <ul class="toc-list" v-if="TocItems.length">
          <li
            v-for="(item, index) in TocItems"
            :key="index"
            :class="['toc-item', `level-${item.level}`]"
          >
            <a
              :href="`#${item.id}`"
              @click.prevent="scrollToAnchor(item.id)"
              :class="{ active: activeAnchor === item.id }"
            >
              {{ item.text }}
            </a>
          </li>
        </ul>
        <p class="no-toc" v-else>无目录</p>
      </nav>
    </aside>
    <button class="mobile-toc-toggle" @click="isMobileView = !isMobileView" v-if="isMobile">
      {{ isMobileView ? '关闭目录' : '显示目录' }}
    </button>
    <main class="markdown-content">
      <div class="markdown-html" v-html="renderedMarkdown" @click="handleContentClick"></div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick, withDefaults } from 'vue'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useIsMobile } from '@fhtek-ui/hooks/is-mobile'

defineOptions({
  name: 'FhMarkdownPreview',
})

export interface IMarkdownPreviewProps {
  content: string
  showToc?: boolean
}

interface ITocItem {
  id: string
  text: string
  level: number
}

const props = withDefaults(defineProps<IMarkdownPreviewProps>(), {
  content: '',
  showToc: true,
})

const { isMobile } = useIsMobile()
const renderedMarkdown = ref<string>('')
const TocItems = ref<ITocItem[]>([])
const activeAnchor = ref<string>('')
const isCollapsed = ref<boolean>(props.showToc)
const isMobileView = ref<boolean>(false)
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

const isShowToc = computed(() => {
  if (!props.showToc) return false
  if (isMobile.value) {
    return isMobileView.value
  }
  return true
})

const processMarkdown = (md: string): void => {
  if (!md) {
    renderedMarkdown.value = ''
    TocItems.value = []
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
  TocItems.value = toc
}

const checkActiveHeading = (): void => {
  if (!TocItems.value.length) return

  const scrollPosition = window.scrollY + 100

  for (let i = TocItems.value.length - 1; i >= 0; i--) {
    const item = TocItems.value[i]
    if (!item) continue
    const element = document.getElementById(item.id)
    if (element && element.offsetTop <= scrollPosition) {
      activeAnchor.value = item.id
      break
    }
  }
}

watch(
  () => props.content,
  (newVal) => {
    processMarkdown(newVal)
    nextTick(() => {
      checkActiveHeading()
    })
  },
  { immediate: true },
)

const scrollToAnchor = (id: string): void => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeAnchor.value = id
    if (isMobile.value) {
      isMobileView.value = false
    }
  }
}

const handleContentClick = (): void => {
  if (isMobile.value && isMobileView.value) {
    isMobileView.value = false
  }
}

onMounted(() => {
  const handleScroll = (): void => {
    checkActiveHeading()
  }

  window.addEventListener('scroll', handleScroll)

  const handleResize = (): void => {
    if (!isMobile.value) {
      isMobileView.value = false
    }
  }

  window.addEventListener('resize', handleResize)

  handleResize()
  checkActiveHeading()

  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style lang="less" scoped>
@primary-color: #0d6efd;
@text-color: #333;
@text-color-secondary: #495057;
@text-color-tertiary: #6c757d;
@border-color: #e9ecef;
@bg-color: #f8f9fa;
@code-bg-color: #2d2d2d;
@code-text-color: #f8f8f2;
@transition-speed: 0.3s;
@mobile-breakpoint: 768px;

.markdown-preview-container {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.toc-sidebar {
  width: 280px;
  background-color: @bg-color;
  border-right: 1px solid @border-color;
  padding: 1rem;
  transition: width @transition-speed ease;
  overflow-y: auto;
  height: 100vh;
  position: sticky;
  top: 0;
  box-sizing: border-box;

  &.toc-collapsed {
    width: 50px;
    overflow: hidden;
  }

  .toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid @border-color;

    h3 {
      margin: 0;
      font-size: 1.2rem;
      color: @text-color;
    }
  }

  .toggle-btn {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: @text-color-tertiary;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: @border-color;
    }
  }

  .toc-nav {
    height: calc(100% - 50px);
    overflow-y: auto;

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .toc-item {
        margin-bottom: 0.5rem;

        a {
          text-decoration: none;
          color: @text-color-secondary;
          display: block;
          padding: 0.3rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &:hover {
            background-color: @border-color;
            color: #212529;
          }

          &.active {
            background-color: @primary-color;
            color: white;
            font-weight: 500;
          }
        }

        &.level-1 {
          padding-left: 0;
        }
        &.level-2 {
          padding-left: 1rem;
        }
        &.level-3 {
          padding-left: 2rem;
        }
        &.level-4,
        &.level-5,
        &.level-6 {
          padding-left: 3rem;
        }
      }
    }

    .no-toc {
      color: @text-color-tertiary;
      text-align: center;
      padding: 1rem;
      margin: 0;
    }
  }
}

.markdown-content {
  flex: 1;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  .markdown-html {
    color: @text-color;
    line-height: 1.8;

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 2rem;
      margin-bottom: 1rem;
      color: #212529;
    }

    p {
      margin-bottom: 1rem;
    }

    ul,
    ol {
      margin-bottom: 1rem;
      padding-left: 2rem;
    }

    pre {
      background-color: @code-bg-color;
      color: @code-text-color;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin-bottom: 1rem;
    }

    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.9rem;
    }

    blockquote {
      border-left: 4px solid @primary-color;
      padding-left: 1rem;
      margin-left: 0;
      color: @text-color-tertiary;
      margin-bottom: 1rem;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      margin: 1rem 0;
    }

    a {
      color: @primary-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;

      th,
      td {
        border: 1px solid @border-color;
        padding: 0.75rem;
        text-align: left;
      }

      th {
        background-color: @bg-color;
      }
    }
  }
}

.mobile-toc-toggle {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  background-color: @primary-color;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

@media (max-width: @mobile-breakpoint) {
  .toc-sidebar {
    position: fixed;
    z-index: 90;
    transform: translateX(-100%);
    transition: transform @transition-speed ease;

    &:not(.toc-collapsed) {
      transform: translateX(0);
    }
  }

  .mobile-toc-toggle {
    display: block;
  }

  .markdown-content {
    padding: 1rem;
  }
}
</style>
