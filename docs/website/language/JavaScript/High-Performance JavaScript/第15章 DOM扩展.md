# 第 15 章 DOM 扩展

## 15.1 Selectors API

Selectors API Level 1 的核心是两个方法：`querySelector()`和 `querySelectorAll()`。在兼容浏览器中，Document 类型和 Element 类型的实例上都会暴露这两个方法。

Selectors API Level 2 规范在 Element 类型上新增了更多方法，比如 `matches()`、`find()`和 `findAll()`。不过，目前还没有浏览器实现或宣称实现 `find()`和 `findAll()`。

### 15.1.1 querySelector()

`querySelector()`方法接收 CSS 选择符参数，返回匹配该模式的第一个后代元素，如果没有匹配项则返回 `null`。

在 `Document` 上使用 `querySelector()`方法时，会从文档元素开始搜索；在 `Element` 上使用 `querySelector()`方法时，则只会从当前元素的后代中查询。

### 15.1.2 querySelectorAll()

`querySelectorAll()`方法跟 `querySelector()`一样，也接收一个用于查询的参数，但它会返回所有匹配的节点，而不止一个。这个方法返回的是一个 `NodeList` 的静态实例。如果没有匹配项，则返回空的 `NodeList` 实例。返回的 `NodeList` 对象可以通过 `for-of` 循环、`item()`方法或中括号语法取得个别元素。

如果选择符有语法错误或碰到不支持的选择符，则 `querySelector()`方法和 `querySelectorAll()`方法会抛出错误。

### 15.1.3 matches()

`matches()`方法（在规范草案中称为 `matchesSelector()`）接收一个 CSS 选择符参数，如果元素匹配则该选择符返回 `true`，否则返回 `false`。

```html
<ul id="birds">
  <li>Orange-winged parrot</li>
  <li class="endangered">Philippine eagle</li>
  <li>Great white pelican</li>
</ul>

<script type="text/javascript">
  var birds = document.getElementsByTagName('li')

  for (var i = 0; i < birds.length; i++) {
    if (birds[i].matches('.endangered')) {
      console.log('The ' + birds[i].textContent + ' is endangered!')
    }
  }
</script>
```

## 15.2 元素遍历

Element Traversal API 为 `DOM` 元素添加了 5 个属性：

❑ childElementCount，返回子元素数量（不包含文本节点和注释）​；<br />
❑ firstElementChild，指向第一个 Element 类型的子元素（Element 版 firstChild）​；<br />
❑ lastElementChild，指向最后一个 Element 类型的子元素（Element 版 lastChild）​；<br />
❑ previousElementSibling，指向前一个 Element 类型的同胞元素（Element 版 previousSibling）​；<br />
❑ nextElementSibling，指向后一个 Element 类型的同胞元素（Element 版 nextSibling）​。

## 15.3 HTML5

### 15.3.1 CSS 类扩展

#### 1．getElementsByClassName()

#### 2．classList 属性

`classList` 是一个新的集合类型 `DOMTokenList` 的实例。与其他 `DOM` 集合类型一样，`DOMTokenList` 也有 `length` 属性表示自己包含多少项，也可以通过 `item()`或中括号取得个别的元素。此外，`DOMTokenList` 还增加了以下方法。

❑ add（value）​，向类名列表中添加指定的字符串值 value。如果这个值已经存在，则什么也不做。<br />
❑ contains（value）​，返回布尔值，表示给定的 value 是否存在。<br />
❑ remove（value）​，从类名列表中删除指定的字符串值 value。<br />
❑ toggle（value）​，如果类名列表中已经存在指定的 value，则删除；如果不存在，则添加。

### 15.3.2 焦点管理

HTML5 增加了辅助 DOM 焦点管理的功能。首先是 `document.activeElement`，始终包含当前拥有焦点的 DOM 元素。其次是 `document.hasFocus()`方法，该方法返回布尔值，表示文档是否拥有焦点。

```javascript
let button = document.getElementById('myButton')
button.focus()
console.log(document.activeElement === button) // true
console.log(document.hasFocus()) // true
```

### 15.3.3 HTMLDocument 扩展

#### 1．readyState 属性

`document.readyState` 属性有两个可能的值：

❑ loading，表示文档正在加载；<br />
❑ complete，表示文档加载完成。

```javascript
if (document.readyState == 'complete') {
  // 执行操作
}
```

#### 2．compatMode 属性

