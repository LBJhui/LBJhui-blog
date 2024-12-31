# 第 20 章 JavaScriptAPI

## 20.1 Atomics 与 SharedArrayBuffer

多个上下文访问 `SharedArrayBuffer` 时，如果同时对缓冲区执行操作，就可能出现资源争用问题。Atomics API 通过强制同一时刻只能对缓冲区执行一个操作，可以让多个上下文安全地读写一个 `SharedArrayBuffer`。

### 20.1.1 SharedArrayBuffer

`SharedArrayBuffer` 与 `ArrayBuffer` 具有同样的 API。二者的主要区别是 `ArrayBuffer` 必须在不同执行上下文间切换，`SharedArrayBuffer` 则可以被任意多个执行上下文同时使用。

在多个执行上下文间共享内存意味着并发线程操作成为了可能。传统 JavaScript 操作对于并发内存访问导致的资源争用没有提供保护。下面的例子演示了 4 个专用工作线程访问同一个 `SharedArrayBuffer` 导致的资源争用问题：

```javascript
const workerScript = `
    self.onmessage = ({data}) => {
      const view = new Uint32Array(data);
      // 执行1000000 次加操作
      for (let i = 0; i < 1E6; ++i) {
        //线程不安全加操作会导致资源争用
        view[0]+=1;
      }
      self.postMessage(null);
    };
    `
const workerScriptBlobUrl = URL.createObjectURL(new Blob([workerScript]))
// 创建容量为4 的工作线程池
const workers = []
for (let i = 0; i < 4; ++i) {
  workers.push(new Worker(workerScriptBlobUrl))
}
// 在最后一个工作线程完成后打印出最终值
let responseCount = 0
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount == workers.length) {
      console.log(`Final buffer value: ${view[0]}`)
    }
  }
}
// 初始化SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
view[0] = 1
// 把SharedArrayBuffer发送到每个工作线程
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer)
}
//（期待结果为4000001。实际输出可能类似这样：）
// Final buffer value: 2145106
```

为解决这个问题，Atomics API 应运而生。Atomics API 可以保证 `SharedArrayBuffer` 上的 JavaScript 操作是线程安全的。

### 20.1.2 原子操作基础

#### 1．算术及位操作方法

以下代码演示了所有算术方法：

```javascript
// 创建大小为 1 的缓冲区
let sharedArrayBuffer = new SharedArrayBuffer(1)
// 基于缓冲创建Uint8Array
let typedArray = new Uint8Array(sharedArrayBuffer)
// 所有ArrayBuffer全部初始化为0
console.log(typedArray) // Uint8Array[0]
const index = 0
const increment = 5
// 对索引 0 处的值执行原子加5
Atomics.add(typedArray, index, increment)
console.log(typedArray) // Uint8Array[5]
// 对索引 0 处的值执行原子减5
Atomics.sub(typedArray, index, increment)
console.log(typedArray) // Uint8Array[0]
```

以下代码演示了所有位方法：

```javascript
// 创建大小为 1 的缓冲区
let sharedArrayBuffer = new SharedArrayBuffer(1)
// 基于缓冲创建Uint8Array
let typedArray = new Uint8Array(sharedArrayBuffer)
// 所有ArrayBuffer全部初始化为0
console.log(typedArray) // Uint8Array[0]
const index = 0
// 对索引 0 处的值执行原子或0b1111
Atomics.or(typedArray, index, 0b1111)
console.log(typedArray) // Uint8Array[15]
// 对索引 0 处的值执行原子与0b1111
Atomics.and(typedArray, index, 0b1100)
console.log(typedArray) // Uint8Array[12]
// 对索引 0 处的值执行原子异或0b1111
Atomics.xor(typedArray, index, 0b1111)
console.log(typedArray) // Uint8Array[3]
```

前面线程不安全的例子可以改写为下面这样：

```javascript
const workerScript = `
      self.onmessage = ({data}) => {
      const view = new Uint32Array(data);
      // 执行1000000 次加操作
      for (let i = 0; i < 1E6; ++i) {
        //线程安全的加操作
        Atomics.add(view, 0, 1);
      }
      self.postMessage(null);
    };
    `
const workerScriptBlobUrl = URL.createObjectURL(new Blob([workerScript]))
// 创建容量为4 的工作线程池
const workers = []
for (let i = 0; i < 4; ++i) {
  workers.push(new Worker(workerScriptBlobUrl))
}
// 在最后一个工作线程完成后打印出最终值
let responseCount = 0
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount == workers.length) {
      console.log(`Final buffer value: ${view[0]}`)
    }
  }
}
// 初始化SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
view[0] = 1
// 把SharedArrayBuffer发送到每个工作线程
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer)
}
//（期待结果为4000001）
//Finalbuffervalue: 4000001
```

#### 2．原子读和写

浏览器的 JavaScript 编译器和 CPU 架构本身都有权限重排指令以提升程序执行效率。正常情况下，JavaScript 的单线程环境是可以随时进行这种优化的。但多线程下的指令重排可能导致资源争用，而且极难排错。

Atomics API 通过两种主要方式解决了这个问题。

❑ 所有原子指令相互之间的顺序永远不会重排。<br />
❑ 使用原子读或原子写保证所有指令（包括原子和非原子指令）都不会相对原子读/写重新排序。这意味着位于原子读/写之前的所有指令会在原子读/写发生前完成，而位于原子读/写之后的所有指令会在原子读/写完成后才会开始。

除了读写缓冲区的值，`Atomics.load()`和 `Atomics.store()`还可以构建“代码围栏”​。JavaScript 引擎保证非原子指令可以相对于 `load()`或 `store()`本地重排，但这个重排不会侵犯原子读/写的边界。

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
// 执行非原子写
view[0] = 1
// 非原子写可以保证在这个读操作之前完成，因此这里一定会读到1
console.log(Atomics.load(view, 0)) //1
// 执行原子写
Atomics.store(view, 0, 2)
// 非原子读可以保证在原子写完成后发生，因此这里一定会读到2
console.log(view[0]) // 2
```

#### 3．原子交换

为了保证连续、不间断的先读后写，Atomics API 提供了两种方法：`exchange()`和 `compareExchange()`。

`Atomics.exchange()`执行简单的交换，以保证其他线程不会中断值的交换：

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
// 在索引0 处写入3
Atomics.store(view, 0, 3)
// 从索引0 处读取值，然后在索引0 处写入4
console.log(Atomics.exchange(view, 0, 4)) //3
// 从索引0 处读取值
console.log(Atomics.load(view, 0)) //4
```

