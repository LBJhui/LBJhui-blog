

# 项目集成

## element-plus

官网地址:https://element-plus.gitee.io/zh-CN/

```shell
pnpm add element-plus @element-plus/icons-vue
```

入口文件 main.ts 全局安装 element-plus,element-plus 默认支持语言英语设置为中文

```typescript
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
  locale: zhCn,
})
```

**Element Plus 全局组件类型声明**

```json
// tsconfig.app.json
{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

配置完毕可以测试 element-plus 组件与图标的使用.

## src 别名的配置

在开发项目的时候文件与文件关系可能很复杂，因此我们需要给 src 文件夹配置一个别名！！！

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
    },
  },
})
```

TypeScript 编译配置

```json
// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块的基地址，默认是当前目录
    "paths": {
      //路径映射，相对于baseUrl
      "@/*": ["src/*"]
    }
  }
}
```

## 环境变量的配置

项目开发过程中，至少会经历开发环境、测试环境和生产环境(即正式环境)三个阶段。不同阶段请求的状态(如接口地址等)不尽相同，若手动切换接口地址是相当繁琐且易出错的。于是环境变量配置的需求就应运而生，我们只需做简单的配置，把环境状态切换的工作交给代码。

开发环境（development）
顾名思义，开发使用的环境，每位开发人员在自己的 dev 分支上干活，开发到一定程度，同事会合并代码，进行联调。

测试环境（testing）
测试同事干活的环境啦，一般会由测试同事自己来部署，然后在此环境进行测试

生产环境（production）
生产环境是指正式提供对外服务的，一般会关掉错误报告，打开错误日志。(正式提供给客户使用的环境。)

注意:一般情况下，一个环境对应一台服务器,也有的公司开发与测试环境是一台服务器！！！

项目根目录分别添加 开发、生产和测试环境的文件!

```
.env.development
.env.production
.env.test
```

文件内容

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'development'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/dev-api'
```

```
NODE_ENV = 'production'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/prod-api'
```

```
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
NODE_ENV = 'test'
VITE_APP_TITLE = '硅谷甄选运营平台'
VITE_APP_BASE_API = '/test-api'
```

配置运行命令：package.json

```json
 "scripts": {
    "dev": "vite --open",
    "build:test": "vue-tsc && vite build --mode test",
    "build:pro": "vue-tsc && vite build --mode production",
    "preview": "vite preview"
  },
```

通过 import.meta.env 获取环境变量

## SVG 图标配置

在开发项目的时候经常会用到 svg 矢量图,而且我们使用 SVG 以后，页面上加载的不再是图片资源,

这对页面性能来说是个很大的提升，而且我们 SVG 文件比 img 要小的很多，放在项目中几乎不占用资源。

**安装 SVG 依赖插件**

```shell
pnpm add vite-plugin-svg-icons -D
```

**在`vite.config.ts`中配置插件**

```typescript
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
export default () => {
  return {
    plugins: [
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  }
}
```

**入口文件导入**

```
import 'virtual:svg-icons-register'
```

### svg 封装为全局组件

因为项目很多模块需要使用图标,因此把它封装为全局组件！！！

**在 src/components 目录下创建一个 SvgIcon 组件:代表如下**

```vue
<template>
  <div>
    <svg :style="{ width: width, height: height }">
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: '',
  },
  //svg宽度
  width: {
    type: String,
    default: '16px',
  },
  //svg高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>
