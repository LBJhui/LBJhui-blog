# vue3+vite2.0 移动端项目实战

vite+ts+vue3 只需要一行命令

```shell
npm init vite my-vue-app --template vue-ts
```

## 配置路由

```shell
npm install vue-router@4 --save
```

在 src 下新建 router 目录，新建 index.ts 文件

```ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '首页',
      keepAlive: true,
    },
    component: () => import('../views/Home/index.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
      keepAlive: true,
    },
    component: () => import('../views/Login/index.vue'),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
```

在 main.ts 挂载路由

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
createApp(App).use(router).mount('#app')
```

## 路由动画

因为 vue3 的过度动画 transition 组件跟 vue2 比变化还是比较大的。主要是以下的 2 各方面：

1. transition 组件在 vue 2 中是作为父级包裹路由 router-view 的，到了 vue3 就反过来了

```vue
<router-view v-slot="{ Component, route }">
  <transition :name="route.meta.transitionName">
    <component :is="Component" />
  </transition>
</router-view>
```

2. 动画类名发生了一点变化，开始和结束变成了 from 和 to ，所以不能直接吧 vue2 的过度动画复制过来，需要做一些改动。

```css
/_ 下滑 _/ .down-enter-active,
.down-leave-active {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}
.down-enter-from {
  transform: translate3d(0, -50%, 0);
  opacity: 0.2;
}
,
.down-leave-to {
  transform: translate3d(0, 50%, 0);
  opacity: 0.2;
}
```

## Vant3 安装

```
npm i vant@next -S
```

vite 版本不需要配置组件的按需加载，因为 Vant 3.0 内部所有模块都是基于 ESM 编写的，天然具备按需引入的能力，但是样式必须全部引入 137.2k

在 main.ts 全局引入样式

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vant/lib/index.css' // 全局引入样式
createApp(App).use(router).use(store).use(ant).mount('#app')
```

## 移动端适配

1. 安装 postcss-pxtorem

```shell
npm install postcss-pxtorem -D
```

在根目录下创建 postcss.config.js

```js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      // Vant 官方根字体大小是 37.5
      propList: ['*'],
      selectorBlackList: ['.norem'],
      // 过滤掉.norem-开头的class，不进行rem转换
    },
  },
}
```

在根目录 src 中新建 util 目录下新建 rem.ts 等比适配文件

```ts
// rem等比适配配置文件
// 基准大小
const baseSize = 37.5
// 注意此值要与 postcss.config.js 文件中的 rootValue保持一致
// 设置 rem 函数
function setRem() {
  // 当前页面宽度相对于 375宽的缩放比例，可根据自己需要修改,一般设计稿都是宽750(图方便可以拿到设计图后改过来)。
  const scale = document.documentElement.clientWidth / 375
  // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整）
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  console.log('我执行了')
  setRem()
}
```

在 mian.ts 引入

```ts
import './utils/rem'
```

2. 安装 postcss-px-to-viewport

```shell
//引入 postcss-px-to-viewport
npm install postcss-px-to-viewport --save-dev
```

安装完成后 我们需要进行 postcss 插件相关的配置 在根目录新建一个名为 postcss.config.js 的文件,如果项目中已包含该文件则无需新建。在文件中写入如下代码:

```javascript
//postcss.config.js
module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 375, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw      selectorBlackList: ["wrap"], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
    },
  },
}
```

vant 组件库的设计稿是按照 375px 来开发的。因此在 viewportWidth 为 750px 时会出现转换问题。

```javascript
// postcss.config.js
const path = require('path')

module.exports = ({ webpack }) => {
  const viewWidth = webpack.resourcePath.includes(
    path.join('node_modules', 'vant')
  )
    ? 375
    : 750
  return {
    plugins: {
      autoprefixer: {},
      'postcss-px-to-viewport': {
        unitToConvert: 'px',
        viewportWidth: viewWidth,
        unitPrecision: 6,
        propList: ['*'],
        viewportUnit: 'vw',
        fontViewportUnit: 'vw',
        selectorBlackList: [],
        minPixelValue: 1,
        mediaQuery: true,
        exclude: [],
        landscape: false,
      },
    },
  }
}
```

## 安装和配置 less

安装

```shell
npm i less-loader less --save-dev
```

在 vite.config.ts 中配置

![在 vite.config.ts 中配置](https://raw.githubusercontent.com/LBJhui/image-host/master/images/note/front-end/Vue/01.png)

```ts
css: {
  preprocessorOptions: {
    less: {
      modifyVars: {
        hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
      },
      javascriptEnabled: true,
    },
  },
}
```

## 环境变量配置

1. 进入项目根目录下的 package.json 文件，增加多个环境模式。

```json
"scripts": {
  "dev": "vite serve --mode development",
  "test": "vite serve --mode test",
  "ppe": "vite serve --mode ppe",
  "prod": "vite serve --mode production",
  "build:dev": "vue-tsc --noEmit && vite build --mode development",
  "build:test": "vue-tsc --noEmit && vite build --mode test",
  "build:ppe": "vue-tsc --noEmit && vite build --mode ppe",
  "build:prod": "vue-tsc --noEmit && vite build --mode production",
  "serve": "vite preview"
}
```

2. 在项目根目录下增加环境变量的文件。

   如：开发环境 dev，创建.env.development 文件

```.env.development
# 开发环境变量
VITE_APP_TITLE = 'development'
VITE_API_URL = 'http://127.0.0.1/'
```

3. 执行 npm run dev,配置的开发环境变量便生效。

4. vue 文件中访问 import.mate.env

```js
console.log('VITE_APP_TITLE:' + import.meta.env.VITE_APP_TITLE)
```

## vite 路径别名 @ 配置

```typescript
//vite.config.ts

const path = require('path')
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```json
//tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

重启一下就可以了用了

## setup 外部 js 引入 pinia

在 router 中使用 pinia（getActivePinia was called with no active Pinia. Did you forget to install pinia）报错解决

新建 store.js

```javascript
import { createPinia } from 'pinia'
const pinia = createPinia()
export default pinia
```

main.js 引入

```javascript
import pinia from '@/store/store'
app.use(pinia)
```

外部 js

```
import pinia from '@/store/store'
import { mainStore } from "@/store/mainStore"
const store = mainStore(pinia)
```

然后就可以随便调用了

## `<style vars>`如何用？

```vue
<script lang="ts" setup="props">
const state = reactive({
  color: '#ccc',
})
</script>
<style>
.text {
  color: v-bind('state.color');
}
</style>
```

## 报错解决方案

### vite.config.ts 如何 `__dirname` 找不到解决方案

安装@types/node

```shell
npm install @types/node -D
```

### Uncaught SyntaxError: The requested module does not provide an export named

使用 export default 时，对应的 import 语句不需要使用大括号；

不使用 export default 时，对应的 import 语句需要使用大括号。

export default 命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此 export default 命令只能使用一次。所以，import 命令后面才不用加大括号，因为只可能唯一对应 export default 命令

### npm 报错 npm ERR! A complete log of this run can be found in: npm ERR！

更新本地 npm

```shell
npm install npm@latest -g
```

### ts 中 document.querySelector 报错如何处理呢

因为用 querySelector 去获取 dom 的时候可能为空，所以需要使用断言：

`(document.querySelector('body') as HTMLElement).appendChild(txt);`
