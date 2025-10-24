import { update } from './render'

export default function (vm, data) {
  vm.$data = data()

  for (let key in vm.$data) {
    Object.defineProperty(vm, key, {
      get: () => vm.$data[key],
      set: (val) => {
        vm.$data[key] = val
        update(vm, key)
      },
    })
  }
}
