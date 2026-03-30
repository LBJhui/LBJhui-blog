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

❑ "hidden"：此时页面对用户不可见。即文档处于背景标签页或者窗口处于最小化状态，或者操作系统正处于 '锁屏状态' .<br />
❑ "visible"：此时页面内容至少是部分可见。即此页面在前景标签页中，并且窗口没有最小化。<br />
❑ "prerender"：页面此时正在渲染中，因此是不可见的 (considered hidden for purposes of document.hidden). 文档只能从此状态开始，永远不能从其他值变为此状态。注意：浏览器支持是可选的。

```javascript
document.addEventListener('visibilitychange', function () {
  console.log(document.visibilityState)
  // Modify behavior...
})
```

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

Performance Timeline API 使用一套用于度量客户端延迟的工具扩展了 Performance 接口。性能度量将会采用计算结束与开始时间差的形式。这些开始和结束时间会被记录为 `DOMHighResTimeStamp` 值，而封装这个时间戳的对象是 `PerformanceEntry` 的实例。

浏览器会自动记录各种 `PerformanceEntry` 对象，而使用 `performance.mark()`也可以记录自定义的 `PerformanceEntry` 对象。在一个执行上下文中被记录的所有性能条目可以通过 `performance. getEntries()`获取

```javascript
console.log(performance.getEntries())
// [PerformanceNavigationTiming, PerformanceResourceTiming, ... ]
```

这个返回的集合代表浏览器的性能时间线（performance timeline）​。每个 `PerformanceEntry` 对象都有 `name`、`entryType`、`startTime` 和 `duration` 属性：

```javascript
const entry = performance.getEntries()[0]
console.log(entry.name) // "https://foo.com"
console.log(entry.entryType) // navigation
console.log(entry.startTime) // 0
console.log(entry.duration) // 182.36500001512468
```

不过，`PerformanceEntry` 实际上是一个抽象基类。所有记录条目虽然都继承 `PerformanceEntry`，但最终还是如下某个具体类的实例：

❑ PerformanceMark<br />
❑ PerformanceMeasure<br />
❑ PerformanceFrameTiming<br />
❑ PerformanceNavigationTiming<br />
❑ PerformanceResourceTiming<br />
❑ PerformancePaintTiming

#### 1．User Timing API

User Timing API 用于记录和分析自定义性能条目。

```javascript
performance.mark('foo')
console.log(performance.getEntriesByType('mark')[0])
// PerformanceMark {
//   detail: null,
//   name: 'foo',
//   entryType: 'mark',
//   startTime: 217929.9435,
//   duration: 0
// }

performance.mark('foo')
for (let i = 0; i < 1e6; ++i) {}
performance.mark('bar')
const [endMark, startMark] = performance.getEntriesByType('mark')
console.log(startMark.startTime - endMark.startTime) // 1.3299999991431832
```

除了自定义性能条目，还可以生成 `PerformanceMeasure`（性能度量）条目，对应由名字作为标识的两个标记之间的持续时间。`PerformanceMeasure` 的实例由 `performance.measure()`方法生成：

```javascript
performance.mark('foo')
for (let i = 0; i < 1e6; ++i) {}
performance.mark('bar')
performance.measure('baz', 'foo', 'bar')
const [differenceMark] = performance.getEntriesByType('measure')
console.log(differenceMark)
// PerformanceMeasure {
//   detail: null,
//   name: 'baz',
//   entryType: 'measure',
//   startTime: 365339.8475,
//   duration: 22.379400000034366
// }
```

#### 2．Navigation Timing API

Navigation Timing API 提供了高精度时间戳，用于度量当前页面加载速度。浏览器会在导航事件发生时自动记录 `PerformanceNavigationTiming` 条目。这个对象会捕获大量时间戳，用于描述页面是何时以及如何加载的。

```javascript
const [performanceNavigationTimingEntry] = performance.getEntriesByType('navigation')
console.log(performanceNavigationTimingEntry)
// PerformanceNavigationTiming {
//    connectEnd: 2.259999979287386
//    connectStart: 2.259999979287386
//    decodedBodySize: 122314
//    domComplete: 631.9899999652989
//    domContentLoadedEventEnd: 300.92499998863786
//    domContentLoadedEventStart: 298.8950000144541
//    domInteractive: 298.88499999651685
//    domainLookupEnd: 2.259999979287386
//    domainLookupStart: 2.259999979287386
//    duration: 632.819999998901
//    encodedBodySize: 21107
//    entryType: "navigation"
//    fetchStart: 2.259999979287386
//    initiatorType: "navigation"
//    loadEventEnd: 632.819999998901
//    loadEventStart: 632.0149999810383
//    name: " https://foo.com "
//    nextHopProtocol: "h2"
//    redirectCount: 0
//    redirectEnd: 0
//    redirectStart: 0
//    requestStart: 7.7099999762140214
//    responseEnd: 130.50999998813495
//    responseStart: 127.16999999247491
//    secureConnectionStart: 0
//    serverTiming: []
//    startTime: 0
//    transferSize: 21806
//    type: "navigate"
//    unloadEventEnd: 132.73999997181818
//    unloadEventStart: 132.41999997990206
//    workerStart: 0
// }
console.log(performanceNavigationTimingEntry.loadEventEnd - performanceNavigationTimingEntry.loadEventStart)
// 0.805000017862767
```

#### 3．Resource Timing API

Resource Timing API 提供了高精度时间戳，用于度量当前页面加载时请求资源的速度。浏览器会在加载资源时自动记录 `PerformanceResourceTiming`。这个对象会捕获大量时间戳，用于描述资源加载的速度。

