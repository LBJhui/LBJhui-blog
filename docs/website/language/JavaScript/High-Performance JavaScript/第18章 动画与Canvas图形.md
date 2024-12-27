# 第 18 章 动画与 Canvas 图形

## 18.1 使用 requestAnimationFrame

### 18.1.1 早期定时动画

以前，在 JavaScript 中创建动画基本上就是使用 `setInterval()`来控制动画的执行，不能保证时间精度。

### 18.1.2 时间间隔的问题

以下是几个浏览器计时器的精度情况：

❑ IE8 及更早版本的计时器精度为 15.625 毫秒；<br />
❑ IE9 及更晚版本的计时器精度为 4 毫秒；<br />
❑ Firefox 和 Safari 的计时器精度为约 10 毫秒；<br />
❑ Chrome 的计时器精度为 4 毫秒。

IE9 之前版本的计时器精度是 15.625 毫秒，意味着 0 ～ 15 范围内的任何值最终要么是 0，要么是 15，不可能是别的数。IE9 把计时器精度改进为 4 毫秒，但这对于动画而言还是不够精确。Chrome 计时器精度是 4 毫秒，而 Firefox 和 Safari 是 10 毫秒。更麻烦的是，浏览器又开始对切换到后台或不活跃标签页中的计时器执行限流。因此即使将时间间隔设定为最优，也免不了只能得到近似的结果。

### 18.1.3 requestAnimationFrame

`requestAnimationFrame()`方法用以通知浏览器某些 JavaScript 代码要执行动画了。该方法接收一个参数，此参数是一个要在重绘屏幕前调用的函数。这个函数就是修改 `DOM` 样式以反映下一次重绘有什么变化的地方。为了实现动画循环，可以把多个 `requestAnimationFrame()`调用串联起来，就像以前使用 `setTimeout()`时一样。

```javascript
function updateProgress() {
  var div = document.getElementById('status')
  div.style.width = parseInt(div.style.width, 10) + 5 + '%'
  if (div.style.left != '100%') {
    requestAnimationFrame(updateProgress)
  }
}
requestAnimationFrame(updateProgress)
```

传给 `requestAnimationFrame()`的函数实际上可以接收一个参数，此参数是一个 DOMHighRes-TimeStamp 的实例（比如 performance.now()返回的值）​，表示下次重绘的时间。这一点非常重要：`requestAnimationFrame()`实际上把重绘任务安排在了未来一个已知的时间点上，而且通过这个参数告诉了开发者。基于这个参数，就可以更好地决定如何调优动画了。

### 18.1.4 cancelAnimationFrame

与 `setTimeout()`类似，`requestAnimationFrame()`也返回一个请求 ID，可以用于通过另一个方法 `cancelAnimationFrame()`来取消重绘任务。

```javascript
let requestID = window.requestAnimationFrame(() => {
  console.log('Repaint! ')
})
window.cancelAnimationFrame(requestID)
```

### 18.1.5 通过 requestAnimationFrame 节流

`requestAnimationFrame` 这个名字有时候会让人误解，因为看不出来它跟排期任务有关。支持这个方法的浏览器实际上会暴露出作为钩子的回调队列。所谓钩子（hook）​，就是浏览器在执行下一次重绘之前的一个点。这个回调队列是一个可修改的函数列表，包含应该在重绘之前调用的函数。每次调用 `requestAnimationFrame()`都会在队列上推入一个回调函数，队列的长度没有限制。

这个回调队列的行为不一定跟动画有关。不过，通过 `requestAnimationFrame()`递归地向队列中加入回调函数，可以保证每次重绘最多只调用一次回调函数。这是一个非常好的节流工具。在频繁执行影响页面外观的代码时（比如滚动事件监听器）​，可以利用这个回调队列进行节流。

```javascript
function expensiveOperation() {
  console.log('Invoked at', Date.now())
}
window.addEventListener('scroll', () => {
  expensiveOperation()
})

// 优化后
letenabled = true
function expensiveOperation() {
  console.log('Invoked at', Date.now())
}
window.addEventListener('scroll', () => {
  if (enabled) {
    enabled = false
    window.requestAnimationFrame(expensiveOperation)
    window.setTimeout(() => (enabled = true), 50)
  }
})
```