自从 IE6 提供了以标准或混杂模式渲染页面的能力之后，检测页面渲染模式成为一个必要的需求。IE 为 `document` 添加了 `compatMode` 属性，这个属性唯一的任务是指示浏览器当前处于什么渲染模式。如下面的例子所示，标准模式下 `document.compatMode` 的值是"CSS1Compat"，而在混杂模式下，`document.compatMode` 的值是"BackCompat"：

```javascript
if (document.compatMode == 'CSS1Compat') {
  console.log('Standards mode')
} else {
  console.log('Quirks mode')
}
```

#### 3．head 属性

作为对 `document.body`（指向文档的`<body>`元素）的补充，HTML5 增加了 `document.head` 属性，指向文档的`<head>`元素。`document.head`

### 15.3.4 字符集属性

`characterSet` 属性表示文档实际使用的字符集，也可以用来指定新字符集。`document.characterSet = "UTF-8";`

### 15.3.5 自定义数据属性

HTML5 允许给元素指定非标准的属性，但要使用前缀 `data-`以便告诉浏览器，这些属性既不包含与渲染有关的信息，也不包含元素的语义信息。除了前缀，自定义属性对命名是没有限制的，`data-`后面跟什么都可以。定义了自定义数据属性后，可以通过元素的 `dataset` 属性来访问。

```html
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>

<script>
  // 本例中使用的方法仅用于示范
  let div = document.getElementById('myDiv')
  // 取得自定义数据属性的值
  let appId = div.dataset.appId
  let myName = div.dataset.myname
  // 设置自定义数据属性的值
  div.dataset.appId = 23456
  div.dataset.myname = 'Michael'
  // 有"myname"吗？
  if (div.dataset.myname) {
    console.log(`Hello, ${div.dataset.myname}`)
  }
</script>
```

### 15.3.6 插入标记

#### 1．innerHTML 属性

在写入模式下，赋给 `innerHTML` 属性的值会被解析为 `DOM` 子树，并替代元素之前的所有节点。因为所赋的值默认为 `HTML`，所以其中的所有标签都会以浏览器处理 `HTML` 的方式转换为元素（转换结果也会因浏览器不同而不同）​。如果赋值中不包含任何 `HTML` 标签，则直接生成一个文本节点。设置完 `innerHTML`，马上就可以像访问其他节点一样访问这些新节点。

:::tip 注意
设置 `innerHTML` 会导致浏览器将 `HTML` 字符串解析为相应的 `DOM` 树。这意味着设置 `innerHTML` 属性后马上再读出来会得到不同的字符串。这是因为返回的字符串是将原始字符串对应的 `DOM` 子树序列化之后的结果。
:::

#### 2．旧 IE 中的 innerHTML

#### 3．outerHTML 属性

读取 `outerHTML` 属性时，会返回调用它的元素（及所有后代元素）的 `HTML` 字符串。在写入 `outerHTML` 属性时，调用它的元素会被传入的 `HTML` 字符串经解释之后生成的 `DOM` 子树取代。

```javascript
div.outerHTML = '<p>This is a paragraph.</p>'

// 等同
let p = document.createElement('p')
p.appendChild(document.createTextNode('This is a paragraph.'))
div.parentNode.replaceChild(p, div)
```

#### 4．insertAdjacentHTML()与 insertAdjacentText()

关于插入标签的最后两个新增方法是 `insertAdjacentHTML()`和 ·。这两个方法最早源自 IE，它们都接收两个参数：要插入标记的位置和要插入的 HTML 或文本。第一个参数必须是下列值中的一个：

❑ "beforebegin"，插入当前元素前面，作为前一个同胞节点；<br />
❑ "afterbegin"，插入当前元素内部，作为新的子节点或放在第一个子节点前面；<br />
❑ "beforeend"，插入当前元素内部，作为新的子节点或放在最后一个子节点后面；<br />
❑ "afterend"，插入当前元素后面，作为下一个同胞节点。

注意这几个值是不区分大小写的。第二个参数会作为 `HTML` 字符串解析（与 `innerHTML` 和 `outerHTML` 相同）或者作为纯文本解析（与 `innerText` 和 `outerText` 相同）​。如果是 `HTML`，则会在解析出错时抛出错误。下面展示了基本用法：

```javascript
// 作为前一个同胞节点插入
element.insertAdjacentHTML('beforebegin', '<p>Hello world! </p>')
element.insertAdjacentText('beforebegin', 'Hello world! ')
// 作为第一个子节点插入
element.insertAdjacentHTML('afterbegin', '<p>Hello world! </p>')
element.insertAdjacentText('afterbegin', 'Hello world! ')
// 作为最后一个子节点插入
element.insertAdjacentHTML('beforeend', '<p>Hello world! </p>')
element.insertAdjacentText('beforeend', 'Hello world! ')
// 作为下一个同胞节点插入
element.insertAdjacentHTML('afterend', '<p>Hello world! </p>')
element.insertAdjacentText('afterend', 'Hello world! ')
```

