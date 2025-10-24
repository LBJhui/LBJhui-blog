import type { App } from 'vue'
import MySelect from './MySelect/index.vue'
import MyTable from './MyTable/index.vue'

const components = {
  MyTable,
  MySelect
}

export {
  MyTable,
  MySelect
}

export default {
  install(app: App) {
    for(const c in components) {
      app.component(c, components[c as keyof typeof components])
    }
  },
}
