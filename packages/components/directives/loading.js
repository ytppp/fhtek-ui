import { h } from 'vue'
import FhLoading from '@/components/loading/loading.vue'
import { usePopup } from '@/hooks/popup'
import Popup from '@/components/popup/popup.vue'

let position = ''
let instance = null
function appendNode(el) {
  if (instance) {
    instance.show()
  }
  position = el.style.position
  el.style.position = 'relative'
}
function removeNode(el) {
  if (instance) {
    instance.close()
  }
  el.style.position = position
}

export default {
  created(el, bing) {
    const tip = el.getAttribute('loading-tip')
    const title = el.getAttribute('loading-title')
    instance = usePopup(
      h(
        Popup,
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
  updated(el, bing) {
    if (bing.value !== bing.oldValue) {
      if (bing.value) {
        appendNode(el)
      } else {
        removeNode(el)
      }
    }
  },
}
