import { h, type App, type Directive } from 'vue'
import FhLoading from '@fhtek-ui/components/loading'
import FhPopup from '@fhtek-ui/components/popup'
import { usePopup } from '@fhtek-ui/hooks/popup'

let position = ''
let instance: ReturnType<typeof usePopup> | null = null
function appendNode(el: HTMLElement) {
  if (instance) {
    instance.show()
  }
  position = el.style.position
  el.style.position = 'relative'
}
function removeNode(el: HTMLElement) {
  if (instance) {
    instance.close()
  }
  el.style.position = position
}

const vloading: Directive = {
  created(el: HTMLElement, bing: { value: boolean }) {
    const tip = el.getAttribute('loading-tip')
    const title = el.getAttribute('loading-title')
    instance = usePopup(
      h(
        FhPopup,
        {
          isAppendBody: false,
          isManual: true,
        },
        () =>
          h(FhLoading, {
            tip: tip || '',
            title: title || '',
          }),
      ),
      el,
    )
    if (bing.value) {
      appendNode(el)
    }
  },
  updated(el: HTMLElement, bing: { value: boolean; oldValue: boolean }) {
    if (bing.value !== bing.oldValue) {
      if (bing.value) {
        appendNode(el)
      } else {
        removeNode(el)
      }
    }
  },
}

export function registerVLoading(app: App) {
  app.directive('loading', vloading)
}
