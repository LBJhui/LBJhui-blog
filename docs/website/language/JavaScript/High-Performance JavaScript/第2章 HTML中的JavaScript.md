# 第 2 章 HTML 中的 JavaScript

## `<script>` 元素

**`<script>` 元素有下列属性**

- async：表示应该立即开始下载脚本，但不能阻止其他页面动作，会在下载完成后立即执行脚本，比如下载资源或等待其他脚本加载。只对外部脚本文件有效。

  对于普通脚本，如果存在 async 属性，那么普通脚本会被并行请求，并尽快解析和执行。

  对于模块脚本，如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。

  该属性能够消除解析阻塞的 Javascript。解析阻塞的 Javascript 会导致浏览器必须加载并且执行脚本，之后才能继续解析。defer 在这一点上也有类似的作用。

  这是个布尔属性：布尔属性的存在意味着 true 值，布尔属性的缺失意味着 false 值。

- crossorigin：配置相关请求的 CORS（跨源资源共享）设置。默认不使用 CORS。crossorigin="anonymous"配置文件请求不必设置凭据标志。crossorigin="use-credentials"设置凭据标志，意味着出站请求会包含凭据。

- defer：可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效。在 IE7 及更早的版本中，对行内脚本也可以指定这个属性。立即下载，但延迟执行。

  1. 异步下载 `js` 资源，不会阻止 `DOM` 解析，在 `DOM` 解析完后才执行 `js` 脚本，`js` 文件会在 `DOMContentLoaded` 事件调用前执行。
  2. 如果有多个设置了 `defer` 的 `script` 标签存在，则会按照顺序执行所有的 `script`。
  3. 如果 `async` 和 `defer` 同时存在，`async` 优先级更高。

  :::danger
  本属性不应在缺少 src 属性的情况下使用（也就是内联脚本的情况下），这种情况下将不会生效。

  defer 属性对模块脚本也不会生效——它们默认是 defer 的。
  :::

- fetchpriority 实验性属性，用于指定资源的优先级。

- integrity：允许比对接收到的资源和指定的加密签名以验证子资源完整性（SRI, Subresource Integrity）。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络（CDN, Content Delivery Network）不会提供恶意内容。

- nomodule：可选。这个布尔属性被设置来标明这个脚本不应该在支持 ES 模块的浏览器中执行。实际上，这可用于在不支持模块化 JavaScript 的旧浏览器中提供回退脚本。

- nonce：在 script-src Content-Security-Policy 中允许脚本的一个一次性加密随机数（nonce）。服务器每次传输策略时都必须生成一个唯一的 nonce 值。提供一个无法猜测的 nonce 是至关重要的，因为绕过一个资源的策略是微不足道的。

  ```html
  <script src="example.js" nonce="somerandomvalue"></script>
  ```

  在这个示例中，nonce 属性指定了外部脚本文件 “example.js” 的随机值为 “somerandomvalue”。在使用内容安全策略时，可以通过比较 `<script>` 标签的 nonce 属性值和服务器端返回的随机值，来确保外部脚本文件是从受信任的源加载的。

  需要注意的是，nonce 属性应该只包含随机值，而不应该包含其他任何信息，因为这可能会导致安全问题。

- referrerpolicy：表示在获取脚本或脚本获取资源时，要发送哪个 referrer

  no-referrer：不会发送 Referer 标头。

  no-referrer-when-downgrade（默认）：如果没有 TLS（HTTPS）协议，Referer 标头将不会被发送到源上。

  origin：发送的 referrer 将被限制在 referrer 页面的源：其协议、主机和端口。

  origin-when-cross-origin：将会限制发送至其他源的 referrer 的协议、主机和端口号。在同源的导航上仍然包括路径。

  same-origin：在同源内将发送 referrer，但是跨源请求不包含 referrer 信息。

  strict-origin：只在协议安全等级相同时（如 HTTPS→HTTPS）发送文档的源作为 referrer，目标安全性降低（如 HTTPS→HTTP）时不发送。

  strict-origin-when-cross-origin：在执行同源请求时，发送完整的 URL，但只在协议安全级别保持不变（如 HTTPS→HTTPS）时发送源，而在目标安全性降低（如 HTTPS→HTTP）时不发送标头。

  unsafe-url：referrer 将包含源和路径（但不包含片段、密码和用户名）。这个值是不安全的，因为它将 TLS 保护的资源的源和路径泄露给不安全的源。

  :::tip 备注
  空字符串（""）既是默认值，也是在不支持 referrerpolicy 的情况下的一个回退值。如果没有在 `<script>` 元素上明确指定 referrerpolicy，它将采用更高级别的 referrer 策略，即对整个文档或域设置的策略。如果没有更高级别的策略，空字符串将被视为等同于 no-referrer-when-downgrade
  :::