在多线程程序中，一个线程可能只希望在上次读取某个值之后没有其他线程修改该值的情况下才对共享缓冲区执行写操作。如果这个值没有被修改，这个线程就可以安全地写入更新后的值；如果这个值被修改了，那么执行写操作将会破坏其他线程计算的值。对于这种任务，Atomics API 提供了 `compareExchange()`方法。这个方法只在目标索引处的值与预期值匹配时才会执行写操作。

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
// 在索引0 处写入5
Atomics.store(view, 0, 5)
// 从缓冲区读取值
let initial = Atomics.load(view, 0)
// 对这个值执行非原子操作
let result = initial ** 2
// 只在缓冲区未被修改的情况下才会向缓冲区写入新值
Atomics.compareExchange(view, 0, initial, result)
// 检查写入成功
console.log(Atomics.load(view, 0)) //25
```

如果值不匹配，`compareExchange()`调用则什么也不做：

```javascript
const sharedArrayBuffer = new SharedArrayBuffer(4)
const view = new Uint32Array(sharedArrayBuffer)
// 在索引0 处写入5
Atomics.store(view, 0, 5)
// 从缓冲区读取值
let initial = Atomics.load(view, 0)
// 对这个值执行非原子操作
let result = initial ** 2
// 只在缓冲区未被修改的情况下才会向缓冲区写入新值
Atomics.compareExchange(view, 0, -1, result)
// 检查写入失败
console.log(Atomics.load(view, 0)) //5
```

#### 4．原子 Futex 操作与加锁

如果没有某种锁机制，多线程程序就无法支持复杂需求。为此，Atomics API 提供了模仿 Linux Futex（快速用户空间互斥量，fast user-space mutex）的方法。这些方法本身虽然非常简单，但可以作为更复杂锁机制的基本组件。

:::tip 注意
所有原子 Futex 操作只能用于 Int32Array 视图。而且，也只能用在工作线程内部。
:::

`Atomics.wait()`和 `Atomics.notify()`(PV 操作)

```javascript
const workerScript = `
    self.onmessage = ({data}) => {
      const view = new Int32Array(data);
      console.log('Waiting to obtain lock');
      // 遇到初始值则停止，10000 毫秒超时
      Atomics.wait(view, 0, 0, 1E5);
      console.log('Obtained lock');
      // 在索引0 处加1
      Atomics.add(view, 0, 1);
      console.log('Releasing lock');
      // 只允许1 个工作线程继续执行
      Atomics.notify(view, 0, 1);
      self.postMessage(null);
    };
    `
