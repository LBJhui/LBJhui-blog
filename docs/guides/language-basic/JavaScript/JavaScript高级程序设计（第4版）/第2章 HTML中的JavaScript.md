# 第 2 章 HTML 中的 JavaScript

## \<script>元素

**\<script>元素有下列 8 个属性**

❑ async：可选。表示应该立即开始下载脚本，但不能阻止其他页面动作，比如下载资源或等待其他脚本加载。只对外部脚本文件有效。
❑ charset：可选。使用 src 属性指定的代码字符集。这个属性很少使用，因为大多数浏览器不在乎它的值。
❑ crossorigin：可选。配置相关请求的 CORS（跨源资源共享）设置。默认不使用 CORS。crossorigin="anonymous"配置文件请求不必设置凭据标志。crossorigin="use-credentials"设置凭据标志，意味着出站请求会包含凭据。
❑ defer：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。立即下载，但延迟执行
❑ integrity：可选。允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI, Subresource Integrity）。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络（CDN, Content Delivery Network）不会提供恶意内容。
❑ language：废弃。最初用于表示代码块中的脚本语言（如"JavaScript"、"JavaScript 1.2"或"VBScript"）。大多数浏览器都会忽略这个属性，不应该再使用它。
❑ src：可选。表示包含要执行的代码的外部文件。

- 使用了 src 属性的`<script>`元素不应该再在`<script>`和`</script>`标签中再包含其他 JavaScript 代码。如果两者都提供的话，则浏览器只会下载并执行脚本文件，从而忽略行内代码。
- `<script>`元素的 src 属性可以是一个完整的 URL，而且这个 URL 指向的资源可以跟包含它的 HTML 页面不在同一个域中

❑ type：可选。代替 language，表示代码块中脚本语言的内容类型（也称 MIME 类型）。按照惯例，这个值始终都是`"text/javascript"`，尽管`"text/javascript"`和`"text/ecmascript"`都已经废弃了。JavaScript 文件的 MIME 类型通常是`"application/x-javascript"`，不过给 type 属性这个值有可能导致脚本被忽略。在非 IE 的浏览器中有效的其他值还有`"application/javascript"`和`"application/ecmascript"`。如果这个值是`module`，则代码会被当成 ES6 模块，而且只有这时候代码中才能出现`import`和`export`关键字。

### 推迟执行脚本

```html
<! DOCTYPE html>
<html>
  <head>
  <title>Example HTML Page</title>
  <scriptdefersrc="example1.js"></script>
  <scriptdefersrc="example2.js"></script>
  </head>
  <body>
  <! -- 这里是页面内容 -->
  </body>
</html>
```

虽然这个例子中的`<script>`元素包含在页面的`<head>`中，但它们会在浏览器解析到结束的`</html>`标签后才会执行。HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本会在第二个推迟的脚本之前执行，而且两者都会在`DOMContentLoaded`事件之前执行。不过在实际当中，推迟执行的脚本不一定总会按顺序执行或者在`DOMContentLoaded`事件之前执行，因此最好只包含一个这样的脚本。

### 异步执行脚本

从改变脚本处理方式上看，async 属性与 defer 类似。当然，它们两者也都只适用于外部脚本，都会告诉浏览器立即开始下载。不过，与 defer 不同的是，标记为 async 的脚本并不保证能按照它们出现的次序执行

异步脚本保证会在页面的 load 事件前执行，但可能会在`DOMContentLoaded`之前或之后

## 文档模式

标准模式通过下列几种文档类型声明开启：

```html
<! -- HTML 4.01 Strict -->
<! DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd">
<! -- XHTML 1.0 Strict -->
<! DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<! -- HTML5-->
<! DOCTYPE html>
```

准标准模式通过过渡性文档类型（Transitional）和框架集文档类型（Frameset）来触发：

```html
<! -- HTML 4.01 Transitional -->
<! DOCTYPE HTML PUBLIC
    "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<! -- HTML 4.01 Frameset -->
<! DOCTYPE HTML PUBLIC
    "-//W3C//DTD HTML 4.01 Frameset//EN"
    "http://www.w3.org/TR/html4/frameset.dtd">
<! -- XHTML 1.0 Transitional -->
<! DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<! -- XHTML 1.0 Frameset -->
<! DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Frameset//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```