## 18.2 基本的画布功能

创建`<canvas>`元素时至少要设置其 `width` 和 `height` 属性，这样才能告诉浏览器在多大面积上绘图。出现在开始和结束标签之间的内容是后备数据，会在浏览器不支持`<canvas>`元素时显示。

要在画布上绘制图形，首先要取得绘图上下文。使用 `getContext()`方法可以获取对绘图上下文的引用。对于平面图形，需要给这个方法传入参数"`2d`"，表示要获取 2D 上下文对象。

使用`<canvas>`元素时，最好先测试一下 `getContext()`方法是否存在。有些浏览器对 HTML 规范中没有的元素会创建默认 HTML 元素对象。这就意味着即使 `drawing` 包含一个有效的元素引用，`getContext()`方法也未必存在。

可以使用 `toDataURL()`方法导出`<canvas>`元素上的图像。这个方法接收一个参数：要生成图像的 MIME 类型（与用来创建图形的上下文无关）​。

```html
<canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
<script>
  let drawing = document.getElementById('drawing')
  // 确保浏览器支持<canvas>
  if (drawing.getContext) {
    let context = drawing.getContext('2d')
    // 其他代码
    // 取得图像的数据URI
    let imgURI = drawing.toDataURL('image/png')
    // 显示图片
    let image = document.createElement('img')
    image.src = imgURI
    document.body.appendChild(image)
  }
</script>
```

浏览器默认将图像编码为 PNG 格式，除非另行指定。

## 18.3 2D 绘图上下文

2D 绘图上下文提供了绘制 2D 图形的方法，包括矩形、弧形和路径。2D 上下文的坐标原点(0, 0)在`<canvas>`元素的左上角。所有坐标值都相对于该点计算，因此 x 坐标向右增长，y 坐标向下增长。默认情况下，`width` 和 `height` 表示两个方向上像素的最大值。

### 18.3.1 填充和描边

`fillStyle` 和 `strokeStyle`。

### 18.3.2 绘制矩形

`fillRect()`、`strokeRect()`和 `clearRect()`。这些方法都接收 4 个参数：矩形 x 坐标、矩形 y 坐标、矩形宽度和矩形高度。这几个参数的单位都是像素。

`fillRect()`方法用于以指定颜色在画布上绘制并填充矩形。填充的颜色使用 `fillStyle` 属性指定。

`strokeRect()`方法使用通过 `strokeStyle` 属性指定的颜色绘制矩形轮廓。

:::tip 注意
描边宽度由 `lineWidth` 属性控制，它可以是任意整数值。类似地，`lineCap` 属性控制线条端点的形状［"`butt`"（平头）​、"`round`"（出圆头）或"`square`"（出方头）］，而 `lineJoin` 属性控制线条交点的形状［"`round`"（圆转）​、"`bevel`"（取平）或"`miter`"（出尖）］。
:::

使用 `clearRect()`方法可以擦除画布中某个区域。该方法用于把绘图上下文中的某个区域变透明。通过先绘制形状再擦除指定区域，可以创建出有趣的效果，比如从已有矩形中开个孔。

```html
<canvas id="drawing" width="200" height="200">A drawing of something.</canvas>
<script>
  let drawing = document.getElementById('drawing')
  // 确保浏览器支持<canvas>
  if (drawing.getContext) {
    let context = drawing.getContext('2d')
    //绘制红色矩形
    context.fillStyle = '#ff0000'
    context.fillRect(10, 10, 50, 50)
    //绘制半透明蓝色矩形
    context.fillStyle = 'rgba(0,0,255,0.5)'
    context.fillRect(30, 30, 50, 50)

    //绘制红色轮廓的矩形
    context.strokeStyle = '#ff0000'
    context.strokeRect(10, 10, 50, 50)
    //绘制半透明蓝色轮廓的矩形
    context.strokeStyle = 'rgba(0,0,255,0.5)'
    context.strokeRect(30, 30, 50, 50)

    //在前两个矩形重叠的区域擦除一个矩形区域
    context.clearRect(40, 40, 10, 10)
  }
</script>
```

### 18.3.3 绘制路径

