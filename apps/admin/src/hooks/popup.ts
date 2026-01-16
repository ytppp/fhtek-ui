import { createApp, type App, type Component } from 'vue'

const createMountRoot = () => {
  const el = document.createElement('div')
  return el
}

export const usePopup = (content: Component, appendedEl = document.body) => {
  const el = createMountRoot()

  let app: App<Element> | null = null
  const oldOverflow = ''

  // mount popup
  const show = () => {
    app = createApp(content)
    app.mount(el)
    appendedEl.appendChild(el)
    // oldOverflow = appendedEl.style.overflow
    appendedEl.style.overflow = 'hidden'
  }
  // destroy popup
  const destroy = () => {
    if (app) {
      app.unmount()
      app = null
    }
    appendedEl.removeChild(el)
    // popup's parentNode doesn't update overflow status after appendedEl remove popup commponent,
    // so we need to handle it manually
    appendedEl.style.overflow = oldOverflow
    appendedEl.removeEventListener('touchmove', (e) => e.preventDefault(), false)
  }
  // close popup
  const close = () => {
    destroy()
  }

  return {
    show,
    destroy,
    close,
  }
}
