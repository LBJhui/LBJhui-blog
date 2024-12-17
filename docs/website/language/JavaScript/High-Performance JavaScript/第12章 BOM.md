# 第 12 章 BOM

## 12.1 window 对象

`BOM` 的核心是 `window` 对象，表示浏览器的实例。`window` 对象在浏览器中有两重身份，一个是 ECMAScript 中的 `Global` 对象，另一个就是浏览器窗口的 JavaScript 接口。这意味着网页中定义的所有对象、变量和函数都以 `window` 作为其 `Global` 对象，都可以访问其上定义的 `parseInt()`等全局方法。

### 12.1.1 Global 作用域

因为 `window` 对象被复用为 ECMAScript 的 `Global` 对象，所以通过 `var` 声明的所有全局变量和函数都会变成 `window` 对象的属性和方法。如果在这里使用 `let` 或 `const` 替代 `var`，则不会把变量添加给全局对象。

另外，访问未声明的变量会抛出错误，但是可以在 `window` 对象上查询是否存在可能未声明的变量。比如：

```javascript
// 这会导致抛出错误，因为oldValue没有声明
var newValue = oldValue
// 这不会抛出错误，因为这里是属性查询
// newValue会被设置为undefined
var newValue = window.oldValue
```

### 12.1.2 窗口关系

`top` 对象始终指向最上层（最外层）窗口，即浏览器窗口本身。而 `parent` 对象则始终指向当前窗口的父窗口。如果当前窗口是最上层窗口，则 `parent` 等于 `top`（都等于 `window`）​。最上层的 `window` 如果不是通过 `window.open()`打开的，那么其 `name` 属性就不会包含值。

还有一个 `self` 对象，它是终极 `window` 属性，始终会指向 `window`。实际上，`self` 和 `window` 就是同一个对象。之所以还要暴露 `self`，就是为了和 `top`、`parent` 保持一致。

这些属性都是 `window` 对象的属性，因此访问 `window.parent`、`window.top` 和 `window.self` 都可以。这意味着可以把访问多个窗口的 `window` 对象串联起来，比如 `window.parent.parent`。

### 12.1.3 窗口位置与像素比

`window` 对象的位置可以通过不同的属性和方法来确定。现代浏览器提供了 `screenLeft` 和 `screenTop` 属性，用于表示窗口相对于屏幕左侧和顶部的位置，返回值的单位是 CSS 像素。

可以使用 `moveTo()`和 `moveBy()`方法移动窗口。这两个方法都接收两个参数，其中 `moveTo()`接收要移动到的新位置的绝对坐标 `x` 和 `y`；而 `moveBy()`则接收相对当前位置在两个方向上移动的像素数。

```javascript
// 把窗口移动到左上角
window.moveTo(0, 0)
// 把窗口向下移动100 像素
window.moveBy(0, 100)
// 把窗口移动到坐标位置(200, 300)
window.moveTo(200, 300)
// 把窗口向左移动50 像素
window.moveBy(-50, 0)
```

依浏览器而定，以上方法可能会被部分或全部禁用。

**像素比**

CSS 像素是 Web 开发中使用的统一像素单位。这个单位的背后其实是一个角度：0.0213°。如果屏幕距离人眼是一臂长，则以这个角度计算的 CSS 像素大小约为 1/96 英寸。这样定义像素大小是为了在不同设备上统一标准。比如，低分辨率平板设备上 12 像素（CSS 像素）的文字应该与高清 4K 屏幕下 12 像素（CSS 像素）的文字具有相同大小。这就带来了一个问题，不同像素密度的屏幕下就会有不同的缩放系数，以便把物理像素（屏幕实际的分辨率）转换为 CSS 像素（浏览器报告的虚拟分辨率）​。

`window.devicePixelRatio` 实际上与每英寸像素数（DPI, dots per inch）是对应的。DPI 表示单位像素密度，而 `window.devicePixelRatio` 表示物理像素与逻辑像素之间的缩放系数。

### 12.1.4 窗口大小