```javascript
const performanceResourceTimingEntry = performance.getEntriesByType('resource')[0]
console.log(performanceResourceTimingEntry)
// PerformanceResourceTiming {
//    connectEnd: 138.11499997973442
//    connectStart: 138.11499997973442
//    decodedBodySize: 33808
//    domainLookupEnd: 138.11499997973442
//    domainLookupStart: 138.11499997973442
//    duration: 0
//    encodedBodySize: 33808
//    entryType: "resource"
//    fetchStart: 138.11499997973442
//    initiatorType: "link"
//    name: "https://static.foo.com/bar.png",
//    nextHopProtocol: "h2"
//    redirectEnd: 0
//    redirectStart: 0
//    requestStart: 138.11499997973442
//    responseEnd: 138.11499997973442
//    responseStart: 138.11499997973442
//    secureConnectionStart: 0
//    serverTiming: []
//    startTime: 138.11499997973442
//    transferSize: 0
//    workerStart: 0
// }
console.log(performanceResourceTimingEntry.responseEnd - performanceResourceTimingEntry.requestStart)
// 493.9600000507198
```

## 20.11 Web 组件

### 20.11.1 HTML 模板

在 Web 组件之前，一直缺少基于 HTML 解析构建 DOM 子树，然后在需要时再把这个子树渲染出来的机制。一种间接方案是使用 `innerHTML` 把标记字符串转换为 DOM 元素，但这种方式存在严重的安全隐患。另一种间接方案是使用 `document.createElement()`构建每个元素，然后逐个把它们添加到孤儿根节点（不是添加到 DOM）​，但这样做特别麻烦，完全与标记无关。

相反，更好的方式是提前在页面中写出特殊标记，让浏览器自动将其解析为 DOM 子树，但跳过渲染。这正是 HTML 模板的核心思想，而`<template>`标签正是为这个目的而生的。

```html
<template id="foo">
  <p>I'm inside a template!</p>
</template>
```

#### 1．使用 DocumentFragment

在浏览器中渲染时，上面例子中的文本不会被渲染到页面上。因为`<template>`的内容不属于活动文档，所以 `document.querySelector()`等 DOM 查询方法不会发现其中的`<p>`标签。这是因为`<p>`存在于一个包含在 HTML 模板中的 DocumentFragment 节点内。

通过`<template>`元素的 content 属性可以取得这个 DocumentFragment 的引用。此时的 `DocumentFragment` 就像一个对应子树的最小化 `document` 对象。

```html
<template id="foo">
  #document-fragment
  <p>I'm inside a template!</p>
</template>

<script>
  console.log(document.querySelector('#foo').content) //#document-fragment
  const fragment = document.querySelector('#foo').content
  console.log(document.querySelector('p')) // null
  console.log(fragment.querySelector('p')) // <p>I'm inside a template!</p>
</script>
```

`DocumentFragment` 也是批量向 HTML 中添加元素的高效工具。

```javascript
// 开始状态：
// <div id="foo"></div>
//
// 期待的最终状态：
// <div id="foo">
//    <p></p>
//    <p></p>
//    <p></p>
// </div>
// 也可以使用document.createDocumentFragment()
const fragment = new DocumentFragment()
const foo = document.querySelector('#foo')
// 为DocumentFragment添加子元素不会导致布局重排
fragment.appendChild(document.createElement('p'))
fragment.appendChild(document.createElement('p'))
fragment.appendChild(document.createElement('p'))
console.log(fragment.children.length) // 3
foo.appendChild(fragment)
console.log(fragment.children.length) //0
console.log(document.body.innerHTML)
// <div id="foo">
//    <p></p>
//    <p></p>
//    <p></p>
// </div>
```

#### 2．使用`<template>`标签

```javascript
const fooElement = document.querySelector('#foo')
const barTemplate = document.querySelector('#bar')
const barFragment = barTemplate.content
console.log(document.body.innerHTML)
// <div id="foo">
// </div>
// <template id="bar">
//    <p></p>
//    <p></p>
//    <p></p>
// </template>
fooElement.appendChild(document.importNode(barFragment, true))
console.log(document.body.innerHTML)
// <div id="foo">
//   <p></p>
//   <p></p>
//   <p></p>
// </div>
// <template id="bar">
//   <p></p>
//   <p></p>
//   <p></p>
// </template>
```

`importNode()`方法克隆 `DocumentFragment`，复制模板。

#### 3．模板脚本

脚本执行可以推迟到将 `DocumentFragment` 的内容实际添加到 `DOM` 树。

```javascript
// 页面HTML：
//
// <div id="foo"></div>
// <template id="bar">
//    <script>console.log('Templatescriptexecuted');</script>
// </template>
const fooElement = document.querySelector('#foo')
const barTemplate = document.querySelector('#bar')
const barFragment = barTemplate.content
console.log('About to add template')
fooElement.appendChild(barFragment)
console.log('Added template')
// About to add template
// Templatescriptexecuted
// Added template
```

如果新添加的元素需要进行某些初始化，这种延迟执行是有用的。

### 20.11.2 影子 DOM

概念上讲，影子 DOM（shadow DOM）Web 组件相当直观，通过它可以将一个完整的 DOM 树作为节点添加到父 DOM 树。这样可以实现 DOM 封装，意味着 CSS 样式和 CSS 选择符可以限制在影子 DOM 子树而不是整个顶级 DOM 树中。

#### 1．理解影子 DOM

```html
<div class="red-text">
  <p>Make me red!</p>
</div>
<div class="green-text">
  <p>Make me green!</p>
</div>
<div class="blue-text">
  <p>Make me blue!</p>
</div>
<style>
  .red-text {
    color: red;
  }
  .green-text {
    color: green;
  }
  .blue-text {
    color: blue;
  }
</style>
```

