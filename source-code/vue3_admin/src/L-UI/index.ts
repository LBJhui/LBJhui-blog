import type { App } from 'vue'
import LLink from './link/index.vue'
import LInput from './input/index.vue'
import LStar from './star/index.vue'
import LUpload from './upload/index.vue'

export const setupLUIGlobComp = (app: App<Element>) => {
  app.component('LLink', LLink)
  app.component('LInput', LInput)
  app.component('LStar', LStar)
  app.component('LUpload', LUpload)
}
