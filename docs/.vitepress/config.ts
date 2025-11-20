import { defineConfig } from 'vitepress'
import path from 'path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          {
            text: 'Components',
            items: [{ text: 'Button', link: '/components/button' }],
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "${path.resolve(__dirname, '../../packages/components/assets/style/variables.less')}";`,
          javascriptEnabled: true,
        },
      },
    },
  },
})