要绘制路径，必须首先调用 `beginPath()`方法以表示要开始绘制新路径。然后，再调用下列方法来绘制路径。

❑ arc(x, y, radius, startAngle, endAngle, counterclockwise)：以坐标(x, y)为圆心，以 radius 为半径绘制一条弧线，起始角度为 startAngle，结束角度为 endAngle（都是弧度）​。最后一个参数 counterclockwise 表示是否逆时针计算起始角度和结束角度（默认为顺时针）​。<br />
❑ arcTo(x1, y1, x2, y2, radius)：以给定半径 radius，经由(x1, y1)绘制一条从上一点到(x2, y2)的弧线。<br />
❑ bezierCurveTo(c1x, c1y, c2x, c2y, x, y)：以(c1x, c1y)和(c2x, c2y)为控制点，绘制一条从上一点到(x, y)的弧线（三次贝塞尔曲线）​。<br />
❑ lineTo(x, y)：绘制一条从上一点到(x, y)的直线。<br />
❑ moveTo(x, y)：不绘制线条，只把绘制光标移动到(x, y)。<br />
❑ quadraticCurveTo(cx, cy, x, y)：以(cx, cy)为控制点，绘制一条从上一点到(x,y)的弧线（二次贝塞尔曲线）​。<br />
❑ rect(x, y, width, height)：以给定宽度和高度在坐标点(x, y)绘制一个矩形。这个方法与 strokeRect()和 fillRect()的区别在于，它创建的是一条路径，而不是独立的图形。

创建路径之后，可以使用 `closePath()`方法绘制一条返回起点的线。如果路径已经完成，则既可以指定 `fillStyle` 属性并调用 `fill()`方法来填充路径，也可以指定 `strokeStyle` 属性并调用 `stroke()`方法来描画路径，还可以调用 `clip()`方法基于已有路径创建一个新剪切区域。

```javascript
let drawing = document.getElementById('drawing')
// 确保浏览器支持<canvas>
if (drawing.getContext) {
  let context = drawing.getContext('2d')
  // 创建路径
  context.beginPath()
  // 绘制外圆
  context.arc(100, 100, 99, 0, 2 * Math.PI, false)
  // 绘制内圆
  context.moveTo(194, 100)
  context.arc(100, 100, 94, 0, 2 * Math.PI, false)
  // 绘制分针
  context.moveTo(100, 100)
  context.lineTo(100, 15)
  // 绘制时针
  context.moveTo(100, 100)
  context.lineTo(35, 100)
  // 描画路径
  context.stroke()

  context.font = 'bold 14px Arial'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText('12', 100, 20)
}
```

路径是 2D 上下文的主要绘制机制，为绘制结果提供了很多控制。因为路径经常被使用，所以也有一个 `isPointInPath()`方法，接收 x 轴和 y 轴坐标作为参数。这个方法用于确定指定的点是否在路径上，可以在关闭路径前随时调用。

### 18.3.4 绘制文本

文本和图像混合也是常见的绘制需求，因此 2D 绘图上下文还提供了绘制文本的方法，即 `fillText()`和 `strokeText()`。这两个方法都接收 4 个参数：要绘制的字符串、x 坐标、y 坐标和可选的最大像素宽度。而且，这两个方法最终绘制的结果都取决于以下 3 个属性。

❑ font：以 CSS 语法指定的字体样式、大小、字体族等，比如"10px Arial"。<br />
❑ textAlign：指定文本的对齐方式，可能的值包括"start"、"end"、"left"、"right"和"center"。推荐使用"start"和"end"，不使用"left"和"right"，因为前者无论在从左到右书写的语言还是从右到左书写的语言中含义都更明确。<br />
❑ textBaseLine：指定文本的基线，可能的值包括"top"、"hanging"、"middle"、"alphabetic"、"ideographic"和"bottom"。

```javascript
// 正常
context.font = 'bold 14px Arial'
context.textAlign = 'center'
context.textBaseline = 'middle'
context.fillText('12', 100, 20)
// 与开头对齐
context.textAlign = 'start'
context.fillText('12', 100, 40)
// 与末尾对齐
context.textAlign = 'end'
context.fillText('12', 100, 60)
```