<style scoped></style>
```

在 src 文件夹目录下创建一个 index.ts 文件：用于注册 components 文件夹内部全部全局组件！！！

```typescript
import SvgIcon from './SvgIcon/index.vue'
import type { App, Component } from 'vue'
const components: { [name: string]: Component } = { SvgIcon }
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
  },
}
```

在入口文件引入 src/index.ts 文件,通过 app.use 方法安装自定义插件

```typescript
import gloablComponent from './components/index'
app.use(gloablComponent)
```

## 集成 sass

我们目前在组件内部已经可以使用 scss 样式,因为在配置 styleLint 工具的时候，项目当中已经安装过 sass sass-loader,因此我们再组件内可以使用 scss 语法！！！需要加上 lang="scss"

```vue
<style scoped lang="scss"></style>
```

接下来我们为项目添加一些全局的样式

在 src/styles 目录下创建一个 index.scss 文件，当然项目中需要用到清除默认样式，因此在 index.scss 引入 reset.scss

```
@import reset.scss
```

在入口文件引入

```
import '@/styles'
```

但是你会发现在 src/styles/index.scss 全局样式文件中没有办法使用$变量.因此需要给项目中引入全局变量$.

在 style/variable.scss 创建一个 variable.scss 文件！

在 vite.config.ts 文件配置如下:

```typescript
export default defineConfig((config) => {
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern", "legacy"
        additionalData:'@use "@/styles/variable.scss" as *;',
      }
    }
  }
})
```

配置完毕你会发现 scss 提供这些全局变量可以在组件样式中使用了！！！

## mock 数据

安装依赖:https://www.npmjs.com/package/vite-plugin-mock

```shell
pnpm add -D vite-plugin-mock mockjs
```

在 vite.config.js 配置文件启用插件。

```typescript
import { viteMockServe } from 'vite-plugin-mock'
import vue from '@vitejs/plugin-vue'
export default ({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        enable: command === 'serve',
      }),
    ],
  }
}
```

在根目录创建 mock 文件夹:去创建我们需要 mock 数据与接口！！！

在 mock 文件夹内部创建一个 user.ts 文件

```typescript
//用户信息数据
function createUserList() {
  return [
    {
      userId: 1,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'admin',
      password: '111111',
      desc: '平台管理员',
      roles: ['平台管理员'],
      buttons: ['cuser.detail'],
      routes: ['home'],
      token: 'Admin Token',
    },
    {
      userId: 2,
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      username: 'system',
      password: '111111',
      desc: '系统管理员',
      roles: ['系统管理员'],
      buttons: ['cuser.detail', 'cuser.user'],
      routes: ['home'],
      token: 'System Token',
    },
  ]
}

export default [
  // 用户登录接口
  {
    url: '/api/user/login', //请求地址
    method: 'post', //请求方式
    response: ({ body }) => {
      //获取请求体携带过来的用户名与密码
      const { username, password } = body
      //调用获取用户信息函数,用于判断是否有此用户
      const checkUser = createUserList().find((item) => item.username === username && item.password === password)
      //没有用户返回失败信息
      if (!checkUser) {
        return { code: 201, data: { message: '账号或者密码不正确' } }
      }
      //如果有返回成功信息
      const { token } = checkUser
      return { code: 200, data: { token } }
    },
  },
  // 获取用户信息
  {
    url: '/api/user/info',
    method: 'get',
    response: (request) => {
      //获取请求头携带token
      const token = request.headers.token
      //查看用户信息是否包含有次token用户
      const checkUser = createUserList().find((item) => item.token === token)
      //没有返回失败的信息
      if (!checkUser) {
        return { code: 201, data: { message: '获取用户信息失败' } }
      }
      //如果有返回成功信息
      return { code: 200, data: { checkUser } }
    },
  },
]
```

**安装 axios**

```shell
pnpm install axios
```

最后通过 axios 测试接口！！！

# 第三方库

[inspira-ui(Vue3 动效库)](https://github.com/unovue/inspira-ui)

[Anime.js is a fast, multipurpose and lightweight JavaScript animation library with a simple, yet powerful API.](https://github.com/juliangarnier/anime)

[radash: Functional utility library - modern, simple, typed, powerful(功能函数)](https://github.com/sodiray/radash)

[dayjs: Fast 2kB alternative to Moment.js with the same modern API(日期)](https://github.com/iamkun/dayjs)

[driver.js: Powerful, highly customizable vanilla JavaScript engine to drive the user's focus across the page(引导页组件)](https://github.com/kamranahmedse/driver.js)

[drag-and-drop(拖放库)](https://github.com/formkit/drag-and-drop)

[LogicFlow 是一款流程图编辑框架，提供了一系列流程图交互、编辑所必需的功能和简单灵活的节点自定义、插件等拓展机制，方便我们快速在业务系统内满足类流程图的需求。](https://github.com/didi/LogicFlow)

[progressbar.js: Responsive and slick progress bars with animated SVG paths.(进度条)](https://github.com/kimmobrunfeldt/progressbar.js)

[Tesseract.js is a javascript library that gets words in almost any language out of images. (OCR)](https://github.com/naptha/tesseract.js)

[lottie: 跨平台的动画库](https://github.com/airbnb/lottie-web)

[pinyin](https://github.com/hotoo/pinyin)

```powerShell
pnpm i --save lodash
pnpm install @types/lodash -D
```
