import type { App, ObjectDirective, DirectiveBinding } from 'vue'

declare global {
  interface HTMLElement {
    __vueClickOutside__?: (event: Event) => void
  }
}

type ClickOutsideBinding = (event: Event) => void

export const vClickoutside: ObjectDirective<HTMLElement, ClickOutsideBinding> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ClickOutsideBinding>) {
    function documentHandler(e: Event) {
      if (el === e.target || (e.target instanceof Node && el.contains(e.target))) return
      if (typeof binding.value === 'function') {
        binding.value(e)
      }
    }

    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
    document.addEventListener('touchstart', documentHandler)
  },
  beforeUnmount(el: HTMLElement) {
    if (el.__vueClickOutside__) {
      document.removeEventListener('click', el.__vueClickOutside__)
      document.removeEventListener('touchstart', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  },
}

export function registerVClickoutside(app: App) {
  app.directive('clickoutside', vClickoutside)
}
