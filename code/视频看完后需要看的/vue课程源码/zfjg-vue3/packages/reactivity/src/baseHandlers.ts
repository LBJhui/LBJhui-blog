// 实现 new Proxy(target, handler)
import { extend, isObject } from '@vue/shared'
import { reactive, readonly } from './reactive'
import { track } from './effect'
import { TrackOpTypes } from './operators'
// 是不是仅读的，仅读的属性 set 时会报异常
// 是不是深度的
function creatGetter(isReadonly = false, shallow = false) {
  // 拦截获取功能
  return function get(target, key, receiver) {
    // 这里的 target 是通过 reactive 返回的代理对象
    // receiver 是代理对象
    const res = Reflect.get(target, key, receiver)
    if (!isReadonly) {
      // 收集依赖，等会数据变化后更新对应的视图
      console.log('执行 effect 时会取值', '收集 effect')
      track(target, TrackOpTypes.GET, key)
    }
    if (shallow) {
      return res
    }
    if (isObject(res)) {
      // vue2 是一上来就递归，vue3 是当取值时会进行代码
      // vue3 的代理模式是懒代理
      return isReadonly ? readonly(res) : reactive(res)
    }
    return res
  }
}

function createSetter(shallow = false) {
  // 拦截设置功能
  return function set(target, key, value, receiver) {
    // 当数据更新时，通知对应属性的 effect  重新执行
    const result = Reflect.set(target, key, value, receiver)
    return result
  }
}

const get = creatGetter()
const shallowGet = creatGetter(false, true)
const readonlyGet = creatGetter(true)
const shallowReadonlyGet = creatGetter(true, true)

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers = {
  get,
  set,
}

export const shallowReactiveHandlers = {
  get: shallowGet,
  set: shallowSet,
}

let readonlyObj = {
  set: (target, key) => {
    console.warn(`${key} set 失败，因为 target 是 readonly 类型`)
  },
}

export const readonlyHandlers = extend(
  {
    get: readonlyGet,
  },
  readonlyObj
)

export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj
)
