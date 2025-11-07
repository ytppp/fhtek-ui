import type { App, Component, Plugin } from 'vue'

export const withInstall = <T extends Component>(component: T) => {
  const c = component as any
  c.install = (app: App) => {
    app.component(c.name, c)
  }
  return c as T & Plugin
}
