export function effect(fn, options: any = {}) {
  // 需要将这个 effect 变成响应式的 effect，可以做到数据变化重新执行
  const effect = createReactiveEffect(fn, options)
  if (!options.lazy) {
    effect() //响应式的 effect 默认会先执行一次
  }

  return effect
}
let uid = 0
let activeEffect // 存储当前的 effect
const effectStack = []
function createReactiveEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      // 保证 effect 没有加入到 effectStack 中
      try {
        effectStack.push(effect)
        activeEffect = effect
        return fn() // 函数执行时会取值 会执行 get 方法
      } finally {
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  }
  effect.id = uid++ //制作一个 effect 标识，用于区分 effect
  effect._isEffect = true // 用于标识这是一个响应式 effect
  effect.raw = fn // 保留 effect 对应的原函数
  effect.options = options // 在 effect 上保存用户的属性
  return effect
}

const targetMap = new WeakMap()
// 让某个对象中的属性 收集当前它对应的 effect 函数
export function track(target, type, key) {
  // 当前正在运行的 effect
  if (activeEffect) {
    // 收集依赖
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect)
    }
  }
}

// 函数调用是一个栈型结构 const effectStack = []
// effect(() => { effect1
//   state.name    effect1
//   effect(() => {  effect2
//     state.age     effect2
//   })
//   state.address   effect1
// })

// !effectStack.includes(effect)
// effect(() => {
//   state.xxx++
// })
