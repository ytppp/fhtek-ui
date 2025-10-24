import { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import FhtekUI from '@fhtek-ui/components'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(FhtekUI)
  },
} as Theme
