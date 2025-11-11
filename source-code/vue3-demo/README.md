```powerShell
# 创建项目
pnpm create vite my-vue-app --template vue
```

[配置 eslint](https://eslint.vuejs.org/user-guide/)

```powerShell
# 安装 prettier 插件
pnpm add -D eslint-plugin-prettier prettier eslint-config-prettier
```

配置 prettier

- .prettierrc 添加规则
- .prettierignore 忽略文件

```powerShell
# 安装 stylelint 插件 https://stylelint.bootcss.com/
pnpm add sass sass-loader stylelint postcss postcss-scss postcss-html stylelint-config-prettier stylelint-config-recess-order stylelint-config-recommended-scss stylelint-config-standard stylelint-config-standard-vue stylelint-scss stylelint-order stylelint-config-standard-scss -D
```

.stylelintrc.js 配置文件
.stylelintignore 忽略文件

### 配置 commitlint

对于我们的 commit 信息，也是有统一规范的，不能随便写,要让每个人都按照统一的标准来执行，我们可以利用**commitlint**来实现。

安装包

```shell
pnpm add @commitlint/config-conventional @commitlint/cli -D
```

添加配置文件，新建`commitlint.config.cjs`(注意是 cjs)，然后添加下面的代码：

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 校验规则
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'revert', 'build']],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
}
```

在`package.json`中配置 scripts 命令

```json
# 在scrips中添加下面的代码
{
"scripts": {
    "commitlint": "commitlint --config commitlint.config.cjs -e -V"
  },
}
```

配置结束，现在当我们填写`commit`信息的时候，前面就需要带着下面的`subject`

```
'feat',//新特性、新功能
'fix',//修改bug
'docs',//文档修改
'style',//代码格式修改, 注意不是 css 修改
'refactor',//代码重构
'perf',//优化相关，比如提升性能、体验
'test',//测试用例修改
'chore',//其他修改, 比如改变构建流程、或者增加依赖库、工具等
'revert',//回滚到上一个版本
'build',//编译相关的修改，例如发布版本、对项目构建或者依赖的改动
```

配置 husky

```shell
npx husky add .husky/commit-msg
```

在生成的 commit-msg 文件中添加下面的命令

```
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm commitlint
```

当我们 commit 提交信息时，就不能再随意写了，必须是 git commit -m 'fix: xxx' 符合类型的才可以，**需要注意的是类型的后面需要用英文的 :，并且冒号后面是需要空一格的，这个是不能省略的**

[element-plus](https://element-plus.org/zh-CN/)

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

```powerShell
pnpm install axios
pnpm install @types/lodash -D
pnpm install lodash
```

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
