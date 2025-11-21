import type { VueElement, DirectiveBinding, Directive } from 'vue'

const map = new WeakMap()

const ob = new ResizeObserver((entries) => {
  for (let entry of entries) {
    // 运行回调
    const handler = map.get(entry.target)
    handler &&
      handler({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
  }
})

const vResize: Directive = {
  mounted(el: VueElement, bindings: DirectiveBinding) {
    ob.observe(el) // 监听元素尺寸的变化
    map.set(el, bindings.value)
  },
  unmounted(el: VueElement) {
    ob.unobserve(el)
  },
}

export default vResize
