export default {
  mounted(el, binding) {
    function documentHandler(e) {
      if (el === e.target || el.contains(e.target)) return
      if (typeof binding.value === 'function') {
        binding.value(e)
      }
    }

    el.__vueClickOutside__ = documentHandler
    document.addEventListener('click', documentHandler)
    document.addEventListener('touchstart', documentHandler)
  },
  beforeUnmount(el) {
    if (el.__vueClickOutside__) {
      document.removeEventListener('click', el.__vueClickOutside__)
      document.removeEventListener('touchstart', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  },
}