`measureText()`方法用于辅助确定文本大小。这个方法接收一个参数，即要绘制的文本，然后返回一个 `TextMetrics` 对象。这个返回的对象目前只有一个属性 `width`，不过将来应该会增加更多度量指标。

```javascript
let fontSize = 100
context.font = fontSize + 'px Arial'
while (context.measureText('Hello world! ').width > 140) {
  fontSize--
  context.font = fontSize + 'px Arial'
}
context.fillText('Hello world! ', 10, 10)
context.fillText('Font size is ' + fontSize + 'px', 10, 50)
```

`fillText()`和 `strokeText()`方法还有第四个参数，即文本的最大宽度。这个参数是可选的（Firefox 4 是第一个实现它的浏览器）​，如果调用 `fillText()`和 `strokeText()`时提供了此参数，但要绘制的字符串超出了最大宽度限制，则文本会以正确的字符高度绘制，这时字符会被水平压缩，以达到限定宽度。

### 18.3.5 变换

❑ rotate(angle)：围绕原点把图像旋转 angle 弧度。<br />
❑ scale(scaleX, scaleY)：通过在 x 轴乘以 scaleX、在 y 轴乘以 scaleY 来缩放图像。scaleX 和 scaleY 的默认值都是 1.0。<br />
❑ translate(x, y)：把原点移动到(x, y)。执行这个操作后，坐标(0, 0)就会变成(x, y)。<br />
❑ transform(m1_1, m1_2, m2_1, m2_2, dx, dy)：像下面这样通过矩阵乘法直接修改矩阵。

```matrix
m1_1 m1_2 dx
m2_1 m2_2 dy
0     0     1
```

❑ setTransform(m1_1, m1_2, m2_1, m2_2, dx, dy)：把矩阵重置为默认值，再以传入的参数调用 transform()。

```javascript
let drawing = document.getElementById('drawing')
// 确保浏览器支持<canvas>
if (drawing.getContext) {
  let context = drawing.getContext('2d')
  // 创建路径
  context.beginPath()
  // 绘制外圆
  context.arc(100, 100, 99, 0, 2 * Math.PI, false)
  // 绘制内圆
  context.moveTo(194, 100)
  context.arc(100, 100, 94, 0, 2 * Math.PI, false)
  //移动原点到表盘中心
  context.translate(100, 100)
  //旋转表针
  context.rotate(1)
  //绘制分针
  context.moveTo(0, 0)
  context.lineTo(0, -85)
  //绘制时针
  context.moveTo(0, 0)
  context.lineTo(-65, 0)
  // 描画路径
  context.stroke()
}
```

所有这些变换，包括 `fillStyle` 和 `strokeStyle` 属性，会一直保留在上下文中，直到再次修改它们。虽然没有办法明确地将所有值都重置为默认值，但有两个方法可以帮我们跟踪变化。如果想着什么时候再回到当前的属性和变换状态，可以调用 `save()`方法。调用这个方法后，所有这一时刻的设置会被放到一个暂存栈中。保存之后，可以继续修改上下文。而在需要恢复之前的上下文时，可以调用 `restore()`方法。这个方法会从暂存栈中取出并恢复之前保存的设置。多次调用 `save()`方法可以在暂存栈中存储多套设置，然后通过 `restore()`可以系统地恢复。

```javascript
context.fillStyle = '#ff0000'
context.save()
context.fillStyle = '#00ff00'
context.translate(100, 100)
context.save()
context.fillStyle = '#0000ff'
context.fillRect(0, 0, 100, 200) // 在(100, 100)绘制蓝色矩形
context.restore()
context.fillRect(10, 10, 100, 200) // 在(100, 100)绘制绿色矩形
context.restore()
context.fillRect(0, 0, 100, 200) // 在(0, 0)绘制红色矩形
```

:::tip 注意
`save()`方法只保存应用到绘图上下文的设置和变换，不保存绘图上下文的内容。
:::

### 18.3.6 绘制图像

如果想把现有图像绘制到画布上，可以使用 `drawImage()`方法。这个方法可以接收 3 组不同的参数，并产生不同的结果。最简单的调用是传入一个 HTML 的`<img>`元素，以及表示绘制目标的 x 和 y 坐标，结果是把图像绘制到指定位置。