`outerWidth` 和 `outerHeight` 返回浏览器窗口自身的大小（不管是在最外层 window 上使用，还是在窗格`<frame>`中使用）​。`innerWidth` 和 `innerHeight` 返回浏览器窗口中页面视口的大小（不包含浏览器边框和工具栏）​。

`document.documentElement.clientWidth` 和 `document.documentElement.clientHeight` 返回页面视口的宽度和高度。

浏览器窗口自身的精确尺寸不好确定，但可以确定页面视口的大小，如下所示：

```javascript
let pageWidth = window.innerWidth,
  pageHeight = window.innerHeight
if (typeof pageWidth !== 'number') {
  if (document.compatMode == 'CSS1Compat') {
    pageWidth = document.documentElement.clientWidth
    pageHeight = document.documentElement.clientHeight
  } else {
    pageWidth = document.body.clientWidth
    pageHeight = document.body.clientHeight
  }
}
```

这里，先将 `pageWidth` 和 `pageHeight` 的值分别设置为 `window.innerWidth` 和 `window.innerHeight`。然后，检查 pageWidth 是不是一个数值，如果不是则通过 `document.compatMode` 来检查页面是否处于标准模式。如果是，则使用 `document.documentElement.clientWidth` 和 `document.documentElement.clientHeight`；否则，就使用 `document.body.clientWidth` 和 `document.body.clientHeight`。

可以使用 `resizeTo()`和 `resizeBy()`方法调整窗口大小。这两个方法都接收两个参数，`resizeTo()`接收新的宽度和高度值，而 `resizeBy()`接收宽度和高度各要缩放多少。

```javascript
// 缩放到100×100
window.resizeTo(100, 100)
// 缩放到200×150
window.resizeBy(100, 50)
// 缩放到300×300
window.resizeTo(300, 300)
```

与移动窗口的方法一样，缩放窗口的方法可能会被浏览器禁用，而且在某些浏览器中默认是禁用的。同样，缩放窗口的方法只能应用到最上层的 `window` 对象。

### 12.1.5 视口位置

浏览器窗口尺寸通常无法满足完整显示整个页面，为此用户可以通过滚动在有限的视口中查看文档。度量文档相对于视口滚动距离的属性有两对，返回相等的值：`window.pageXoffset`/`window.scrollX` 和 `window.pageYoffset`/`window.scrollY`。

可以使用 `scroll()`、`scrollTo()`和 `scrollBy()`方法滚动页面。这 3 个方法都接收表示相对视口距离的 `x` 和 `y` 坐标，这两个参数在前两个方法中表示要滚动到的坐标，在最后一个方法中表示滚动的距离。

```javascript
// 相对于当前视口向下滚动 100 像素
window.scrollBy(0, 100)
// 相对于当前视口向右滚动 40 像素
window.scrollBy(40, 0)
// 滚动到页面左上角
window.scrollTo(0, 0)
// 滚动到距离屏幕左边及顶边各 100 像素的位置
window.scrollTo(100, 100)
```

这几个方法也都接收一个 `ScrollToOptions` 字典，除了提供偏移值，还可以通过 `behavior` 属性告诉浏览器是否平滑滚动。

```javascript
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto',
})
// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth',
})
```

### 12.1.6 导航与打开新窗口

`window.open()`方法可以用于导航到指定 URL，也可以用于打开新浏览器窗口。这个方法接收 4 个参数：要加载的 URL、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否替代当前加载页面的布尔值。通常，调用这个方法时只传前 3 个参数，最后一个参数只有在不打开新窗口时才会使用。

如果 `window.open()`的第二个参数是一个已经存在的窗口或窗格（`frame`）的名字，则会在对应的窗口或窗格中打开 URL。

```javascript
// 与<a href="http://www.wrox.com" target="topFrame"/>相同
window.open('http://www.wrox.com/', 'topFrame')
```

执行这行代码的结果就如同用户点击了一个 `href` 属性为`"http://www.wrox.com"`,`target`属性为`"topFrame"`的链接。如果有一个窗口名叫`"topFrame"`，则这个窗口就会打开这个 URL；否则就会打开一个新窗口并将其命名为`"topFrame"`。第二个参数也可以是一个特殊的窗口名，比如`_self`、`_parent`、`_top`或`_blank`。
