# Vue 小点知识

## 静态资源的动态访问

```js
// 打包后每个图片生成对应的 js 文件
import(`./assests/${val}.png`).then((res) => {
  res.default
})
// 打包只有图片
const url = new URL(`./assests/${val}.png`, import.meta.url)
```

## v-html 添加的内容，css 样式不起作用

在用 vue 给标签内添加需要浏览器解析的文本内容时候，我们通常要用到 v-html 标签，但是用了这个标签后，我们无法对其内部标签的样式进行设置，那是因为，v-html 相当于引入外部组件内容。

现在我们用的 sylte 都会包括 scoped 标签，这个是私有属性的标签，所以我们要新建一个样式，将 scoped 标签去掉，将样式写在这里面就可以了。

## 介绍一下 SPA 以及 SPA 有什么缺点

SPA 是什么？单页面应用

缺点：

1. SEO 优化不好
2. 性能不是特别好