const workerScriptBlobUrl = URL.createObjectURL(new Blob([workerScript]))
const workers = []
for (let i = 0; i < 4; ++i) {
  workers.push(new Worker(workerScriptBlobUrl))
}
// 在最后一个工作线程完成后打印出最终值
let responseCount = 0
for (const worker of workers) {
  worker.onmessage = () => {
    if (++responseCount == workers.length) {
      console.log(`Final buffer value: ${view[0]}`)
    }
  }
}
// 初始化SharedArrayBuffer
const sharedArrayBuffer = new SharedArrayBuffer(8)
const view = new Int32Array(sharedArrayBuffer)
// 把SharedArrayBuffer发送到每个工作线程
for (const worker of workers) {
  worker.postMessage(sharedArrayBuffer)
}
// 1000 毫秒后释放第一个锁
setTimeout(() => Atomics.notify(view, 0, 1), 1000)
//Waitingtoobtainlock
//Waitingtoobtainlock
//Waitingtoobtainlock
//Waitingtoobtainlock
//Obtainedlock
//Releasinglock
//Obtainedlock
//Releasinglock
//Obtainedlock
//Releasinglock
//Obtainedlock
//Releasinglock
//Finalbuffervalue: 4
```

`Atomics.isLockFree()`方法在高性能算法中可以用来确定是否有必要获取锁。

## 20.2 跨上下文消息

跨文档消息，有时候也简称为 XDM（cross-document messaging）​，是一种在不同执行上下文（如不同工作线程或不同源的页面）间传递信息的能力。

XDM 的核心是 `postMessage()`方法。除了 XDM，这个方法名还在 HTML5 中很多地方用到过，但目的都一样，都是把数据传送到另一个位置。

`postMessage()`方法接收 3 个参数：消息、表示目标接收源的字符串和可选的可传输对象的数组（只与工作线程相关）​。第二个参数对于安全非常重要，其可以限制浏览器交付数据的目标。

```javascript
let iframeWindow = document.getElementById('myframe').contentWindow
iframeWindow.postMessage('A secret', 'http://www.wrox.com')
```

如果不想限制接收目标，则可以给 `postMessage()`的第二个参数传"\*"。

接收到 XDM 消息后，`window` 对象上会触发 `message` 事件。这个事件是异步触发的，因此从消息发出到接收到消息（接收窗口触发 `message` 事件）可能有延迟。传给 `onmessage` 事件处理程序的 `event` 对象包含以下 3 方面重要信息。

❑ data：作为第一个参数传递给 postMessage()的字符串数据。<br />
❑ origin：发送消息的文档源，例如"http://www.wrox.com"。<br />
❑ source：发送消息的文档中 window 对象的代理。这个代理对象主要用于在发送上一条消息的窗口中执行 postMessage()方法。如果发送窗口有相同的源，那么这个对象应该就是 window 对象。

```javascript
window.addEventListener('message', (event) => {
  // 确保来自预期发送者
  if (event.origin == 'http://www.wrox.com') {
    // 对数据进行一些处理
    processMessage(event.data)
    // 可选：向来源窗口发送一条消息
    event.source.postMessage('Received! ', 'http://p2p.wrox.com')
  }
})
```

## 20.3 Encoding API

### 20.3.1 文本编码

Encoding API 提供了两种将字符串转换为定型数组二进制格式的方法：批量编码和流编码。把字符串转换为定型数组时，编码器始终使用 UTF-8。

#### 1．批量编码

所谓批量，指的是 JavaScript 引擎会同步编码整个字符串。对于非常长的字符串，可能会花较长时间。批量编码是通过 `TextEncoder` 的实例完成的，这个实例上有一个 `encode()`方法，该方法接收一个字符串参数，并以 `Uint8Array` 格式返回每个字符的 UTF-8 编码。

```javascript
const textEncoder = new TextEncoder()
const decodedText = 'foo'
const encodedText = textEncoder.encode(decodedText)
// f的UTF-8 编码是0x66（即十进制102）
// o的UTF-8 编码是0x6F（即二进制111）
console.log(encodedText) // Uint8Array(3) [102, 111, 111]
```

编码器是用于处理字符的，有些字符（如表情符号）在最终返回的数组中可能会占多个索引。

```javascript
const textEncoder = new TextEncoder()
const decodedText = '😊'
const encodedText = textEncoder.encode(decodedText)
// ☺的UTF-8 编码是0xF0 0x9F 0x98 0x8A（即十进制240、159、152、138）
console.log(encodedText) // Uint8Array(4) [240, 159, 152, 138]
```

编码器实例还有一个 `encodeInto()`方法，该方法接收一个字符串和目标 `Unit8Array`，返回一个字典，该字典包含 `read` 和 `written` 属性，分别表示成功从源字符串读取了多少字符和向目标数组写入了多少字符。如果定型数组的空间不够，编码就会提前终止，返回的字典会体现这个结果：

```javascript
const textEncoder = new TextEncoder()
const fooArr = new Uint8Array(3)
const barArr = new Uint8Array(2)
const fooResult = textEncoder.encodeInto('foo', fooArr)
const barResult = textEncoder.encodeInto('bar', barArr)
console.log(fooArr) // Uint8Array(3) [102, 111, 111]
console.log(fooResult) // {read: 3, written: 3}
console.log(barArr) // Uint8Array(2) [98, 97]
console.log(barResult) // {read: 2, written: 2}
```

`encode()`要求分配一个新的 `Unit8Array`, `encodeInto()`则不需要。对于追求性能的应用，这个差别可能会带来显著不同。

:::tip 注意
文本编码会始终使用 UTF-8 格式，而且必须写入 `Unit8Array` 实例。使用其他类型数组会导致 `encodeInto()`抛出错误。
:::

#### 2．流编码

`TextEncoderStream` 其实就是 `TransformStream` 形式的 `TextEncoder`。将解码后的文本流通过管道输入流编码器会得到编码后文本块的流。

```javascript
async function* chars() {
  const decodedText = 'foo'
  for (let char of decodedText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char))
  }
}
const decodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const encodedTextStream = decodedTextStream.pipeThrough(new TextEncoderStream())
const readableStreamDefaultReader = encodedTextStream.getReader()
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
//Uint8Array[102]
//Uint8Array[111]
//Uint8Array[111]
```

### 20.3.2 文本解码

Encoding API 提供了两种将定型数组转换为字符串的方式：批量解码和流解码。与编码器类不同，在将定型数组转换为字符串时，解码器支持非常多的字符串编码，默认字符编码格式是 UTF-8。

#### 1．批量解码

所谓批量，指的是 JavaScript 引擎会同步解码整个字符串。对于非常长的字符串，可能会花较长时间。批量解码是通过 `TextDecoder` 的实例完成的，这个实例上有一个 `decode()`方法，该方法接收一个定型数组参数，返回解码后的字符串。

```javascript
const textDecoder = new TextDecoder()
// f的UTF-8 编码是0x66（即十进制102）
// o的UTF-8 编码是0x6F（即二进制111）
const encodedText = Uint8Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)
console.log(decodedText) // foo
```

解码器不关心传入的是哪种定型数组，它只会专心解码整个二进制表示。

```javascript
const textDecoder = new TextDecoder()
// f的UTF-8 编码是0x66（即十进制102）
// o的UTF-8 编码是0x6F（即二进制111）
const encodedText = Uint32Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)
console.log(decodedText) // 'f   o   o'
```

解码器是用于处理定型数组中分散在多个索引上的字符的，包括表情符号：

```javascript
const textDecoder = new TextDecoder()
// ☺的UTF-8 编码是0xF0 0x9F 0x98 0x8A（即十进制240、159、152、138）
const encodedText = Uint8Array.of(240, 159, 152, 138)
const decodedText = textDecoder.decode(encodedText)
console.log(decodedText) // '😊'
```

与 TextEncoder 不同，TextDecoder 可以兼容很多字符编码。

```javascript
const textDecoder = newTextDecoder('utf-16')
// f的UTF-8 编码是0x0066（即十进制102）
// o的UTF-8 编码是0x006F（即二进制111）
const encodedText = Uint16Array.of(102, 111, 111)
const decodedText = textDecoder.decode(encodedText)
console.log(decodedText) // foo
```

#### 2．流解码

`TextDecoderStream` 其实就是 `TransformStream` 形式的 `TextDecoder`。将编码后的文本流通过管道输入流解码器会得到解码后文本块的流。

```javascript
async function* chars() {
  //每个块必须是一个定型数组
  const encodedText = [102, 111, 111].map((x) => Uint8Array.of(x))
  for (let char of encodedText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char))
  }
}
const encodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const decodedTextStream = encodedTextStream.pipeThrough(new TextDecoderStream())
const readableStreamDefaultReader = decodedTextStream.getReader()
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
//f
//o
//o
```

文本解码器流能够识别可能分散在不同块上的代理对。解码器流会保持块片段直到取得完整的字符。比如在下面的例子中，流解码器在解码流并输出字符之前会等待传入 4 个块：

```javascript
async function* chars() {
  // 😊 的UTF-8 编码是0xF0 0x9F 0x98 0x8A（即十进制240、159、152、138）
  const encodedText = [240, 159, 152, 138].map((x) => Uint8Array.of(x))
  for (let char of encodedText) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, char))
  }
}
const encodedTextStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of chars()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const decodedTextStream = encodedTextStream.pipeThrough(new TextDecoderStream())
const readableStreamDefaultReader = decodedTextStream.getReader()
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
// '😊'
```

文本解码器流经常与 `fetch()`一起使用，因为响应体可以作为 `ReadableStream` 来处理。

```javascript
const response = await fetch(url)
const stream = response.body.pipeThrough(new TextDecoderStream())
const decodedStream = stream.getReader()
for await (let decodedChunk of decodedStream) {
  console.log(decodedChunk)
}
```

## 20.4 File API 与 Blob API

### 20.4.1 File 类型

File API 仍然以表单中的文件输入字段为基础，但是增加了直接访问文件信息的能力。HTML5 在 DOM 上为文件输入元素添加了 `files` 集合。当用户在文件字段中选择一个或多个文件时，这个 `files` 集合中会包含一组 File 对象，表示被选中的文件。每个 File 对象都有一些只读属性。

❑ name：本地系统中的文件名。<br />
❑ size：以字节计的文件大小。<br />
❑ type：包含文件 MIME 类型的字符串。<br />
❑ lastModifiedDate：表示文件最后修改时间的字符串。这个属性只有 Chome 实现了。

### 20.4.2 FileReader 类型

`FileReader` 类型表示一种异步文件读取机制。可以把 `FileReader` 想象成类似于 `XMLHttpRequest`，只不过是用于从文件系统读取文件，而不是从服务器读取数据。`FileReader` 类型提供了几个读取文件数据的方法。

❑ readAsText(file, encoding)：从文件中读取纯文本内容并保存在 result 属性中。第二个参数表示编码，是可选的。<br />
❑ readAsDataURL(file)：读取文件并将内容的数据 URI 保存在 result 属性中。<br />
❑ readAsBinaryString(file)：读取文件并将每个字符的二进制数据保存在 result 属性中。<br />
❑ readAsArrayBuffer(file)：读取文件并将文件内容以 ArrayBuffer 形式保存在 result 属性。

因为这些读取方法是异步的，所以每个 `FileReader` 会发布几个事件，其中 3 个最有用的事件是 `progress`、`error` 和 `load`，分别表示还有更多数据、发生了错误和读取完成。

`progress` 事件每 50 毫秒就会触发一次，其与 `XHR` 的 `progress` 事件具有相同的信息：`lengthComputable`、`loaded` 和 `total`。此外，在 `progress` 事件中可以读取 `FileReader` 的 `result` 属性，即使其中尚未包含全部数据。

`error` 事件会在由于某种原因无法读取文件时触发。触发 `error` 事件时，`FileReader` 的 `error` 属性会包含错误信息。这个属性是一个对象，只包含一个属性：`code`。这个错误码的值可能是 1（未找到文件）​、2（安全错误）​、3（读取被中断）​、4（文件不可读）或 5（编码错误）​。

`load` 事件会在文件成功加载后触发。

```javascript
let filesList = document.getElementById('files-list')
filesList.addEventListener('change', (event) => {
  let info = '',
    output = document.getElementById('output'),
    progress = document.getElementById('progress'),
    files = event.target.files,
    type = 'default',
    reader = new FileReader()
  if (/image/.test(files[0].type)) {
    reader.readAsDataURL(files[0])
    type = 'image'
  } else {
    reader.readAsText(files[0])
    type = 'text'
  }
  reader.onerror = function () {
    output.innerHTML = 'Could not read file, error code is ' + reader.error.code
  }
  reader.onprogress = function (event) {
    if (event.lengthComputable) {
      progress.innerHTML = `${event.loaded}/${event.total}`
    }
  }
  reader.onload = function () {
    let html = ''
    switch (type) {
      case 'image':
        html = `<img src="${reader.result}">`
        break
      case 'text':
        html = reader.result
        break
    }
    output.innerHTML = html
  }
})
```

### 20.4.3 FileReaderSync 类型

`FileReaderSync` 类型就是 `FileReader` 的同步版本。这个类型拥有与 `FileReader` 相同的方法，只有在整个文件都加载到内存之后才会继续执行。`FileReaderSync` 只在工作线程中可用，因为如果读取整个文件耗时太长则会影响全局。

假设通过 `postMessage()`向工作线程发送了一个 File 对象。以下代码会让工作线程同步将文件读取到内存中，然后将文件的数据 URL 发回来：

```javascript
// worker.js
self.omessage = (messageEvent) => {
  const syncReader = new FileReaderSync()
  console.log(syncReader) // FileReaderSync {}
  // 读取文件时阻塞工作线程
  const result = syncReader.readAsDataUrl(messageEvent.data)
  // PDF文件的示例响应
  console.log(result) // data:application/pdf; base64, JVBERi0xLjQK...
  // 把URL发回去
  self.postMessage(result)
}
```

### 20.4.4 Blob 与部分读取

某些情况下，可能需要读取部分文件而不是整个文件。为此，File 对象提供了一个名为 `slice()`的方法。`slice()`方法接收两个参数：起始字节和要读取的字节数。这个方法返回一个 Blob 的实例，而 Blob 实际上是 File 的超类。

blob 表示二进制大对象（binary larget object）​，是 JavaScript 对不可修改二进制数据的封装类型。包含字符串的数组、ArrayBuffers、ArrayBufferViews，甚至其他 Blob 都可以用来创建 blob。Blob 构造函数可以接收一个 options 参数，并在其中指定 MIME 类型。

```javascript
console.log(new Blob(['foo']))
// Blob {size: 3, type: ""}
console.log(new Blob(['{"a": "b"}'], { type: 'application/json' }))
// {size: 10, type: "application/json"}
console.log(new Blob(['<p>Foo</p>', '<p>Bar</p>'], { type: 'text/html' }))
// {size: 20, type: "text/html"}
```

`Blob` 对象有一个 `size` 属性和一个 `type` 属性，还有一个 `slice()`方法用于进一步切分数据。另外也可以使用 `FileReader` 从 `Blob` 中读取数据。

```javascript
let filesList = document.getElementById('files-list')
filesList.addEventListener('change', (event) => {
  let info = '',
    output = document.getElementById('output'),
    progress = document.getElementById('progress'),
    files = event.target.files,
    reader = new FileReader(),
    blob = blobSlice(files[0], 0, 32)
  if (blob) {
    reader.readAsText(blob)
    reader.onerror = function () {
      output.innerHTML = 'Could not read file, error code is ' + reader.error.code
    }
    reader.onload = function () {
      output.innerHTML = reader.result
    }
  } else {
    console.log("Your browser doesn't support slice().")
  }
})
```

### 20.4.5 对象 URL 与 Blob

对象 URL 有时候也称作 Blob URL，是指引用存储在 File 或 Blob 中数据的 URL。对象 URL 的优点是不用把文件内容读取到 JavaScript 也可以使用文件。只要在适当位置提供对象 URL 即可。要创建对象 URL，可以使用 `window.URL.createObjectURL()`方法并传入 File 或 Blob 对象。这个函数返回的值是一个指向内存中地址的字符串。因为这个字符串是 URL，所以可以在 DOM 中直接使用。

```javascript
let filesList = document.getElementById('files-list')
filesList.addEventListener('change', (event) => {
  let info = '',
    output = document.getElementById('output'),
    progress = document.getElementById('progress'),
    files = event.target.files,
    reader = new FileReader(),
    url = window.URL.createObjectURL(files[0])
  if (url) {
    if (/image/.test(files[0].type)) {
      output.innerHTML = `<imgsrc="${url}">`
    } else {
      output.innerHTML = 'Not an image.'
    }
  } else {
    output.innerHTML = "Your browser doesn't support object URLs."
  }
})
```

如果想表明不再使用某个对象 URL，则可以把它传给 `window.URL.revokeObjectURL()`。页面卸载时，所有对象 URL 占用的内存都会被释放。不过，最好在不使用时就立即释放内存，以便尽可能保持页面占用最少资源。

### 20.4.6 读取拖放文件

```javascript{10}
let droptarget = document.getElementById('droptarget')
function handleEvent(event) {
  let info = '',
    output = document.getElementById('output'),
    files,
    i,
    len
  event.preventDefault()
  if (event.type == 'drop') {
    files = event.dataTransfer.files
    i = 0
    len = files.length
    while (i < len) {
      info += `${files[i].name} (${files[i].type}, ${files[i].size} bytes)<br>`
      i++
    }
    output.innerHTML = info
  }
}
droptarget.addEventListener('dragenter', handleEvent)
droptarget.addEventListener('dragover', handleEvent)
droptarget.addEventListener('drop', handleEvent)
```

## 20.5 媒体元素

HTML5 新增了两个与媒体相关的元素，即`<audio>`和`<video>`，从而为浏览器提供了嵌入音频和视频的统一解决方案。这两个元素既支持 Web 开发者在页面中嵌入媒体文件，也支持 JavaScript 实现对媒体的自定义控制。每个元素至少要求有一个 `src` 属性，以表示要加载的媒体文件。我们也可以指定表示视频播放器大小的 `width` 和 `height` 属性，以及在视频加载期间显示图片 URI 的 `poster` 属性。另外，`controls` 属性如果存在，则表示浏览器应该显示播放界面，让用户可以直接控制媒体。开始和结束标签之间的内容是在媒体播放器不可用时显示的替代内容。

由于浏览器支持的媒体格式不同，因此可以指定多个不同的媒体源。为此，需要从元素中删除 `src` 属性，使用一个或多个`<source>`元素代替。

```html
<!-- 嵌入视频 -->
<video src="conference.mpg" id="myVideo">Video player not available.</video>
<!-- 嵌入音频 -->
<audio src="song.mp3" id="myAudio">Audio player not available.</audio>

