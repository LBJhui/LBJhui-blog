import type { App } from 'vue'
import Mytable from './index.vue'

export default {
  install(app: App) {
    app.component('Mytable', Mytable)
  }
}