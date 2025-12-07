import { add } from '../build/release.js'
performance.mark('wasm_start')
console.log('%c 🥃 add', 'font-size:16px;color:#33a5ff', add(1, 2))
performance.mark('wasm_end')
performance.measure('wasm_time', 'wasm_start', 'wasm_end')
console.log(performance.getEntriesByName('wasm_time'))

// 针对 js 代码的性能检测
function js_add(a, b) {
  let res = 0
  for (let i = 0; i < 10000; i++) {
    res = 0
  }
  return a + b
}

performance.mark('js_start')
console.log('%c 🥃 js_add', 'font-size:16px;color:#33a5ff', js_add(1, 2))
performance.mark('js_end')
performance.measure('js_time', 'js_start', 'js_end')
console.log(performance.getEntriesByName('js_time'))
