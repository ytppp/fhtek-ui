import type { App, Directive, DirectiveBinding } from 'vue'

const vClickoutside: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    function documentHandler(e: MouseEvent | TouchEvent) {
      if (el === e.target || (e.target instanceof Node && el.contains(e.target))) return
      if (typeof binding.value === 'function') {
        binding.value(e)
      }
    }

    (el as any).__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
    document.addEventListener('touchstart', documentHandler)
  },
  beforeUnmount(el: HTMLElement) {
    if ((el as any).__vueClickOutside__) {
      document.removeEventListener('click', (el as any).__vueClickOutside__)
      document.removeEventListener('touchstart', (el as any).__vueClickOutside__)
      delete (el as any).__vueClickOutside__
    }
  },
}

export function registerVClickoutside(app: App) {
  app.directive('clickoutside', vClickoutside)
}
