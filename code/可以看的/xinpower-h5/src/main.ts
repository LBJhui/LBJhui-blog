import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import 'amfe-flexible/index.js'
import 'flexboxgrid/dist/flexboxgrid.min.css'
import 'lib-flexible'
import './assets/style/reset.css'
import './assets/iconfont/iconfont.css'

import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')