#### 2．创建影子 DOM

考虑到安全及避免影子 DOM 冲突，并非所有元素都可以包含影子 DOM。尝试给无效元素或者已经有了影子 DOM 的元素添加影子 DOM 会导致抛出错误。

以下是可以容纳影子 DOM 的元素。

❑ 任何以有效名称创建的自定义元素（参见 HTML 规范中相关的定义）<br />
❑ `<article>`<br />
❑ `<aside>`<br />
❑ `<blockquote>`<br />
❑ `<body>`<br />
❑ `<div>`<br />
❑ `<footer>`<br />
❑ `<h1>`<br />
❑ `<h2>`<br />
❑ `<h3>`<br />
❑ `<h4>`<br />
❑ `<h5>`<br />
❑ `<h6>`<br />
❑ `<header>`<br />
❑ `<main>`<br />
❑ `<nav>`<br />
❑ `<p>`<br />
❑ `<section>`<br />
❑ `<span>`

影子 DOM 是通过 `attachShadow()`方法创建并添加给有效 HTML 元素的。容纳影子 DOM 的元素被称为影子宿主（shadow host）​。影子 DOM 的根节点被称为影子根（shadow root）​。

`attachShadow()`方法需要一个 `shadowRootInit` 对象，返回影子 DOM 的实例。`shadowRootInit` 对象必须包含一个 `mode` 属性，值为"`open`"或"`closed`"。对"`open`"影子 DOM 的引用可以通过 `shadowRoot` 属性在 HTML 元素上获得，而对"`closed`"影子 DOM 的引用无法这样获取。

```javascript
document.body.innerHTML = `
      <div id="foo"></div>
      <div id="bar"></div>
    `
const foo = document.querySelector('#foo')
const bar = document.querySelector('#bar')
const openShadowDOM = foo.attachShadow({ mode: 'open' })
const closedShadowDOM = bar.attachShadow({ mode: 'closed' })
console.log(openShadowDOM) // #shadow-root(open)
console.log(closedShadowDOM) // #shadow-root(closed)
console.log(foo.shadowRoot) //#shadow-root(open)
console.log(bar.shadowRoot) //null
```

#### 3．使用影子 DOM

```javascript
for (let color of ['red', 'green', 'blue']) {
  const div = document.createElement('div')
  const shadowDOM = div.attachShadow({ mode: 'open' })
  document.body.appendChild(div)
  shadowDOM.innerHTML = `
        <p>Make me ${color}</p>
        <style>
        p {
          color: ${color};
        }
        </style>
      `
}
function countP(node) {
  console.log(node.querySelectorAll('p').length)
}
countP(document) // 0
for (let element of document.querySelectorAll('div')) {
  countP(element.shadowRoot)
}
// 1
// 1
// 1
```

影子 DOM 并非铁板一块。HTML 元素可以在 DOM 树间无限制移动：

```javascript
document.body.innerHTML = `
    <div></div>
    <p id="foo">Move me</p>
    `
const divElement = document.querySelector('div')
const pElement = document.querySelector('p')
const shadowDOM = divElement.attachShadow({ mode: 'open' })
// 从父DOM中移除元素
divElement.parentElement.removeChild(pElement)
// 把元素添加到影子DOM
shadowDOM.appendChild(pElement)
// 检查元素是否移动到了影子DOM中
console.log(shadowDOM.innerHTML) //<pid="foo">Moveme</p>
```

#### 4．合成与影子 DOM 槽位

```javascript
document.body.innerHTML = `
    <div id="foo">
      <p>Foo</p>
    </div>
    `
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `<div id="bar">
                        <slot></slot>
                      <div>`
```

```javascript
for (let color of ['red', 'green', 'blue']) {
  const divElement = document.createElement('div')
  divElement.innerText = `Make me ${color}`
  document.body.appendChild(divElement)
  divElement.attachShadow({ mode: 'open' }).innerHTML = `
          <p><slot></slot></p>
          <style>
            p {
              color: ${color};
            }
          </style>
          `
}
```

除了默认槽位，还可以使用命名槽位（named slot）实现多个投射。这是通过匹配的 slot/name 属性对实现的。

```javascript
document.body.innerHTML = `
    <div>
      <p slot="foo">Foo</p>
      <p slot="bar">Bar</p>
    </div>
    `
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
        <slot name="bar"></slot>
        <slot name="foo"></slot>
        `
// Renders:
// Bar
// Foo
```

#### 5．事件重定向

如果影子 DOM 中发生了浏览器事件（如 click）​，那么浏览器需要一种方式以让父 DOM 处理事件。不过，实现也必须考虑影子 DOM 的边界。为此，事件会逃出影子 DOM 并经过事件重定向（event retarget）在外部被处理。逃出后，事件就好像是由影子宿主本身而非真正的包装元素触发的一样。

```javascript
// 创建一个元素作为影子宿主
document.body.innerHTML = `
    <div onclick="console.log('Handled outside:', event.target)"></div>
    `
// 添加影子DOM并向其中插入HTML
document.querySelector('div').attachShadow({ mode: 'open' }).innerHTML = `
    <button onclick="console.log('Handled inside:', event.target)">Foo</button>
    `
// 点击按钮时：
// Handledinside:   <button onclick="..."></button>
// Handledoutside: <div onclick="..."></div>
```

:::tip 注意
事件重定向只会发生在影子 DOM 中实际存在的元素上。使用`<slot>`标签从外部投射进来的元素不会发生事件重定向，因为从技术上讲，这些元素仍然存在于影子 DOM 外部。
:::

### 20.11.3 自定义元素

#### 1．创建自定义元素

```javascript
document.body.innerHTML = `
      <x-foo>I'm inside an onsense element.</x-foo>
      `