- src：这个属性定义引用外部脚本的 URI，这可以用来代替直接在文档中嵌入脚本。

  使用了 src 属性的`<script>`元素不应该再在`<script>`和`</script>`标签中再包含其他 JavaScript 代码。如果两者都提供的话，则浏览器只会下载并执行脚本文件，从而忽略行内代码。

  `<script>`元素的 src 属性可以是一个完整的 URL，而且这个 URL 指向的资源可以跟包含它的 HTML 页面不在同一个域中。

- type：该属性表示所代表的脚本类型。该属性的值可能为以下类型：

  属性未设置（默认），一个空字符串，或一个 JavaScript MIME 类型：代表脚本为包含 JavaScript 代码的“传统的脚本”。如果脚本指的是 JavaScript 代码，我们鼓励作者省略这个属性，而不是指定一个 MIME 类型。所有的 JavaScript MIME 类型都列在 IANA 的媒体类型规范中。

  :::tip
  脚本应该以 text/javascript 的 MIME 类型提供，但浏览器比较宽容，只有在脚本以图像类型（image/_）、视频类型（video/_）、音频类型（audio/\*）或 text/csv 提供时才会阻止它们。如果脚本受阻，将向该元素发送 error 事件；否则，将发送 load 事件。
  :::

  module：此值导致代码被视为 JavaScript 模块。其中的代码内容会延后处理。charset 和 defer 属性不会生效。与传统代码不同的是，模块代码需要使用 CORS 协议来跨源获取。

  importmap：此值代表元素体内包含导入映射（importmap）表。导入映射表是一个 JSON 对象，开发者可以用它来控制浏览器在导入 JavaScript 模块时如何解析模块标识符。

  ```html
  <script type="importmap">
    {
      "imports": {
        "square": "./shapes/square.js",
        "circle": "https://example.com/shapes/circle.js"
      }
    }
  </script>
  ```

  任何其他值：所嵌入的内容被视为一个数据块，不会被浏览器处理。开发人员必须使用有效的 MIME 类型，但不是 JavaScript MIME 类型来表示数据块。所有其他属性，包括 src 均会被忽略。

- blocking：这个属性明确指出，在获取脚本的过程中，某些操作应该被阻断。要阻断的操作必须是一个以空格分隔的列表，下面列出了阻断属性。

  render：屏幕上渲染内容的操作应该被阻断。

**脚本执行时机**：没有 async、defer 或 type="module" 属性的脚本，以及没有 type="module" 属性的内联脚本，会在浏览器继续解析页面之前立即获取并执行。

### 推迟执行脚本

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Example HTML Page</title>
    <script defer src="example1.js"></script>
    <script defer src="example2.js"></script>
  </head>
  <body>
    <!-- 这里是页面内容 -->
  </body>
</html>
```

虽然这个例子中的`<script>`元素包含在页面的`<head>`中，但它们会在浏览器解析到结束的`</html>`标签后才会执行。HTML5 规范要求脚本应该按照它们出现的顺序执行，因此第一个推迟的脚本会在第二个推迟的脚本之前执行，而且两者都会在`DOMContentLoaded`事件之前执行。不过在实际当中，推迟执行的脚本不一定总会按顺序执行或者在`DOMContentLoaded`事件之前执行，因此最好只包含一个这样的脚本。

### 异步执行脚本

从改变脚本处理方式上看，async 属性与 defer 类似。当然，它们两者也都只适用于外部脚本，都会告诉浏览器立即开始下载。不过，与 defer 不同的是，标记为 async 的脚本并不保证能按照它们出现的次序执行。

异步脚本保证会在页面的 load 事件前执行，但可能会在`DOMContentLoaded`之前或之后。

使用了 async 属性加载的脚本不会在下载时阻塞页面。这意味着在脚本执行完成之前，将无法为用户处理和渲染网页上的其余内容。无法保证脚本的运行次序。当页面的脚本之间彼此独立，且不依赖于本页面的其他任何脚本时，async 是最理想的选择。

使用 defer 属性加载的脚本将按照它们在页面上出现的顺序加载。在页面内容全部加载完毕之前，脚本不会运行，如果脚本依赖于 DOM 的存在（例如，脚本修改了页面上的一个或多个元素），这一点非常有用。

![async-defer](./images/2/1.jpg)

## 文档模式

标准模式通过下列几种文档类型声明开启：

```html
<!-- HTML 4.01 Strict -->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!-- XHTML 1.0 Strict -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<!-- HTML5-->
<!DOCTYPE html>
```

准标准模式通过过渡性文档类型（Transitional）和框架集文档类型（Frameset）来触发：

```html
<!-- HTML 4.01 Transitional -->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!-- HTML 4.01 Frameset -->
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<!-- XHTML 1.0 Transitional -->
<! DOCTYPE html PUBLIC
    "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- XHTML 1.0 Frameset -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```