#### 5．内存与性能问题

#### 6．跨站点脚本

### 15.3.7 scrollIntoView()

`scrollIntoView()`方法存在于所有 `HTML` 元素上，可以滚动浏览器窗口或容器元素以便包含元素进入视口。这个方法的参数如下：

```text
❑ alignToTop是一个布尔值。
  ■ true：窗口滚动后元素的顶部与视口顶部对齐。
  ■ false：窗口滚动后元素的底部与视口底部对齐。
❑ scrollIntoViewOptions是一个选项对象。
  ■ behavior：定义过渡动画，可取的值为"smooth"和"auto"，默认为"auto"。
  ■ block：定义垂直方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默认为"start"。
  ■ inline：定义水平方向的对齐，可取的值为"start"、"center"、"end"和"nearest"，默认为"nearest"。
❑ 不传参数等同于alignToTop为true。
```

## 15.4 专有扩展

### 15.4.1 children 属性

`children` 属性是一个 `HTMLCollection`，只包含元素的 `Element` 类型的子节点。如果元素的子节点类型全部是元素类型，那 `children` 和 `childNodes` 中包含的节点应该是一样的。

```javascript
let childCount = element.children.length
let firstChild = element.children[0]
```

### 15.4.2 contains()方法

`contains()`方法用于需要确定一个元素是不是另一个元素的后代，应该在要搜索的祖先元素上调用，参数是待确定的目标节点。如果目标节点是被搜索节点的后代，`contains()`返回 `true`，否则返回 `false`。

DOM Level 3 的 `compareDocumentPosition()`方法也可以确定节点间的关系。这个方法会返回表示两个节点关系的位掩码。下表给出了这些位掩码的说明。

| 掩码 |                   节点关系                    |
| :--: | :-------------------------------------------: |
| 0x1  |          断开（传入节点不在文档中）           |
| 0x2  | 领先（传入的节点在 DOM 树中位于参考节点之前） |
| 0x4  | 随后（传入的节点在 DOM 树中位于参考节点之后） |
| 0x8  |      包含（传入的节点是参考节点的祖先）       |
| 0x10 |     被包含（传入的节点是参考节点的后代）      |

要模仿 ·方法，就需要用到掩码 16（0x10）​。`compareDocumentPosition()`方法的结果可以通过按位与来确定参考节点是否包含传入的节点，比如：

```javascript
let result = document.documentElement.compareDocumentPosition(document.body)
console.log(!!(result & 0x10))
```

### 15.4.3 插入标记

#### 1．innerText 属性

`innerText` 属性对应元素中包含的所有文本内容，无论文本在子树中哪个层级。在用于读取值时，`innerText` 会按照深度优先的顺序将子树中所有文本节点的值拼接起来。在用于写入值时，`innerText` 会移除元素的所有后代并插入一个包含该值的文本节点。

#### 2．outerText 属性

`outerText` 与 `innerText` 是类似的，只不过作用范围包含调用它的节点。要读取文本值时，`outerText` 与 `innerText` 实际上会返回同样的内容。但在写入文本值时，`outerText` 就大不相同了。写入文本值时，`outerText` 不止会移除所有后代节点，而是会替换整个元素。

```javascript
div.outerText = 'Hello world! '

// 等同于
let text = document.createTextNode('Hello world! ')
div.parentNode.replaceChild(text, div)
```

### 15.4.4 滚动

`scrollIntoViewIfNeeded()`作为 `HTMLElement` 类型的扩展可以在所有元素上调用。`scrollIntoViewIfNeeded(centerIfNeeded)`会在元素不可见的情况下，将其滚动到窗口或包含窗口中，使其可见；如果已经在视口中可见，则这个方法什么也不做。如果将可选的参数 `centerIfNeeded` 设置为 `true`，则浏览器会尝试将其放在视口中央。

```javascript
const element = document.getElementById('my-el')

element.scrollIntoViewIfNeeded() // 将元素置于可见区域的中心
element.scrollIntoViewIfNeeded(false) // 将元素与可见区域中最近的边缘对齐
```

:::danger 提示
非标准: 该特性是非标准的，请尽量不要在生产环境中使用它！
:::