可以再传入另外两个参数：目标宽度和目标高度。

还可以只把图像绘制到上下文中的一个区域。此时，需要给 `drawImage()`提供 9 个参数：要绘制的图像、源图像 x 坐标、源图像 y 坐标、源图像宽度、源图像高度、目标区域 x 坐标、目标区域 y 坐标、目标区域宽度和目标区域高度。这个重载后的 drawImage()方法可以实现最大限度的控制

```javascript
let image = document.images[0]
context.drawImage(image, 10, 10)
context.drawImage(image, 50, 10, 20, 30)
context.drawImage(image, 0, 10, 50, 50, 0, 100, 40, 60)
```

第一个参数除了可以是 HTML 的`<img>`元素，还可以是另一个`<canvas>`元素，这样就会把另一个画布的内容绘制到当前画布上。

结合其他一些方法，`drawImage()`方法可以方便地实现常见的图像操作。操作的结果可以使用 `toDataURL()`方法获取。不过有一种情况例外：如果绘制的图像来自其他域而非当前页面，则不能获取其数据。此时，调用 `toDataURL()`将抛出错误。比如，如果来自www.example.com的页面上绘制的是来自www.wrox.com的图像，则上下文就是“脏的”​，获取数据时会抛出错误。

### 18.3.7 阴影

❑ shadowColor: CSS 颜色值，表示要绘制的阴影颜色，默认为黑色。<br />
❑ shadowOffsetX：阴影相对于形状或路径的 x 坐标的偏移量，默认为 0。<br />
❑ shadowOffsetY：阴影相对于形状或路径的 y 坐标的偏移量，默认为 0。<br />
❑ shadowBlur：像素，表示阴影的模糊量。默认值为 0，表示不模糊。

```javascript
let context = drawing.getContext('2d')
//设置阴影
context.shadowOffsetX = 5
context.shadowOffsetY = 5
context.shadowBlur = 4
context.shadowColor = 'rgba(0, 0, 0, 0.5)'
// 绘制红色矩形
context.fillStyle = '#ff0000'
context.fillRect(10, 10, 50, 50)
// 绘制蓝色矩形
context.fillStyle = 'rgba(0,0,255,1)'
context.fillRect(30, 30, 50, 50)
```

### 18.3.8 渐变

渐变通过 `CanvasGradient` 的实例表示，在 2D 上下文中创建和修改都非常简单。要创建一个新的线性渐变，可以调用上下文的 `createLinearGradient()`方法。这个方法接收 4 个参数：起点 x 坐标、起点 y 坐标、终点 x 坐标和终点 y 坐标。调用之后，该方法会以指定大小创建一个新的 `CanvasGradient` 对象并返回实例。

有了 `gradient` 对象后，接下来要使用 `addColorStop()`方法为渐变指定色标。这个方法接收两个参数：色标位置和 CSS 颜色字符串。色标位置通过 0 ～ 1 范围内的值表示，0 是第一种颜色，1 是最后一种颜色。

```javascript
let gradient = context.createLinearGradient(30, 30, 70, 70)
gradient.addColorStop(0, 'white')
gradient.addColorStop(1, 'black')

// 绘制红色矩形
context.fillStyle = '#ff0000'
context.fillRect(10, 10, 50, 50)
// 绘制渐变矩形
context.fillStyle = gradient
context.fillRect(30, 30, 50, 50)
```

径向渐变（或放射性渐变）要使用 `createRadialGradient()`方法来创建。这个方法接收 6 个参数，分别对应两个圆形圆心的坐标和半径。前 3 个参数指定起点圆形中心的 x、y 坐标和半径，后 3 个参数指定终点圆形中心的 x、y 坐标和半径。在创建径向渐变时，可以把两个圆形想象成一个圆柱体的两个圆形表面。把一个表面定义得小一点，另一个定义得大一点，就会得到一个圆锥体。然后，通过移动两个圆形的圆心，就可以旋转这个圆锥体。

