import { Directive } from 'vue'

const vClickOutside: Directive = {
  mounted(el, binding, vnode) {
    let handle = (e: Event) => {
      if (el.contains(e.target)) {
        binding.instance.handleFocus()
        console.log('包含')
      } else {
        console.log('不包含')
        binding.instance.handleBlur()
      }
    }
    el.handle = handle
    document.addEventListener('click', handle)
  },
  unmounted(el) {
    document.addEventListener('click', el.handle)
  },
}

export default vClickOutside
