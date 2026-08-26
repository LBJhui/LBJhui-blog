# tips

## SSR

SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

SSR 有着更好的 SEO、并且首屏加载速度更快等优点。不过它也有一些缺点，比如我们的开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子，当我们需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境。还有就是服务器会有更大的负载需求。

## MVVM

MVVM 是 Model-View-ViewModel 缩写，也就是把 MVC 中的 Controller 演变成 ViewModel。Model 层代表数据模型，View 代表 UI 组件，ViewModel 是 View 和 Model 层的桥梁，数据会绑定到 viewModel 层并自动将数据渲染到页面中，视图变化的时候会通知 viewModel 层更新数据。

## 组件中的 data 为什么是一个函数？

因为组件是可以复用的，js 里对象是引用关系，如果组件 data 是一个对象，那么子组件中的 data 属性值会互相污染，产生不必要的麻烦。所以一个组件中的 data 必须是一个函数，因此每个实例可以维护一份被返回对象独立的拷贝。也因为 `new Vue` 的实例是不会被复用，所以不存在以上问题。

## v-for 和 v-if 哪个优先级更高？会产生什么后果？

vue2: v-for > v-if
vue3: v-if > v-for

心智负担：不要同时使用 v-for 和 v-if

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