```javascript
let gradient = context.createRadialGradient(55, 55, 10, 55, 55, 30)
gradient.addColorStop(0, 'white')
gradient.addColorStop(1, 'black')
// 绘制红色矩形
context.fillStyle = '#ff0000'
context.fillRect(10, 10, 50, 50)
// 绘制渐变矩形
context.fillStyle = gradient
context.fillRect(30, 30, 50, 50)
```

### 18.3.9 图案

图案是用于填充和描画图形的重复图像。要创建新图案，可以调用 `createPattern()`方法并传入两个参数：一个 HTML `<img>`元素和一个表示该如何重复图像的字符串。第二个参数的值与 CSS 的 `background-repeat` 属性是一样的，包括"`repeat`"、"`repeat-x`"、"`repeat-y`"和"`no-repeat`"。

```javascript
let image = document.images[0],
  pattern = context.createPattern(image, 'repeat')
// 绘制矩形
context.fillStyle = pattern
context.fillRect(10, 10, 150, 150)
```

传给 `createPattern()`方法的第一个参数也可以是`<video>`元素或者另一个`<canvas>`元素。

### 18.3.10 图像数据

2D 上下文中比较强大的一种能力是可以使用 `getImageData()`方法获取原始图像数据。这个方法接收 4 个参数：要取得数据中第一个像素的左上角坐标和要取得的像素宽度及高度。

```javascript
let imageData = context.getImageData(10, 5, 50, 50)
```

返回的对象是一个 `ImageData` 的实例。每个 `ImageData` 对象都包含 3 个属性：`width`、`height` 和 `data`，其中，`data` 属性是包含图像的原始像素信息的数组。每个像素在 `data` 数组中都由 4 个值表示，分别代表红、绿、蓝和透明度值。

`putImageData()` 方法用于将数据从已有的 `ImageData` 对象绘制到画布上。

### 18.3.11 合成

2D 上下文中绘制的所有内容都会应用两个属性：`globalAlpha` 和 `globalCompositionOperation`，其中，`globalAlpha` 属性是一个范围在 0~1 的值（包括 0 和 1）​，用于指定所有绘制内容的透明度，默认值为 0。如果所有后来的绘制都需要使用同样的透明度，那么可以将 `globalAlpha` 设置为适当的值，执行绘制，然后再把 `globalAlpha` 设置为 0。

```javascript
// 绘制红色矩形
context.fillStyle = '#ff0000'
context.fillRect(10, 10, 50, 50)
// 修改全局透明度
context.globalAlpha = 0.5
// 绘制蓝色矩形
context.fillStyle = 'rgba(0,0,255,1)'
context.fillRect(30, 30, 50, 50)
// 重置
context.globalAlpha = 0
```

`globalCompositionOperation` 属性表示新绘制的形状如何与上下文中已有的形状融合。这个属性是一个字符串，可以取下列值。

❑ source-over：默认值，新图形绘制在原有图形上面。<br />
❑ source-in：新图形只绘制出与原有图形重叠的部分，画布上其余部分全部透明。<br />
❑ source-out：新图形只绘制出不与原有图形重叠的部分，画布上其余部分全部透明。<br />
❑ source-atop：新图形只绘制出与原有图形重叠的部分，原有图形不受影响。<br />
❑ destination-over：新图形绘制在原有图形下面，重叠部分只有原图形透明像素下的部分可见。<br />
❑ destination-in：新图形绘制在原有图形下面，画布上只剩下二者重叠的部分，其余部分完全透明。<br />
❑ destination-out：新图形与原有图形重叠的部分完全透明，原图形其余部分不受影响。<br />
❑ destination-atop：新图形绘制在原有图形下面，原有图形与新图形不重叠的部分完全透明。<br />
❑ lighter：新图形与原有图形重叠部分的像素值相加，使该部分变亮。<br />
❑ copy：新图形将擦除并完全取代原有图形。<br />
❑ xor：新图形与原有图形重叠部分的像素执行“异或”计算。

```javascript
// 绘制红色矩形
context.fillStyle = '#ff0000'
context.fillRect(10, 10, 50, 50)
// 设置合成方式
context.globalCompositeOperation = 'destination-over'
// 绘制蓝色矩形
context.fillStyle = 'rgba(0,0,255,1)'
context.fillRect(30, 30, 50, 50)
```

## 18.4 WebGL（先跳过）