<!-- 嵌入视频 -->
<video id="myVideo">
  <source src="conference.webm" type="video/webm; codecs='vp8, vorbis'" />
  <source src="conference.ogv" type="video/ogg; codecs='theora, vorbis'" />
  <source src="conference.mpg" />
  Video player not available.
</video>
<!-- 嵌入音频 -->
<audio id="myAudio">
  <source src="song.ogg" type="audio/ogg" />
  <source src="song.mp3" type="audio/mpeg" />
  Audio player not available.
</audio>
```

### 20.5.1 属性

|        属性         |  数据类型  |                                                           说明                                                            |
| :-----------------: | :--------: | :-----------------------------------------------------------------------------------------------------------------------: |
|      autoplay       |  Boolean   |                                                 取得或设置 autoplay 标签                                                  |
|      buffered       | TimeRanges |                                              对象，表示已下载缓冲的时间范围                                               |
|    bufferedBytes    | ByteRanges |                                              对象，表示已下载缓冲的字节范围                                               |
|    bufferingRate    |  Integer   |                                                    平均每秒下载的位数                                                     |
| bufferingThrottled  |  Boolean   |                                                 表示缓冲是否被浏览器截流                                                  |
|      controls       |  Boolean   |                                  取得或设置 controls 属性，用于显示或隐藏浏览器内置控件                                   |
|     currentLoop     |  Integer   |                                                  媒体已经播放的循环次数                                                   |
|     currentSrc      |   String   |                                                    当前播放媒体的 URL                                                     |
|     currentTime     |   Float    |                                                      已经播放的次数                                                       |
| defaultPlaybackRate |   Float    |                                           取得或设置默认回放速率。默认为 1.0 秒                                           |
|      duration       |   Float    |                                                       媒体的总秒数                                                        |
|        ended        |  Boolean   |                                                   表示媒体是否播放完成                                                    |
|        loop         |  Boolean   |                                         取得或设置媒体是否应该在播放完再循环开始                                          |
|        muted        |  Boolean   |                                                  取得或设置媒体是否静音                                                   |
|    networkState     |  Integer   |          表示媒体当前网络连接状态。0 表示空，1 表示加载中，2 表示加载元数据，3 表示加载了第一帧，4 表示加载完成           |
|       paused        |  Boolean   |                                                    表示播放器是否暂停                                                     |
|    playbackRate     |   Float    | 取得或设置当前播放速率。用户可能会让媒体播放快一些或慢一些。与 defaultPlaybackRate 不同，该属性会保持不变，除非开发者修改 |
|       played        | TimeRanges |                                               到目前为止已经播放的时间范围                                                |
|     readyState      |  Integer   |    表示媒体是否已经准备就绪。0 表示媒体不可用，1 表示可以显示当前帧，2 表示媒体可以开始播放，3 表示媒体可以从头播到尾     |
|      seekable       | TimeRanges |                                                    可以跳转的时间范围                                                     |
|       seeking       |  Boolean   |                                           表示播放器是否正移到媒体文件的新位置                                            |
|         src         |   String   |                                              媒体文件源。可以在任何时候重写                                               |
|        start        |   Float    |                                  取得或设置媒体文件中的位置，以秒为单位，从该处开始播放                                   |
|     totalBytes      |  Integer   |                                            资源需要的字节总数（如果知道的话）                                             |
|     videoHeight     |  Integer   |                                    返回视频（不一定是元素）的高度，只适用于 `<video>`                                     |
|     videoWidth      |  Integer   |                                    返回视频（不一定是元素）的宽度，只适用于 `<video>`                                     |
|       volume        |   Float    |                                            取得或设置当前音量，值为 0.0 到 1.0                                            |

### 20.5.2 事件

|        事件         |                             何时触发                             |
| :-----------------: | :--------------------------------------------------------------: |
|        abort        |                            下载被中断                            |
|       canplay       |                  回放可以开始，readyState 为 2                   |
|   canplaythrough    |            回放可以继续，不应该中断，readyState 为 3             |
| canshowcurrentframe |                 已经下载当前帧，readyState 为 1                  |
|   dataunavailable   |             不能回放，因为没有数据，readyState 为 0              |
|   durationchange    |                    duration 属性的值发生变化                     |
|       emptied       |                          网络连接关闭了                          |
|        empty        |                     发生了错误，阻止媒体下载                     |
|        ended        |                   媒体已经播放完一遍，且停止了                   |
|        error        |                      下载期间发生了网络错误                      |
|        load         | 所有媒体已经下载完毕。这个事件已被废弃，使用 canplaythrough 代替 |
|     loadeddata      |                       媒体的第一帧已经下载                       |
|   loadedmetadata    |                       媒体的元数据已经下载                       |
|      loadstart      |                           下载已经开始                           |
|        pause        |                           回放已经暂停                           |
|        play         |                    媒体已经收到开始播放的请求                    |
|       playing       |                      媒体已经实际开始播放了                      |
|      progress       |                              下载中                              |
|     ratechange      |                       媒体播放速率发生变化                       |
|       seeked        |                            跳转已结束                            |
|       seeking       |                        回放已移动到新位置                        |
|       stalled       |                  浏览器尝试下载，但尚未收到数据                  |
|     timeupdate      |                currentTime 被非常规或意外地更改了                |
|    volumechange     |                 volume 或 mute 属性值发生了变化                  |
|       waiting       |                     回放暂停，以下载更多数据                     |

### 20.5.3 自定义媒体播放器

```html
<div class="mediaplayer">
  <div class="video">
    <video id="player" src="movie.mov" poster="mymovie.jpg" width="300" height="200">Video player not available.</video>
  </div>
  <div class="controls">
    <input type="button" value="Play" id="video-btn" />
    <span id="curtime">0</span>/<span id="duration">0</span>
  </div>