console.log(document.querySelector('x-foo') instanceof HTMLElement) // true
```

自定义元素要使用全局属性 `customElements`，这个属性会返回 `CustomElementRegistry` 对象。调用 `customElements.define()`方法可以创建自定义元素。

```javascript
console.log(customElements) // CustomElementRegistry {}
class FooElement extends HTMLElement {}
customElements.define('x-foo', FooElement)
document.body.innerHTML = `
      <x-foo >I'm inside a nonsense element.</x-foo >
      `
console.log(document.querySelector('x-foo') instanceof FooElement) // true
```

:::tip 注意
自定义元素名必须至少包含一个不在名称开头和末尾的连字符，而且元素标签不能自关闭。
:::

如果自定义元素继承了一个元素类，那么可以使用 `is` 属性和 `extends` 选项将标签指定为该自定义元素的实例：

```javascript
class FooElement extends HTMLDivElement {
  constructor() {
    super()
    console.log('x-foo')
  }
}
customElements.define('x-foo', FooElement, { extends: 'div' })
document.body.innerHTML = `
        <div is="x-foo"></div>
        <div is="x-foo"></div>
        <div is="x-foo"></div>
        `
// x-foo
// x-foo
// x-foo
```

#### 2．添加 Web 组件内容

因为每次将自定义元素添加到 DOM 中都会调用其类构造函数，所以很容易自动给自定义元素添加子 DOM 内容。虽然不能在构造函数中添加子 DOM（会抛出 DOMException）​，但可以为自定义元素添加影子 DOM 并将内容添加到这个影子 DOM 中：

```javascript
class FooElement extends HTMLElement {
  constructor() {
    super()
    // this引用Web组件节点
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
          <p>I'm inside a customelement!</p>
        `
  }
}
customElements.define('x-foo', FooElement)
document.body.innerHTML += `<x-foo></x-foo>`
```

为避免字符串模板和 `innerHTML` 不干净，可以使用 HTML 模板和 `document.createElement()`重构这个例子：

```html
<template id="x-foo-tpl">
  <p>I'm inside a custom element template!</p>
</template>
<script>
  const template = document.querySelector('#x-foo-tpl')
  class FooElement extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
  customElements.define('x-foo', FooElement)
  document.body.innerHTML += `<x-foo></x-foo>`
</script>
```

#### 3．使用自定义元素生命周期方法

❑ constructor()：在创建元素实例或将已有 DOM 元素升级为自定义元素时调用。<br />
❑ connectedCallback()：在每次将这个自定义元素实例添加到 DOM 中时调用。<br />
❑ disconnectedCallback()：在每次将这个自定义元素实例从 DOM 中移除时调用。<br />
❑ attributeChangedCallback()：在每次可观察属性的值发生变化时调用。在元素实例初始化时，初始值的定义也算一次变化。<br />
❑ adoptedCallback()：在通过 document.adoptNode()将这个自定义元素实例移动到新文档对象时调用。

```javascript
class FooElement extends HTMLElement {
  constructor() {
    super()
    console.log('ctor')
  }
  connectedCallback() {
    console.log('connected')
  }
  disconnectedCallback() {
    console.log('disconnected')
  }
}
customElements.define('x-foo', FooElement)
const fooElement = document.createElement('x-foo')
// ctor
document.body.appendChild(fooElement)
// connected
document.body.removeChild(fooElement)
// disconnected
```

#### 4．反射自定义元素属性

自定义元素既是 DOM 实体又是 JavaScript 对象，因此两者之间应该同步变化。换句话说，对 DOM 的修改应该反映到 JavaScript 对象，反之亦然。要从 JavaScript 对象反射到 DOM，常见的方式是使用获取函数和设置函数。

```javascript
document.body.innerHTML = `<x-foo></x-foo>`
class FooElement extends HTMLElement {
  constructor() {
    super()
    this.bar = true
  }
  get bar() {
    returnthis.getAttribute('bar')
  }
  set bar(value) {
    this.setAttribute('bar', value)
  }
}
customElements.define('x-foo', FooElement)
console.log(document.body.innerHTML)
// <x-foo bar="true"></x-foo>
```

另一个方向的反射（从 DOM 到 JavaScript 对象）需要给相应的属性添加监听器。为此，可以使用 `observedAttributes()`获取函数让自定义元素的属性值每次改变时都调用 `attributeChanged-Callback()`：

```javascript
class FooElement extends HTMLElement {
  static get observedAttributes() {
    //返回应该触发attributeChangedCallback()执行的属性
    return ['bar']
  }
  get bar() {
    return this.getAttribute('bar')
  }
  set bar(value) {
    this.setAttribute('bar', value)
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      console.log(`${oldValue}->${newValue}`)
      this[name] = newValue
    }
  }
}
customElements.define('x-foo', FooElement)
document.body.innerHTML = `<x-foo bar="false"></x-foo>`
// null->false
document.querySelector('x-foo').setAttribute('bar', true)
// false->true
```

#### 5．升级自定义元素

并非始终可以先定义自定义元素，然后再在 DOM 中使用相应的元素标签。为解决这个先后次序问题，Web 组件在 `CustomElementRegistry` 上额外暴露了一些方法。这些方法可以用来检测自定义元素是否定义完成，然后可以用它来升级已有元素。

如果自定义元素已经有定义，那么 `CustomElementRegistry.get()`方法会返回相应自定义元素的类。类似地，`CustomElementRegistry.whenDefined()`方法会返回一个期约，当相应自定义元素有定义之后解决：

```javascript
customElements.whenDefined('x-foo').then(() => console.log('defined!'))
console.log(customElements.get('x-foo')) // undefined
customElements.define('x-foo', class {}) // defined!
console.log(customElements.get('x-foo')) // classFooElement{}
```

连接到 DOM 的元素在自定义元素有定义时会自动升级。如果想在元素连接到 DOM 之前强制升级，可以使用 `CustomElementRegistry.upgrade()`方法：

```javascript
// 在自定义元素有定义之前会创建HTMLUnknownElement对象
const fooElement = document.createElement('x-foo')
// 创建自定义元素
class FooElement extends HTMLElement {}
customElements.define('x-foo', FooElement)
console.log(fooElement instanceof FooElement) // false
// 强制升级
customElements.upgrade(fooElement)
console.log(fooElement instanceof FooElement) // true
```

## 20.12 Web Cryptography API

### 20.12.1 生成随机数

在需要生成随机值时，很多人会使用 `Math.random()`。这个方法在浏览器中是以伪随机数生成器（PRNG, PseudoRandom Number Generator）方式实现的。所谓“伪”指的是生成值的过程不是真的随机。PRNG 生成的值只是模拟了随机的特性。浏览器的 PRNG 并未使用真正的随机源，只是对一个内部状态应用了固定的算法。每次调用 `Math.random()`由于算法本身是固定的，其输入只是之前的状态，因此随机数顺序也是确定的。由于算法本身是固定的，其输入只是之前的状态，因此随机数顺序也是确定的。

Web Cryptography API 引入了 CSPRNG，这个 CSPRNG 可以通过 `crypto.getRandomValues()`在全局 `Crypto` 对象上访问。与 `Math.random()`返回一个介于 0 和 1 之间的浮点数不同，`getRandomValues()`会把随机值写入作为参数传给它的定型数组。定型数组的类不重要，因为底层缓冲区会被随机的二进制位填充。

下面的例子展示了生成 5 个 8 位随机值：

```javascript
const array = new Uint8Array(1)
for (let i = 0; i < 5; ++i) {
  console.log(crypto.getRandomValues(array))
}
// Uint8Array [41]
// Uint8Array [250]
// Uint8Array [51]
// Uint8Array [129]
// Uint8Array [35]
```

`getRandomValues()`最多可以生成 2^16^（65536）字节，超出则会抛出错误：

```javascript
const fooArray = new Uint8Array(2 ** 16)
console.log(window.crypto.getRandomValues(fooArray)) // Uint32Array(16384) [...]
const barArray = new Uint8Array(2 ** 16 + 1)
console.log(window.crypto.getRandomValues(barArray)) // The requested length exceeds 65,536 bytes
```

要使用 CSPRNG 重新实现 `Math.random()`，可以通过生成一个随机的 32 位数值，然后用它去除最大的可能值 0xFFFFFFFF。这样就会得到一个介于 0 和 1 之间的值：

```javascript
function randomFloat() {
  // 生成32 位随机值
  const fooArray = new Uint32Array(1)
  // 最大值是2^32-1
  const maxUint32 = 0xffffffff
  // 用最大可能的值来除
  return crypto.getRandomValues(fooArray)[0] / maxUint32
}
console.log(randomFloat()) // 0.5033651619458955
```

### 20.12.2 使用 SubtleCrypto 对象

Web Cryptography API 重头特性都暴露在了 `SubtleCrypto` 对象上，可以通过 `window.crypto.subtle` 访问。

这个对象包含一组方法，用于执行常见的密码学功能，如加密、散列、签名和生成密钥。因为所有密码学操作都在原始二进制数据上执行，所以 `SubtleCrypto` 的每个方法都要用到 `ArrayBuffer` 和 `ArrayBufferView` 类型。由于字符串是密码学操作的重要应用场景，因此 `TextEncoder` 和 `TextDecoder` 是经常与 `SubtleCrypto` 一起使用的类，用于实现二进制数据与字符串之间的相互转换。

:::tip 注意
`SubtleCrypto` 对象只能在安全上下文（https）中使用。在不安全的上下文中，`subtle` 属性是 `undefined`。
:::

#### 1．生成密码学摘要

❑ SHA-1（Secure Hash Algorithm 1）​：架构类似 MD5 的散列函数。接收任意大小的输入，生成 160 位消息散列。由于容易受到碰撞攻击，这个算法已经不再安全。<br />
❑ SHA-2（Secure Hash Algorithm 2）​：构建于相同耐碰撞单向压缩函数之上的一套散列函数。规范支持其中 3 种：SHA-256、SHA-384 和 SHA-512。生成的消息摘要可以是 256 位（SHA-256）​、384 位（SHA-384） 512 位（SHA-512）​。这个算法被认为是安全的，广泛应用于很多领域和协议，包括 TLS、PGP 和加密货币（如比特币）​。

`SubtleCrypto.digest()`方法用于生成消息摘要。要使用的散列算法通过字符串"SHA-1"、"SHA-256"、"SHA-384"或"SHA-512"指定。

```javascript
;(async function () {
  const textEncoder = new TextEncoder()
  const message = textEncoder.encode('foo')
  const messageDigest = await crypto.subtle.digest('SHA-256', message)
  console.log(new Uint32Array(messageDigest))
})()
//Uint32Array(8)[1806968364, 2412183400, 1011194873, 876687389, 1882014227, 2696905572, 2287897337, 2934400610]
```

#### 2．CryptoKey 与算法

`CryptoKey` 类支持以下算法，按各自的父密码系统归类。

❑ RSA（Rivest-Shamir-Adleman）​：公钥密码系统，使用两个大素数获得一对公钥和私钥，可用于签名/验证或加密/解密消息。RSA 的陷门函数被称为分解难题（factoring problem）​。<br />
❑ RSASSA-PKCS1-v1_5:RSA 的一个应用，用于使用私钥给消息签名，允许使用公钥验证签名。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ SSA（Signature Schemes with Appendix）​，表示算法支持签名生成和验证操作。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ PKCS1（Public-Key Cryptography Standards #1）​，表示算法展示出的 RSA 密钥必需的数学特性。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ RSASSA-PKCS1-v1_5 是确定性的，意味着同样的消息和密钥每次都会生成相同的签名。<br />
❑ RSA-PSS:RSA 的另一个应用，用于签名和验证消息。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ PSS（Probabilistic Signature Scheme）​，表示生成签名时会加盐以得到随机签名。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 与 RSASSA-PKCS1-v1_5 不同，同样的消息和密钥每次都会生成不同的签名。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 与 RSASSA-PKCS1-v1_5 不同，RSA-PSS 有可能约简到 RSA 分解难题的难度。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ 通常，虽然 RSASSA-PKCS1-v1_5 仍被认为是安全的，但 RSA-PSS 应该用于代替 RSASSA-PKCS1-v1_5。<br />
❑ RSA-OAEP:RSA 的一个应用，用于使用公钥加密消息，用私钥来解密。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ OAEP（Optimal Asymmetric Encryption Padding）​，表示算法利用了 Feistel 网络在加密前处理未加密的消息。<br />
&nbsp;&nbsp;&nbsp;&nbsp;■ OAEP 主要将确定性 RSA 加密模式转换为概率性加密模式。<br />
❑ ECC（Elliptic-Curve Cryptography）​：公钥密码系统，使用一个素数和一个椭圆曲线获得一对公钥和私钥，可用于签名/验证消息。ECC 的陷门函数被称为椭圆曲线离散对数问题（elliptic curve discrete logarithm problem）​。ECC 被认为优于 RSA。虽然 RSA 和 ECC 在密码学意义上都很强，但 ECC 密钥比 RSA 密钥短，而且 ECC 密码学操作比 RSA 操作快。<br />
❑ ECDSA（Elliptic Curve Digital Signature Algorithm）:ECC 的一个应用，用于签名和验证消息。这个算法是数字签名算法（DSA, Digital Signature Algorithm）的一个椭圆曲线风格的变体。<br />
❑ ECDH（Elliptic Curve Diffie-Hellman）:ECC 的密钥生成和密钥协商应用，允许两方通过公开通信渠道建立共享的机密。这个算法是 Diffie-Hellman 密钥交换（DH, Diffie-Hellman key exchange）协议的一个椭圆曲线风格的变体。<br />
❑ AES（Advanced Encryption Standard）​：对称密钥密码系统，使用派生自置换组合网络的分组密码加密和解密数据。AES 在不同模式下使用，不同模式算法的特性也不同。<br />
❑ AES-CTR: AES 的计数器模式（counter mode）​。这个模式使用递增计数器生成其密钥流，其行为类似密文流。使用时必须为其提供一个随机数，用作初始化向量。AES-CTR 加密/解密可以并行。<br />
❑ AES-CBC: AES 的密码分组链模式（cipher block chaining mode）​。在加密纯文本的每个分组之前，先使用之前密文分组求 XOR，也就是名字中的“链”​。使用一个初始化向量作为第一个分组的 XOR 输入。<br />
❑ AES-GCM: AES 的伽罗瓦/计数器模式（Galois/Counter mode）​。这个模式使用计数器和初始化向量生成一个值，这个值会与每个分组的纯文本计算 XOR。与 CBC 不同，这个模式的 XOR 输入不依赖之前分组密文。因此 GCM 模式可以并行。由于其卓越的性能，AES-GCM 在很多网络安全协议中得到了应用。<br />
❑ AES-KW: AES 的密钥包装模式（key wrapping mode）​。这个算法将加密密钥包装为一个可移植且加密的格式，可以在不信任的渠道中传输。传输之后，接收方可以解包密钥。与其他 AES 模式不同，AES-KW 不需要初始化向量。<br />
❑ HMAC（Hash-Based Message Authentication Code）​：用于生成消息认证码的算法，用于验证通过不可信网络接收的消息没有被修改过。两方使用散列函数和共享私钥来签名和验证消息。<br />
❑ KDF（Key Derivation Functions）​：可以使用散列函数从主密钥获得一个或多个密钥的算法。KDF 能够生成不同长度的密钥，也能把密钥转换为不同格式。<br />
❑ HKDF（HMAC-Based Key Derivation Function）​：密钥推导函数，与高熵输入（如已有密钥）一起使用。<br />
❑ PBKDF2（Password-Based Key Derivation Function 2）​：密钥推导函数，与低熵输入（如密钥字符串）一起使用。

#### 3．生成 CryptoKey

使用 `SubtleCrypto.generateKey()`方法可以生成随机 `CryptoKey`，这个方法返回一个期约，解决为一个或多个 `CryptoKey` 实例。使用时需要给这个方法传入一个指定目标算法的参数对象、一个表示密钥是否可以从 `CryptoKey` 对象中提取出来的布尔值，以及一个表示这个密钥可以与哪个 `SubtleCrypto` 方法一起使用的字符串数组（keyUsages）​。

由于不同的密码系统需要不同的输入来生成密钥，上述参数对象为每种密码系统都规定了必需的输入：

❑ RSA 密码系统使用 RsaHashedKeyGenParams 对象；<br />
❑ ECC 密码系统使用 EcKeyGenParams 对象；<br />
❑ HMAC 密码系统使用 HmacKeyGenParams 对象；<br />
❑ AES 密码系统使用 AesKeyGenParams 对象。

keyUsages 对象用于说明密钥可以与哪个算法一起使用。至少要包含下列中的一个字符串：

❑ encrypt<br />
❑ decrypt<br />
❑ sign<br />
❑ verify<br />
❑ deriveKey<br />
❑ deriveBits<br />
❑ wrapKey<br />
❑ unwrapKey

```javascript
/**
 * 生成一个满足如下条件的对称密钥：
 *  ❑ 支持AES-CTR算法；
 *  ❑ 密钥长度128位；
 *  ❑ 不能从CryptoKey对象中提取；
 *  ❑ 可以跟encrypt()和decrypt()方法一起使用。
 */
;(async function () {
  const params = {
    name: 'AES-CTR',
    length: 128
  }
  const keyUsages = ['encrypt', 'decrypt']
  const key = await crypto.subtle.generateKey(params, false, keyUsages)
  console.log(key)
  // CryptoKey{type: "secret", extractable: true, algorithm: {...}, usages: Array(2)}
})()

/**
 * 生成一个满足如下条件的非对称密钥：
 *  ❑ 支持ECDSA算法；
 *  ❑ 使用P-256椭圆曲线；
 *  ❑ 可以从CryptoKey中提取；
 *  ❑ 可以跟sign()和verify()方法一起使用。
 *
 */
;(async function () {
  const params = {
    name: 'ECDSA',
    namedCurve: 'P-256'
  }
  const keyUsages = ['sign', 'verify']
  const { publicKey, privateKey } = await crypto.subtle.generateKey(params, true, keyUsages)
  console.log(publicKey)
  // CryptoKey {type: "public", extractable: true, algorithm: {...}, usages: Array(1)}
  console.log(privateKey)
  // CryptoKey{type: "private", extractable: true, algorithm: {...}, usages: Array(1)}
})()
```

#### 4．导出和导入密钥

如果密钥是可提取的，那么就可以在 CryptoKey 对象内部暴露密钥原始的二进制内容。使用 `exportKey()`方法并指定目标格式（"raw"、"pkcs8"、"spki"或"jwk"）就可以取得密钥。这个方法返回一个期约，解决后的 `ArrayBuffer` 中包含密钥：

```javascript
;(async function () {
  const params = {
    name: 'AES-CTR',
    length: 128
  }
  const keyUsages = ['encrypt', 'decrypt']
  const key = await crypto.subtle.generateKey(params, true, keyUsages)
  const rawKey = await crypto.subtle.exportKey('raw', key)
  console.log(new Uint8Array(rawKey))
  // Uint8Array[93, 122, 66, 135, 144, 182, 119, 196, 234, 73, 84, 7, 139, 43, 238, 110]
})()
```

与 `exportKey()`相反的操作要使用 `importKey()`方法实现。`importKey()`方法的签名实际上是 `generateKey()`和 `exportKey()`的组合。下面的方法会生成密钥、导出密钥，然后再导入密钥：

```javascript
;(async function () {
  const params = {
    name: 'AES-CTR',
    length: 128
  }
  const keyUsages = ['encrypt', 'decrypt']
  const keyFormat = 'raw'
  const isExtractable = true
  const key = await crypto.subtle.generateKey(params, isExtractable, keyUsages)
  const rawKey = await crypto.subtle.exportKey(keyFormat, key)
  const importedKey = await crypto.subtle.importKey(keyFormat, rawKey, params.name, isExtractable, keyUsages)
  console.log(importedKey)
  // CryptoKey{type: "secret", extractable: true, algorithm: {...}, usages: Array(2)}
})()
```

#### 5．从主密钥派生密钥

使用 `SubtleCrypto` 对象可以通过可配置的属性从已有密钥获得新密钥。`SubtleCrypto` 支持一个 `deriveKey()`方法和一个 `deriveBits()`方法，前者返回一个解决为 `CryptoKey` 的期约，后者返回一个解决为 `ArrayBuffer` 的期约。

:::tip 注意
`deriveKey()`与 `deriveBits()`的区别很微妙，因为调用 `deriveKey()`实际上与调用 `deriveBits()`之后再把结果传给 `importKey()`相同。
:::

`deriveBits()`方法接收一个算法参数对象、主密钥和输出的位长作为参数。当两个人分别拥有自己的密钥对，但希望获得共享的加密密钥时可以使用这个方法。

```javascript
;(async function () {
  const ellipticCurve = 'P-256'
  const algoIdentifier = 'ECDH'
  const derivedKeySize = 128
  const params = {
    name: algoIdentifier,
    namedCurve: ellipticCurve
  }
  const keyUsages = ['deriveBits']
  const keyPairA = await crypto.subtle.generateKey(params, true, keyUsages)
  const keyPairB = await crypto.subtle.generateKey(params, true, keyUsages)
  // 从A的公钥和B的私钥派生密钥位
  const derivedBitsAB = await crypto.subtle.deriveBits(Object.assign({ public: keyPairA.publicKey }, params), keyPairB.privateKey, derivedKeySize)
  // 从B的公钥和A的私钥派生密钥位
  const derivedBitsBA = await crypto.subtle.deriveBits(Object.assign({ public: keyPairB.publicKey }, params), keyPairA.privateKey, derivedKeySize)
  const arrayAB = new Uint32Array(derivedBitsAB)
  const arrayBA = new Uint32Array(derivedBitsBA)
  // 确保密钥数组相等
  console.log(arrayAB.length === arrayBA.length && arrayAB.every((val, i) => val === arrayBA[i])) // true
})()
```

`deriveKey()`方法是类似的，只不过返回的是 `CryptoKey` 的实例而不是 `ArrayBuffer`。

```javascript
;(async function () {
  const password = 'foobar'
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const algoIdentifier = 'PBKDF2'
  const keyFormat = 'raw'
  const isExtractable = false
  const params = {
    name: algoIdentifier
  }
  const masterKey = await window.crypto.subtle.importKey(keyFormat, new TextEncoder().encode(password), params, isExtractable, ['deriveKey'])
  const deriveParams = {
    name: 'AES-GCM',
    length: 128
  }
  const derivedKey = await window.crypto.subtle.deriveKey(Object.assign({ salt, iterations: 1e5, hash: 'SHA-256' }, params), masterKey, deriveParams, isExtractable, ['encrypt'])
  console.log(derivedKey)
  // CryptoKey {type: "secret", extractable: false, algorithm: {...}, usages: Array(1)}
})()
```

#### 6．使用非对称密钥签名和验证消息

通过 `SubtleCrypto` 对象可以使用公钥算法用私钥生成签名，或者用公钥验证签名。这两种操作分别通过 `SubtleCrypto.sign()`和 `SubtleCrypto.verify()`方法完成。

签名消息需要传入参数对象以指定算法和必要的值、`CryptoKey` 和要签名的 `ArrayBuffer` 或 `ArrayBufferView`。

```javascript
;(async function () {
  const keyParams = {
    name: 'ECDSA',
    namedCurve: 'P-256'
  }
  const keyUsages = ['sign', 'verify']
  const { publicKey, privateKey } = await crypto.subtle.generateKey(keyParams, true, keyUsages)
  const message = new TextEncoder().encode('IamSatoshiNakamoto')
  const signParams = {
    name: 'ECDSA',
    hash: 'SHA-256'
  }
  const signature = await crypto.subtle.sign(signParams, privateKey, message)
  console.log(new Uint32Array(signature))
  // Uint32Array(16) [2202267297, 698413658, 1501924384, 691450316, 778757775, ... ]
})()
```

希望通过这个签名验证消息的人可以使用公钥和 `SubtleCrypto.verify()`方法。这个方法的签名几乎与 `sign()`相同，只是必须提供公钥以及签名。

```javascript
;(async function () {
  const keyParams = {
    name: 'ECDSA',
    namedCurve: 'P-256'
  }
  const keyUsages = ['sign', 'verify']
  const { publicKey, privateKey } = await crypto.subtle.generateKey(keyParams, true, keyUsages)
  const message = new TextEncoder().encode('I am Satoshi Nakamoto')
  const signParams = {
    name: 'ECDSA',
    hash: 'SHA-256'
  }
  const signature = await crypto.subtle.sign(signParams, privateKey, message)
  const verified = await crypto.subtle.verify(signParams, publicKey, signature, message)
  console.log(verified) // true
})()
```

#### 7．使用对称密钥加密和解密

`SubtleCrypto` 对象支持使用公钥和对称算法加密和解密消息。这两种操作分别通过 `SubtleCrypto.encrypt()`和 `SubtleCrypto.decrypt()`方法完成。

加密消息需要传入参数对象以指定算法和必要的值、加密密钥和要加密的数据。

```javascript
;(async function () {
  const algoIdentifier = 'AES-CBC'
  const keyParams = {
    name: algoIdentifier,
    length: 256
  }
  const keyUsages = ['encrypt', 'decrypt']
  const key = await crypto.subtle.generateKey(keyParams, true, keyUsages)
  const originalPlaintext = new TextEncoder().encode('I am Satoshi Nakamoto')
  const encryptDecryptParams = {
    name: algoIdentifier,
    iv: crypto.getRandomValues(new Uint8Array(16))
  }
  const ciphertext = await crypto.subtle.encrypt(encryptDecryptParams, key, originalPlaintext)
  console.log(ciphertext) // ArrayBuffer(32) {}
  const decryptedPlaintext = await crypto.subtle.decrypt(encryptDecryptParams, key, ciphertext)
  console.log(new TextDecoder().decode(decryptedPlaintext)) // I am Satoshi Nakamoto
})()
```

#### 8．包装和解包密钥

`SubtleCrypto` 对象支持包装和解包密钥，以便在非信任渠道传输。这两种操作分别通过 `Subtle-Crypto.wrapKey()`和 `SubtleCrypto.unwrapKey()`方法完成。

包装密钥需要传入一个格式字符串、要包装的 `CryptoKey` 实例、要执行包装的 `CryptoKey`，以及一个参数对象用于指定算法和必要的值。

```javascript
;(async function () {
  const keyFormat = 'raw'
  const extractable = true
  const wrappingKeyAlgoIdentifier = 'AES-KW'
  const wrappingKeyUsages = ['wrapKey', 'unwrapKey']
  const wrappingKeyParams = {
    name: wrappingKeyAlgoIdentifier,
    length: 256
  }
  const keyAlgoIdentifier = 'AES-GCM'
  const keyUsages = ['encrypt']
  const keyParams = {
    name: keyAlgoIdentifier,
    length: 256
  }
  const wrappingKey = await crypto.subtle.generateKey(wrappingKeyParams, extractable, wrappingKeyUsages)
  console.log(wrappingKey)
  // CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(2)}
  const key = await crypto.subtle.generateKey(keyParams, extractable, keyUsages)
  console.log(key)
  // CryptoKey {type: "secret", extractable: true, algorithm: {...}, usages: Array(1)}
  const wrappedKey = await crypto.subtle.wrapKey(keyFormat, key, wrappingKey, wrappingKeyAlgoIdentifier)
  console.log(wrappedKey)
  //ArrayBuffer(40){}
  const unwrappedKey = await crypto.subtle.unwrapKey(keyFormat, wrappedKey, wrappingKey, wrappingKeyParams, keyParams, extractable, keyUsages)
  console.log(unwrappedKey)
  // CryptoKey{type: "secret", extractable: true, algorithm: {...}, usages: Array(1)}
})()
```