WebGL 是画布的 3D 上下文。

### 18.4.1 WebGL 上下文

在完全支持的浏览器中，WebGL 2.0 上下文的名字叫"webgl2", WebGL 1.0 上下文的名字叫"webgl1"。如果浏览器不支持 WebGL，则尝试访问 WebGL 上下文会返回 `null`。在使用上下文之前，应该先检测返回值是否存在：

```javascript
let drawing = document.getElementById('drawing')
// 确保浏览器支持<canvas>
if (drawing.getContext) {
  let gl
  try {
    gl = drawing.getContext('webgl', { alpha: false })
  } catch (ex) {
    //什么也不做
  }
  if (gl) {
    //使用WebGL
  }
}
```

### 18.4.2 WebGL 基础

可以在调用 `getContext()`取得 WebGL 上下文时指定一些选项。这些选项通过一个参数对象传入，选项就是参数对象的一个或多个属性。

❑ alpha：布尔值，表示是否为上下文创建透明通道缓冲区，默认为 true。<br />
❑ depth：布尔值，表示是否使用 16 位深缓冲区，默认为 true。<br />
❑ stencil：布尔值，表示是否使用 8 位模板缓冲区，默认为 false。<br />
❑ antialias：布尔值，表示是否使用默认机制执行抗锯齿操作，默认为 true。<br />
❑ premultipliedAlpha：布尔值，表示绘图缓冲区是否预乘透明度值，默认为 true。<br />
❑ preserveDrawingBuffer：布尔值，表示绘图完成后是否保留绘图缓冲区，默认为 false。建议在充分了解这个选项的作用后再自行修改，因为这可能会影响性能。

如果调用 `getContext()`不能创建 WebGL 上下文，某些浏览器就会抛出错误。

#### 1．常量

如果你熟悉 OpenGL，那么可能知道用于操作的各种常量。这些常量在 OpenGL 中的名字以 GL\*开头。在 WebGL 中，context 对象上的常量则不包含 GL\*前缀。例如，GL_COLOR_BUFFER_BIT 常量在 WebGL 中要这样访问 gl.COLOR_BUFFER_BIT。WebGL 以这种方式支持大部分 OpenGL 常量（少数常量不支持）​。

#### 2．方法命名

OpenGL（同时也是 WebGL）中的很多方法会包含相关的数据类型信息。接收不同类型和不同数量参数的方法，会通过方法名的后缀体现这些信息。表示参数数量的数字（1~4）在先，表示数据类型的字符串（​“f”表示浮点数，​“i”表示整数）在后。比如，gl.uniform4f()的意思是需要 4 个浮点数值参数，而 gl.uniform3i()表示需要 3 个整数值参数。

还有很多方法接收数组，这类方法用字母“v”​（vector）来表示。因此，gl.uniform3iv()就是要接收一个包含 3 个值的数组参数。在编写 WebGL 代码时，要记住这些约定。

#### 3．准备绘图

准备使用 WebGL 上下文之前，通常需要先指定一种实心颜色清除`<canvas>`。为此，要调用 `clearColor()`方法并传入 4 个参数，分别表示红、绿、蓝和透明度值。每个参数必须是 0~1 范围内的值，表示各个组件在最终颜色的强度。

```javascript
gl.clearColor(0, 0, 0, 1) // 黑色
gl.clear(gl.COLOR_BUFFER_BIT)
```

以上代码把清理颜色缓冲区的值设置为黑色，然后调用 方法，这个方法相当于 OpenGL 中的 方法。参数 gl.COLOR_BUFFER_BIT 告诉 WebGL 使用之前定义的颜色填充画布。通常，所有绘图操作之前都需要先清除绘制区域。

#### 4．视口与坐标

绘图前还要定义 WebGL 视口。默认情况下，视口使用整个`<canvas>`区域。要改变视口，可以调用 `viewport()`方法并传入视口相对于`<canvas>`元素的 x、y 坐标及宽度和高度。

```javascript
gl.viewport(0, 0, drawing.width, drawing.height)
```

这个视口的坐标系统与网页中通常的坐标系统不一样。视口的 x 和 y 坐标起点(0, 0)表示`<canvas>`元素的左下角

#### 5．缓冲区