</div>

<script>
  // 取得元素的引用
  let player = document.getElementById('player'),
    btn = document.getElementById('video-btn'),
    curtime = document.getElementById('curtime'),
    duration = document.getElementById('duration')
  // 更新时长
  duration.innerHTML = player.duration
  // 为按钮添加事件处理程序
  btn.addEventListener('click', (event) => {
    if (player.paused) {
      player.play()
      btn.value = 'Pause'
    } else {
      player.pause()
      btn.value = 'Play'
    }
  })
  // 周期性更新当前时间
  setInterval(() => {
    curtime.innerHTML = player.currentTime
  }, 250)
</script>
```

### 20.5.4 检测编解码器

`canPlayType()`检测浏览器是否支持给定格式和编解码器。该方法接收一个格式/编解码器字符串，返回一个字符串值："probably"、"maybe"或""（空字符串）​，其中空字符串就是假值。

```javascript
if (audio.canPlayType('audio/mpeg')) {
  // 执行某些操作
}
```

### 20.5.5 音频类型

`<audio>`元素还有一个名为 `Audio` 的原生 JavaScript 构造函数，支持在任何时候播放音频。`Audio` 类型与 `Image` 类似，都是 `DOM` 元素的对等体，只是不需插入文档即可工作。要通过 `Audio` 播放音频，只需创建一个新实例并传入音频源文件：

```javascript
let audio = new Audio('sound.mp3')
EventUtil.addHandler(audio, 'canplaythrough', function (event) {
  audio.play()
})
```

创建 `Audio` 的新实例就会开始下载指定的文件。下载完毕后，可以调用 `play()`来播放音频。

在 iOS 中调用 `play()`方法会弹出一个对话框，请求用户授权播放声音。为了连续播放，必须在 `onfinish` 事件处理程序中立即调用 `play()`。

## 20.6 原生拖放

### 20.6.1 拖放事件

在某个元素被拖动时，会（按顺序）触发以下事件：

（1）dragstart<br />
（2）drag<br />
（3）dragend

在按住鼠标键不放并开始移动鼠标的那一刻，被拖动元素上会触发 `dragstart` 事件。此时光标会变成非放置符号（圆环中间一条斜杠）​，表示元素不能放到自身上。拖动开始时，可以在 `ondragstart` 事件处理程序中通过 JavaScript 执行某些操作。

`dragstart` 事件触发后，只要目标还被拖动就会持续触发 drag 事件。这个事件类似于 `mousemove`，即随着鼠标移动而不断触发。当拖动停止时（把元素放到有效或无效的放置目标上）​，会触发 `dragend` 事件。

所有这 3 个事件的目标都是被拖动的元素。默认情况下，浏览器在拖动开始后不会改变被拖动元素的外观，因此是否改变外观由你来决定。不过，大多数浏览器此时会创建元素的一个半透明副本，始终跟随在光标下方。

在把元素拖动到一个有效的放置目标上时，会依次触发以下事件：

（1）dragenter<br />
（2）dragover<br />
（3）dragleave 或 drop

只要一把元素拖动到放置目标上，`dragenter` 事件（类似于 `mouseover` 事件）就会触发。`dragenter` 事件触发之后，会立即触发 `dragover` 事件，并且元素在放置目标范围内被拖动期间此事件会持续触发。当元素被拖动到放置目标之外，`dragover` 事件停止触发，`dragleave` 事件触发（类似于 `mouseout` 事件）​。如果被拖动元素被放到了目标上，则会触发 `drop` 事件而不是 `dragleave` 事件。这些事件的目标是放置目标元素。

### 20.6.2 自定义放置目标

在把某个元素拖动到无效放置目标上时，会看到一个特殊光标（圆环中间一条斜杠）表示不能放下。即使所有元素都支持放置目标事件，这些元素默认也是不允许放置的。如果把元素拖动到不允许放置的目标上，无论用户动作是什么都不会触发 `drop` 事件。不过，通过覆盖 `dragenter` 和 `dragover` 事件的默认行为，可以把任何元素转换为有效的放置目标。

```javascript
let droptarget = document.getElementById('droptarget')
droptarget.addEventListener('dragover', (event) => {
  event.preventDefault()
})
droptarget.addEventListener('dragenter', (event) => {
  event.preventDefault()
})
```

### 20.6.3 dataTransfer 对象

`dataTransfer` 对象有两个主要方法：`getData()`和 `setData()`。顾名思义，`getData()`用于获取 `setData()`存储的值。`setData()`的第一个参数以及 `getData()`的唯一参数是一个字符串，表示要设置的数据类型："`text`"或"`URL`"

```javascript
// 传递文本
event.dataTransfer.setData('text', 'some text')
let text = event.dataTransfer.getData('text')
// 传递URL
event.dataTransfer.setData('URL', 'http://www.wrox.com/')
let url = event.dataTransfer.getData('URL')
```

`dataTransfer` 对象实际上可以包含每种 MIME 类型的一个值，也就是说可以同时保存文本和 URL，两者不会相互覆盖。存储在 `dataTransfer` 对象中的数据只能在放置事件中读取。如果没有在 `ondrop` 事件处理程序中取得这些数据，`dataTransfer` 对象就会被销毁，数据也会丢失。

在从文本框拖动文本时，浏览器会调用 `setData()`并将拖动的文本以"`text`"格式存储起来。类似地，在拖动链接或图片时，浏览器会调用 `setData()`并把 `URL` 存储起来。当数据被放置在目标上时，可以使用 `getData()`获取这些数据。当然，可以在 `dragstart` 事件中手动调用 `setData()`存储自定义数据，以便将来使用。

作为文本的数据和作为 URL 的数据有一个区别。当把数据作为文本存储时，数据不会被特殊对待。而当把数据作为 URL 存储时，数据会被作为网页中的一个链接，意味着如果把它放到另一个浏览器窗口，浏览器会导航到该 URL。

### 20.6.4 dropEffect 与 effectAllowed

`dataTransfer` 对象不仅可以用于实现简单的数据传输，还可以用于确定能够对被拖动元素和放置目标执行什么操作。为此，可以使用两个属性：`dropEffect` 与 `effectAllowed`。

`dropEffect` 属性可以告诉浏览器允许哪种放置行为。这个属性有以下 4 种可能的值。

❑ "none"：被拖动元素不能放到这里。这是除文本框之外所有元素的默认值。<br />
❑ "move"：被拖动元素应该移动到放置目标。<br />
❑ "copy"：被拖动元素应该复制到放置目标。<br />
❑ "link"：表示放置目标会导航到被拖动元素（仅在它是 URL 的情况下）​。

为了使用 `dropEffect` 属性，必须在放置目标的 `ondragenter` 事件处理程序中设置它。

除非同时设置 `effectAllowed`，否则 `dropEffect` 属性也没有用。`effectAllowed` 属性表示对被拖动元素是否允许 `dropEffect`。这个属性有如下几个可能的值。

❑ "uninitialized"：没有给被拖动元素设置动作。<br />
❑ "none"：被拖动元素上没有允许的操作。<br />
❑ "copy"：只允许"copy"这种 dropEffect。<br />
❑ "link"：只允许"link"这种 dropEffect。<br />
❑ "move"：只允许"move"这种 dropEffect。<br />
❑ "copyLink"：允许"copy"和"link"两种 dropEffect。<br />
❑ "copyMove"：允许"copy"和"move"两种 dropEffect。<br />
❑ "linkMove"：允许"link"和"move"两种 dropEffect。<br />
❑ "all"：允许所有 dropEffect。

必须在 `ondragstart` 事件处理程序中设置这个属性。

### 20.6.5 可拖动能力

HTML5 在所有 HTML 元素上规定了一个 `draggable` 属性，表示元素是否可以拖动。图片和链接的 `draggable` 属性自动被设置为 `true`，而其他所有元素此属性的默认值为 `false`。如果想让其他元素可拖动，或者不允许图片和链接被拖动，都可以设置这个属性。

```html
<!-- 禁止拖动图片 -->
<img src="smile.gif" draggable="false" alt="Smiley face" />
<!-- 让元素可以拖动 -->
<div draggable="true">...</div>
```

### 20.6.6 其他成员

❑ addElement（element）​：为拖动操作添加元素。这纯粹是为了传输数据，不会影响拖动操作的外观。在本书写作时，还没有浏览器实现这个方法。<br />
❑ clearData（format）​：清除以特定格式存储的数据。<br />
❑ setDragImage（element, x, y）​：允许指定拖动发生时显示在光标下面的图片。这个方法接收 3 个参数：要显示的 HTML 元素及标识光标位置的图片上的 x 和 y 坐标。这里的 HTML 元素可以是一张图片，此时显示图片；也可以是其他任何元素，此时显示渲染后的元素。<br />
❑ types：当前存储的数据类型列表。这个集合类似数组，以字符串形式保存数据类型，比如"text"。

## 20.7 Notifications API

系统通知

### 20.7.1 通知权限

Notifications API 有被滥用的可能，因此默认会开启两项安全措施：

❑ 通知只能在运行在安全上下文的代码中被触发；<br />
❑ 通知必须按照每个源的原则明确得到用户允许。

用户授权显示通知是通过浏览器内部的一个对话框完成的。除非用户没有明确给出允许或拒绝的答复，否则这个权限请求对每个域只会出现一次。浏览器会记住用户的选择，如果被拒绝则无法重来。

页面可以使用全局对象 `Notification` 向用户请求通知权限。这个对象有一个 `requestPemission()`方法，该方法返回一个期约，用户在授权对话框上执行操作后这个期约会解决。

```javascript
Notification.requestPermission().then((permission) => {
  console.log('User responded to permission request:', permission)
})
```

"`granted`"值意味着用户明确授权了显示通知的权限。除此之外的其他值意味着显示通知会静默失败。如果用户拒绝授权，这个值就是"`denied`"。一旦拒绝，就无法通过编程方式挽回，因为不可能再触发授权提示。

### 20.7.2 显示和隐藏通知

`Notification` 构造函数用于创建和显示通知。最简单的通知形式是只显示一个标题，这个标题内容可以作为第一个参数传给 Notification 构造函数。以下面这种方式调用 Notification，应该会立即显示通知：

```javascript
new Notification('Title text! ')
```

可以通过 `options` 参数对通知进行自定义，包括设置通知的主体、图片和振动等。调用这个构造函数返回的 `Notification` 对象的 `close()`方法可以关闭显示的通知。

```javascript
new Notification('Title text! ', {
  body: 'Bodytext!',
  image: 'path/to/image.png',
  vibrate: true
})

