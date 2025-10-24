import type { Directive } from 'vue'
import loading from '@/utils/loading'

const map = new WeakMap<HTMLElement, (e: MouseEvent) => void>()
export const vClick: Directive = {
  mounted(el, binding) {
    const { value, modifiers } = binding
    async function handler(e: MouseEvent) {
      if (!modifiers.loading) return value(e)
      loading.value = true
      await value(e)
      loading.value = false
    }
    map.set(el, handler)
    el.addEventListener('click', handler)
  },
  unmounted(el) {
    const handler = map.get(el)
    if (!handler) return
    el.removeEventListener('click', handler)
    map.delete(el)
  },
}

// v-click.loading