const n = new Notification('I will close in 1000ms')
setTimeout(() => n.close(), 1000)
```

### 20.7.3 通知生命周期回调

❑ onshow 在通知显示时触发；<br />
❑ onclick 在通知被点击时触发；<br />
❑ onclose 在通知消失或通过 close()关闭时触发；<br />
❑ onerror 在发生错误阻止通知显示时触发。

```javascript
const n = new Notification('foo')
n.onshow = () => console.log('Notification was shown!')
n.onclick = () => console.log('Notification was clicked!')
n.onclose = () => console.log('Notification was closed!')
n.onerror = () => console.log('Notification experienced an error!')
```

## 20.8 Page Visibility API

Page Visibility API 旨在为开发者提供页面对用户是否可见的信息。

❑ document.visibilityState 值，表示下面 4 种状态之一。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 页面在后台标签页或浏览器中最小化了。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 页面在前台标签页中。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 实际页面隐藏了，但对页面的预览是可见的（例如在 Windows 7 上，用户鼠标移到任务栏图标上会显示网页预览）​。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 页面在屏外预渲染。<br />
❑ visibilitychange 事件，该事件会在文档从隐藏变可见（或反之）时触发。<br />
❑ document.hidden 布尔值，表示页面是否隐藏。这可能意味着页面在后台标签页或浏览器中被最小化了。这个值是为了向后兼容才继续被浏览器支持的，应该优先使用 document.visibilityState 检测页面可见性。

要想在页面从可见变为隐藏或从隐藏变为可见时得到通知，需要监听 `visibilitychange` 事件。

`document.visibilityState` 的值是以下三个字符串之一：

❑ "hidden"<br />
❑ "visible"<br />
❑ "prerender"

## 20.9 Streams API

❑ 大块数据可能不会一次性都可用。网络请求的响应就是一个典型的例子。网络负载是以连续信息包形式交付的，而流式处理可以让应用在数据一到达就能使用，而不必等到所有数据都加载完毕。<br />
❑ 大块数据可能需要分小部分处理。视频处理、数据压缩、图像编码和 JSON 解析都是可以分成小部分进行处理，而不必等到所有数据都在内存中时再处理的例子。

### 20.9.1 理解流

Stream API 直接解决的问题是处理网络请求和读写磁盘。

Stream API 定义了三种流。

❑ 可读流：可以通过某个公共接口读取数据块的流。数据在内部从底层源进入流，然后由消费者（consumer）进行处理。<br />
❑ 可写流：可以通过某个公共接口写入数据块的流。生产者（producer）将数据写入流，数据在内部传入底层数据槽（sink）​。<br />
❑ 转换流：由两种流组成，可写流用于接收数据（可写端）​，可读流用于输出数据（可读端）​。这两个流之间是转换程序（transformer）​，可以根据需要检查和修改流内容。

#### 块、内部队列和反压

流的基本单位是块（chunk）​。块可是任意数据类型，但通常是定型数组。每个块都是离散的流片段，可以作为一个整体来处理。更重要的是，块不是固定大小的，也不一定按固定间隔到达。在理想的流当中，块的大小通常近似相同，到达间隔也近似相等。不过好的流实现需要考虑边界情况。

前面提到的各种类型的流都有入口和出口的概念。有时候，由于数据进出速率不同，可能会出现不匹配的情况。为此流平衡可能出现如下三种情形。

❑ 流出口处理数据的速度比入口提供数据的速度快。流出口经常空闲（可能意味着流入口效率较低）​，但只会浪费一点内存或计算资源，因此这种流的不平衡是可以接受的。<br />
❑ 流入和流出均衡。这是理想状态。<br />
❑ 流入口提供数据的速度比出口处理数据的速度快。这种流不平衡是固有的问题。此时一定会在某个地方出现数据积压，流必须相应做出处理。

流不平衡是常见问题，但流也提供了解决这个问题的工具。所有流都会为已进入流但尚未离开流的块提供一个内部队列。对于均衡流，这个内部队列中会有零个或少量排队的块，因为流出口块出列的速度与流入口块入列的速度近似相等。这种流的内部队列所占用的内存相对比较小。

如果块入列速度快于出列速度，则内部队列会不断增大。流不能允许其内部队列无限增大，因此它会使用反压（backpressure）通知流入口停止发送数据，直到队列大小降到某个既定的阈值之下。这个阈值由排列策略决定，这个策略定义了内部队列可以占用的最大内存，即高水位线（high water mark）​。

### 20.9.2 可读流

可读流是对底层数据源的封装。底层数据源可以将数据填充到流中，允许消费者通过流的公共接口读取数据。

#### 1．ReadableStreamDefaultController

#### 2．ReadableStreamDefaultReader

调用 `getReader()`方法会获得流的锁，保证只有这个读取器可以从流中读取值

```javascript
async function* ints() {
  // 每1000 毫秒生成一个递增的整数
  for (let i = 0; i < 5; ++i) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i))
  }
}
const readableStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
console.log(readableStream.locked) // false
const readableStreamDefaultReader = readableStream.getReader()
console.log(readableStream.locked) // true
//消费者
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
//0
//1
//2
//3
//4
```

### 20.9.3 可写流

可写流是底层数据槽的封装。底层数据槽处理通过流的公共接口写入的数据。

#### 1．创建 WritableStream

#### 2．WritableStreamDefaultWriter

`writableStreamDefaultWriter.ready` 返回一个期约，此期约会在能够向流中写入数据时解决。

```javascript
async function* ints() {
  // 每1000 毫秒生成一个递增的整数
  for (let i = 0; i < 5; ++i) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i))
  }
}
const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  }
})
console.log(writableStream.locked) // false
const writableStreamDefaultWriter = writableStream.getWriter()
console.log(writableStream.locked) // true
//生产者
;(async function () {
  for await (let chunk of ints()) {
    await writableStreamDefaultWriter.ready
    writableStreamDefaultWriter.write(chunk)
  }
  writableStreamDefaultWriter.close()
})()
```

### 20.9.4 转换流

转换流用于组合可读流和可写流。数据块在两个流之间的转换是通过 `transform()`方法完成的。

```javascript
async function* ints() {
  // 每1000 毫秒生成一个递增的整数
  for (let i = 0; i < 5; ++i) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i))
  }
}
const { writable, readable } = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  }
})
const readableStreamDefaultReader = readable.getReader()
const writableStreamDefaultWriter = writable.getWriter()
//消费者
;(async function () {
  while (true) {
    const { done, value } = await readableStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
//生产者
;(async function () {
  for await (let chunk of ints()) {
    await writableStreamDefaultWriter.ready
    writableStreamDefaultWriter.write(chunk)
  }
  writableStreamDefaultWriter.close()
})()
```

### 20.9.5 通过管道连接流

流可以通过管道连接成一串。最常见的用例是使用 `pipeThrough()`方法把 `ReadableStream` 接入 `TransformStream`。从内部看，`ReadableStream` 先把自己的值传给 `TransformStream` 内部的 `WritableStream`，然后执行转换，接着转换后的值又在新的 `ReadableStream` 上出现。

```javascript
async function* ints() {
  // 每1000 毫秒生成一个递增的整数
  for (let i = 0; i < 5; ++i) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i))
  }
}
const integerStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const doublingStream = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * 2)
  }
})
// 通过管道连接流
const pipedStream = integerStream.pipeThrough(doublingStream)
// 从连接流的输出获得读取器
const pipedStreamDefaultReader = pipedStream.getReader()
// 消费者
;(async function () {
  while (true) {
    const { done, value } = await pipedStreamDefaultReader.read()
    if (done) {
      break
    } else {
      console.log(value)
    }
  }
})()
//0
//2
//4
//6
//8
```

另外，使用 `pipeTo()`方法也可以将 `ReadableStream` 连接到 `WritableStream`。整个过程与使用 `pipeThrough()`类似：

```javascript
async function* ints() {
  // 每1000 毫秒生成一个递增的整数
  for (let i = 0; i < 5; ++i) {
    yield await new Promise((resolve) => setTimeout(resolve, 1000, i))
  }
}
const integerStream = new ReadableStream({
  async start(controller) {
    for await (let chunk of ints()) {
      controller.enqueue(chunk)
    }
    controller.close()
  }
})
const writableStream = new WritableStream({
  write(value) {
    console.log(value)
  }
})
const pipedStream = integerStream.pipeTo(writableStream)
// 0
// 1
// 2
// 3
// 4
```

## 20.10 计时 API

页面性能始终是 Web 开发者关心的话题。`Performance` 接口通过 JavaScript API 暴露了浏览器内部的度量指标，允许开发者直接访问这些信息并基于这些信息实现自己想要的功能。这个接口暴露在 `window.performance` 对象上。所有与页面相关的指标，包括已经定义和将来会定义的，都会存在于这个对象上。

Performance 接口由多个 API 构成：

❑ High Resolution Time API<br />
❑ Performance Timeline API<br />
❑ Navigation Timing API<br />
❑ User Timing API<br />
❑ Resource Timing API<br />
❑ Paint Timing API

### 20.10.1 High Resolution Time API

`Date.now()`方法只适用于日期时间相关操作，而且是不要求计时精度的操作。

```javascript
const t0 = Date.now()
foo()
const t1 = Date.now()
const duration = t1 - t0
console.log(duration)
```

考虑如下 duration 会包含意外值的情况。

❑ duration 是 0。Date.now()只有毫秒级精度，如果 foo()执行足够快，则两个时间戳的值会相等。<br />
❑ duration 是负值或极大值。如果在 foo()执行时，系统时钟被向后或向前调整了（如切换到夏令时）​，则捕获的时间戳不会考虑这种情况，因此时间差中会包含这些调整。

为此，必须使用不同的计时 API 来精确且准确地度量时间的流逝。High Resolution Time API 定义了 `window.performance.now()`，这个方法返回一个微秒精度的浮点值。因此，使用这个方法先后捕获的时间戳更不可能出现相等的情况。而且这个方法可以保证时间戳单调增长。

```javascript
const t0 = performance.now()
const t1 = performance.now()
console.log(t0) // 1768.625000026077
console.log(t1) // 1768.6300000059418
const duration = t1 - t0
console.log(duration) // 0.004999979864805937
```

`performance.now()`计时器采用相对度量。这个计时器在执行上下文创建时从 0 开始计时。`performance.timeOrigin` 属性返回计时器初始化时全局系统时钟的值。

### 20.10.2 Performance Timeline API
