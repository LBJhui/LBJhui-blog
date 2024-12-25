---
outline: [2, 4]
---

# 第 11 章 期约(promise)与异步函数

## 11.1 异步编程

### 11.1.1 同步与异步

同步行为对应内存中顺序执行的处理器指令。每条指令都会严格按照它们出现的顺序来执行，而每条指令执行后也能立即获得存储在系统本地（如寄存器或系统内存）的信息。这样的执行流程容易分析程序在执行到代码任意位置时的状态（比如变量的值）​。

### 11.1.2 以往的异步编程模式

在早期的 JavaScript 中，只支持定义回调函数来表明异步操作完成。串联多个异步操作是一个常见的问题，通常需要深度嵌套的回调函数（俗称“回调地狱”​）来解决。

## 11.2 期约

### 11.2.1 Promises/A+规范

早期的期约机制在 jQuery 和 Dojo 中是以 Deferred API 的形式出现的。到了 2010 年，CommonJS 项目实现的 Promises/A 规范日益流行起来。Q 和 Bluebird 等第三方 JavaScript 期约库也越来越得到社区认可，虽然这些库的实现多少都有些不同。为弥合现有实现之间的差异，2012 年 Promises/A+组织分叉（fork）了 CommonJS 的 Promises/A 建议，并以相同的名字制定了 Promises/A+规范。这个规范最终成为了 ECMAScript 6 规范实现的范本。

ECMAScript 6 增加了对 Promises/A+规范的完善支持，即 Promise 类型。一经推出，Promise 就大受欢迎，成为了主导性的异步编程机制。所有现代浏览器都支持 ES6 期约，很多其他浏览器 API（如 fetch()和 Battery Status API）也以期约为基础。

### 11.2.2 期约基础

ECMAScript 6 新增的引用类型 `Promise`，可以通过 `new` 操作符来实例化。创建新期约时需要传入执行器（executor）函数作为参数，如果不提供执行器函数，就会抛出 SyntaxError。

#### 1．期约状态机

期约是一个有状态的对象，可能处于如下 3 种状态之一：

❑ 待定（`pending`）<br />
❑ 兑现（`fulfilled`，有时候也称为“解决”, `resolved`）<br />
❑ 拒绝（`rejected`）

**待定**（`pending`）是期约的最初始状态。在待定状态下，期约可以**落定**（`settled`）为代表成功的**兑现**（`fulfilled`）状态，或者代表失败的**拒绝**（`rejected`）状态。无论落定为哪种状态都是不可逆的。只要从待定转换为兑现或拒绝，期约的状态就不再改变。而且，也不能保证期约必然会脱离待定状态。因此，组织合理的代码无论期约解决（`resolve`）还是拒绝（`reject`）​，甚至永远处于待定（`pending`）状态，都应该具有恰当的行为。

要的是，期约的状态是私有的，不能直接通过 JavaScript 检测到。这主要是为了避免根据读取到的期约状态，以同步方式处理期约对象。另外，期约的状态也不能被外部 JavaScript 代码修改。这与不能读取该状态的原因是一样的：期约故意将异步行为封装起来，从而隔离外部的同步代码。

#### 2．解决值、拒绝理由及期约用例

期约主要有两大用途。首先是抽象地表示一个异步操作。期约的状态代表期约是否完成。​“待定”表示尚未开始或者正在执行中。​“兑现”表示已经成功完成，而“拒绝”则表示没有成功完成。每个期约只要状态切换为兑现，就会有一个私有的内部值（`value`）​。类似地，每个期约只要状态切换为拒绝，就会有一个私有的内部理由（`reason`）​。无论是值还是理由，都是包含原始值或对象的不可修改的引用。二者都是可选的，而且默认值为 `undefined`。在期约到达某个落定状态时执行的异步代码始终会收到这个值或理由。

#### 3．通过执行函数控制期约状态

由于期约的状态是私有的，所以只能在内部进行操作。内部操作在期约的执行器函数中完成。执行器函数主要有两项职责：初始化期约的异步行为和控制状态的最终转换。其中，控制期约状态的转换是通过调用它的两个函数参数实现的。这两个函数参数通常都命名为 `resolve()`和 `reject()`。调用 `resolve()`会把状态切换为兑现，调用 `reject()`会把状态切换为拒绝。另外，调用 `reject()`也会抛出错误 ​。

执行器函数是同步执行的，这是因为执行器函数是期约的初始化程序。

无论 `resolve()`和 `reject()`中的哪个被调用，状态转换都不可撤销了，继续修改状态会静默失败。为避免期约卡在待定状态，可以添加一个定时退出功能。

#### 4．Promise.resolve()

期约并非一开始就必须处于待定状态，然后通过执行器函数才能转换为落定状态。通过调用 `Promise.resolve()`静态方法，可以实例化一个解决的期约。下面两个期约实例实际上是一样的：

```javascript
let p1 = new Promise((resolve, reject) => resolve())
let p2 = Promise.resolve()
```

这个解决的期约的值对应着传给 `Promise.resolve()`的第一个参数。使用这个静态方法，实际上可以把任何值都转换为一个期约：

```javascript
setTimeout(console.log, 0, Promise.resolve())
// Promise <resolved>: undefined
setTimeout(console.log, 0, Promise.resolve(3))
// Promise <resolved>: 3
// 多余的参数会忽略
setTimeout(console.log, 0, Promise.resolve(4, 5, 6))
// Promise <resolved>: 4
```

对这个静态方法而言，如果传入的参数本身是一个期约，那它的行为就类似于一个空包装。因此，`Promise.resolve()`可以说是一个幂等方法，如下所示：

```javascript
let p = Promise.resolve(7)
setTimeout(console.log, 0, p === Promise.resolve(p)) // true
setTimeout(console.log, 0, p === Promise.resolve(Promise.resolve(p))) // true
```

这个幂等性会保留传入期约的状态：

```javascript
let p = new Promise(() => {})
setTimeout(console.log, 0, p) // Promise <pending>
setTimeout(console.log, 0, Promise.resolve(p)) // Promise <pending>
setTimeout(console.log, 0, p === Promise.resolve(p)) //true
```

:::tip 注意
这个静态方法能够包装任何非期约值，包括错误对象，并将其转换为解决的期约。因此，也可能导致不符合预期的行为：
:::

```javascript
let p = Promise.resolve(new Error('foo'))
setTimeout(console.log, 0, p) //Promise<resolved>: Error: foo
```

#### 5．Promise.reject()

与 `Promise.resolve()`类似，`Promise.reject()`会实例化一个拒绝的期约并抛出一个异步错误（这个错误不能通过 `try/catch` 捕获，而只能通过拒绝处理程序捕获）​。下面的两个期约实例实际上是一样的：

```javascript
let p1 = new Promise((resolve, reject) => reject())
let p2 = Promise.reject()
```

这个拒绝的期约的理由就是传给 `Promise.reject()`的第一个参数。这个参数也会传给后续的拒绝处理程序：

```javascript
let p = Promise.reject(3)
setTimeout(console.log, 0, p) // Promise <rejected>: 3
p.then(null, (e) => setTimeout(console.log, 0, e)) // 3
```

关键在于，`Promise.reject()`并没有照搬 `Promise.resolve()`的幂等逻辑。如果给它传一个期约对象，则这个期约会成为它返回的拒绝期约的理由：

```javascript
setTimeout(console.log, 0, Promise.reject(Promise.resolve())) // Promise <rejected>: Promise <resolved>
```

#### 6．同步/异步执行的二元性

`Promise` 的设计很大程度上会导致一种完全不同于 JavaScript 的计算模式。下面的例子完美地展示了这一点，其中包含了两种模式下抛出错误的情形：

```javascript
try {
  thrownewError('foo')
} catch (e) {
  console.log(e) // Error: foo
}
try {
  Promise.reject(newError('bar'))
} catch (e) {
  console.log(e)
}
//Uncaught(inpromise)Error: bar
```

第一个 `try/catch` 抛出并捕获了错误，第二个 `try/catch` 抛出错误却没有捕获到。乍一看这可能有点违反直觉，因为代码中确实是同步创建了一个拒绝的期约实例，而这个实例也抛出了包含拒绝理由的错误。这里的同步代码之所以没有捕获期约抛出的错误，是因为它没有通过异步模式捕获错误。从这里就可以看出期约真正的异步特性：它们是同步对象（在同步执行模式中使用）​，但也是异步执行模式的媒介。

在前面的例子中，拒绝期约的错误并没有抛到执行同步代码的线程里，而是通过浏览器异步消息队列来处理的。因此，`try/catch` 块并不能捕获该错误。代码一旦开始以异步模式执行，则唯一与之交互的方式就是使用异步结构——更具体地说，就是期约的方法。

### 11.2.3 期约的实例方法

#### 1．实现 Thenable 接口

在 ECMAScript 暴露的异步结构中，任何对象都有一个 `then()`方法。这个方法被认为实现了 Thenable 接口。

ECMAScript 的 Promise 类型实现了 Thenable 接口。这个简化的接口跟 TypeScript 或其他包中的接口或类型定义不同，它们都设定了 Thenable 接口更具体的形式。

#### 2．Promise.prototype.then()

`Promise.prototype.then()`是为期约实例添加处理程序的主要方法。这个 `then()`方法接收最多两个参数：`onResolved` 处理程序和 `onRejected` 处理程序。这两个参数都是可选的，如果提供的话，则会在期约分别进入“兑现”和“拒绝”状态时执行。传给 `then()`的任何非函数类型的参数都会被静默忽略。这两个操作一定是互斥的。

`Promise.prototype.then()`方法返回一个新的期约实例。这个新期约实例基于 `onResovled` 处理程序的返回值构建。换句话说，该处理程序的返回值会通过 `Promise.resolve()`包装来生成新期约。如果没有提供这个处理程序，则 `Promise.resolve()`就会包装上一个期约解决之后的值。如果没有显式的返回语句，则 `Promise.resolve()`会包装默认的返回值 `undefined`。

```javascript
let p1 = Promise.resolve('foo')
// 若调用then()时不传处理程序，则原样向后传
let p2 = p1.then()
setTimeout(console.log, 0, p2) // Promise <resolved>: foo
// 这些都一样
let p3 = p1.then(() => undefined)
let p4 = p1.then(() => {})
let p5 = p1.then(() => Promise.resolve())
setTimeout(console.log, 0, p3) // Promise <resolved>: undefined
setTimeout(console.log, 0, p4) // Promise <resolved>: undefined
setTimeout(console.log, 0, p5) // Promise <resolved>: undefined

// 如果有显式的返回值，则Promise.resolve()会包装这个值：
let p6 = p1.then(() => 'bar')
let p7 = p1.then(() => Promise.resolve('bar'))
setTimeout(console.log, 0, p6) // Promise <resolved>: bar
setTimeout(console.log, 0, p7) // Promise <resolved>: bar
// Promise.resolve()保留返回的期约
let p8 = p1.then(() => new Promise(() => {}))
let p9 = p1.then(() => Promise.reject())
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p8) // Promise <pending>
setTimeout(console.log, 0, p9) // Promise <rejected>: undefined

// 抛出异常会返回拒绝的期约：
let p10 = p1.then(() => {
  throw 'baz'
})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p10) // Promise <rejected> baz

// 注意，返回错误值不会触发上面的拒绝行为，而会把错误对象包装在一个解决的期约中：
let p11 = p1.then(() => Error('qux'))
setTimeout(console.log, 0, p11) // Promise <resolved>: Error: qux
```

下面的代码片段展示了用 `Promise.reject()`替代之前例子中的 `Promise.resolve()`之后的结果：

```javascript
let p1 = Promise.reject('foo')
// 调用then()时不传处理程序则原样向后传
let p2 = p1.then()
// Uncaught (in promise) foo
setTimeout(console.log, 0, p2) // Promise <rejected>: foo
// 这些都一样
let p3 = p1.then(null, () => undefined)
let p4 = p1.then(null, () => {})
let p5 = p1.then(null, () => Promise.resolve())
setTimeout(console.log, 0, p3) // Promise <resolved>: undefined
setTimeout(console.log, 0, p4) // Promise <resolved>: undefined
setTimeout(console.log, 0, p5) // Promise <resolved>: undefined
// 这些都一样
let p6 = p1.then(null, () => 'bar')
let p7 = p1.then(null, () => Promise.resolve('bar'))
setTimeout(console.log, 0, p6) // Promise <resolved>: bar
setTimeout(console.log, 0, p7) // Promise <resolved>: bar
// Promise.resolve()保留返回的期约
let p8 = p1.then(null, () => new Promise(() => {}))
let p9 = p1.then(null, () => Promise.reject())
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p8) // Promise <pending>
setTimeout(console.log, 0, p9) // Promise <rejected>: undefined
let p10 = p1.then(null, () => {
  throw 'baz'
})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p10) // Promise <rejected>: baz
let p11 = p1.then(null, () => Error('qux'))
setTimeout(console.log, 0, p11) // Promise <resolved>: Error: qux
```

#### 3．Promise.prototype.catch()

`Promise.prototype.catch()`方法用于给期约添加拒绝处理程序。这个方法只接收一个参数：`onRejected` 处理程序。事实上，这个方法就是一个语法糖，调用它就相当于调用 `Promise.prototype.then(null, onRejected)`。

```javascript
let p = Promise.reject()
let onRejected = function (e) {
  setTimeout(console.log, 0, 'rejected')
}

// 这两种添加拒绝处理程序的方式是一样的：
p.then(null, onRejected) // rejected
p.catch(onRejected) //rejected
```

`Promise.prototype.catch()`返回一个新的期约实例。在返回新期约实例方面，`Promise.prototype.catch()`的行为与 `Promise.prototype.then()`的 `onRejected` 处理程序是一样的。

#### 4．Promise.prototype.finally()

`Promise.prototype.finally()`方法用于给期约添加 `onFinally` 处理程序，这个处理程序在期约转换为解决或拒绝状态时都会执行。这个方法可以避免 `onResolved` 和 `onRejected` 处理程序中出现冗余代码。但 `onFinally` 处理程序没有办法知道期约的状态是解决还是拒绝，所以这个方法主要用于添加清理代码。

`Promise.prototype.finally()`方法返回一个新的期约实例。这个新期约实例不同于 `then()`或 `catch()`方式返回的实例。因为 `onFinally` 被设计为一个状态无关的方法，所以在大多数情况下它将表现为父期约的传递。对于已解决状态和被拒绝状态都是如此。

```javascript
let p1 = Promise.resolve('foo')
// 这里都会原样后传
let p2 = p1.finally()
let p3 = p1.finally(() => undefined)
let p4 = p1.finally(() => {})
let p5 = p1.finally(() => Promise.resolve())
let p6 = p1.finally(() => 'bar')
let p7 = p1.finally(() => Promise.resolve('bar'))
let p8 = p1.finally(() => Error('qux'))
setTimeout(console.log, 0, p2) // Promise <resolved>: foo
setTimeout(console.log, 0, p3) // Promise <resolved>: foo
setTimeout(console.log, 0, p4) // Promise <resolved>: foo
setTimeout(console.log, 0, p5) // Promise <resolved>: foo
setTimeout(console.log, 0, p6) // Promise <resolved>: foo
setTimeout(console.log, 0, p7) // Promise <resolved>: foo
setTimeout(console.log, 0, p8) // Promise <resolved>: foo
```

如果返回的是一个待定的期约，或者 `onFinally` 处理程序抛出了错误（显式抛出或返回了一个拒绝期约）​，则会返回相应的期约（待定或拒绝）​

```javascript
// Promise.resolve()保留返回的期约
let p9 = p1.finally(() => new Promise(() => {}))
let p10 = p1.finally(() => Promise.reject())
// Uncaught (in promise): undefined
setTimeout(console.log, 0, p9) // Promise <pending>
setTimeout(console.log, 0, p10) // Promise <rejected>: undefined
let p11 = p1.finally(() => {
  throw 'baz'
})
// Uncaught (in promise) baz
setTimeout(console.log, 0, p11) // Promise <rejected>: baz
```

返回待定期约的情形并不常见，这是因为只要期约一解决，新期约仍然会原样后传初始的期约：

```javascript
let p1 = Promise.resolve('foo')
// 忽略解决的值
let p2 = p1.finally(() => new Promise((resolve, reject) => setTimeout(() => resolve('bar'), 100)))
setTimeout(console.log, 0, p2) // Promise <pending>
setTimeout(() => setTimeout(console.log, 0, p2), 200)
// 200 毫秒后：
// Promise <resolved>: foo
```

#### 5．非重入期约方法

当期约进入落定状态时，与该状态相关的处理程序仅仅会被排期，而非立即执行。跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前先执行。即使期约一开始就是与附加处理程序关联的状态，执行顺序也是这样的。这个特性由 JavaScript 运行时保证，被称为“非重入”​（non-reentrancy）特性。

```javascript
// 创建解决的期约
let p = Promise.resolve()
// 添加解决处理程序
// 直觉上，这个处理程序会等期约一解决就执行
p.then(() => console.log('onResolved handler'))
// 同步输出，证明then()已经返回
console.log('then() returns')
// 实际的输出：
// 'then()returns'
// onResolved handler
```

先添加处理程序后解决期约也是一样的。如果添加处理程序后，同步代码才改变期约状态，那么处理程序仍然会基于该状态变化表现出非重入特性。下面的例子展示了即使先添加了 `onResolved` 处理程序，再同步调用 `resolve()`，处理程序也不会进入同步线程执行：

```javascript
let synchronousResolve
// 创建一个期约并将解决函数保存在一个局部变量中
let p = new Promise((resolve) => {
  synchronousResolve = function () {
    console.log('1: invoking resolve()')
    resolve()
    console.log('2: resolve() returns')
  }
})
p.then(() => console.log('4: then() handler executes'))
synchronousResolve()
console.log('3: synchronousResolve() returns')
// 实际的输出：
// '1: invokingresolve()'
// '2: resolve()returns'
// '3: synchronousResolve() returns'
// '4: then() handler executes'
```

非重入适用于 `onResolved`/`onRejected` 处理程序、`catch()`处理程序和 `finally()`处理程序。

```javascript
let p1 = Promise.resolve()
p1.then(() => console.log('p1.then() onResolved'))
console.log('p1.then() returns')
let p2 = Promise.reject()
p2.then(null, () => console.log('p2.then() onRejected'))
console.log('p2.then() returns')
let p3 = Promise.reject()
p3.catch(() => console.log('p3.catch() onRejected'))
console.log('p3.catch() returns')
let p4 = Promise.resolve()
p4.finally(() => console.log('p4.finally() onFinally'))
console.log('p4.finally() returns')
// 'p1.then() returns'
// 'p2.then() returns'
// 'p3.catch() returns'
// 'p4.finally() returns'
// 'p1.then() onResolved'
// 'p2.then() onRejected'
// 'p3.catch() onRejected'
// 'p4.finally() onFinally'
```

#### 6．邻近处理程序的执行顺序

如果给期约添加了多个处理程序，当期约状态变化时，相关处理程序会按照添加它们的顺序依次执行。无论是 `then()`、`catch()`还是 `finally()`添加的处理程序都是如此。

#### 7．传递解决值和拒绝理由

在执行函数中，解决的值和拒绝的理由是分别作为 `resolve()`和 `reject()`的第一个参数往后传的。然后，这些值又会传给它们各自的处理程序，作为 `onResolved` 或 `onRejected` 处理程序的唯一参数。

`Promise.resolve()`和 `Promise.reject()`在被调用时就会接收解决值和拒绝理由。同样地，它们返回的期约也会像执行器一样把这些值传给 `onResolved` 或 `onRejected` 处理程序。

```javascript
let p1 = new Promise((resolve, reject) => resolve('foo'))
p1.then((value) => console.log(value)) // 'foo'
let p2 = new Promise((resolve, reject) => reject('bar'))
p2.catch((reason) => console.log(reason)) // 'bar'

let p3 = Promise.resolve('foo')
p3.then((value) => console.log(value)) // 'foo'
let p4 = Promise.reject('bar')
p4.catch((reason) => console.log(reason)) // 'bar'
```

#### 8．拒绝期约与拒绝错误处理

拒绝期约类似于 `throw()`表达式，因为它们都代表一种程序状态，即需要中断或者特殊处理。在期约的执行函数或处理程序中抛出错误会导致拒绝，对应的错误对象会成为拒绝的理由。

```javascript
let p1 = new Promise((resolve, reject) => reject(Error('foo')))
let p2 = new Promise((resolve, reject) => {
  throw Error('foo')
})
let p3 = Promise.resolve().then(() => {
  throw Error('foo')
})
let p4 = Promise.reject(Error('foo'))
setTimeout(console.log, 0, p1) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p2) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p3) // Promise <rejected>: Error: foo
setTimeout(console.log, 0, p4) // Promise <rejected>: Error: foo
// 也会抛出4 个未捕获错误
```

在期约中抛出错误时，因为错误实际上是从消息队列中异步抛出的，所以并不会阻止运行时继续执行同步指令：

```javascript
Promise.reject(Error('foo'))
console.log('bar')
// 'bar'
// Uncaught (in promise) Error: foo
```

异步错误只能通过异步的 `onRejected` 处理程序捕获。这不包括捕获执行函数中的错误，在解决或拒绝期约之前，仍然可以使用 `try/catch` 在执行函数中捕获错误。

`then()`和 `catch()`的 `onRejected` 处理程序在语义上相当于 `try/catch`。出发点都是捕获错误之后将其隔离，同时不影响正常逻辑执行。为此，`onRejected` 处理程序的任务应该是在捕获异步错误之后返回一个解决的期约。下面的例子中对比了同步错误处理与异步错误处理：

```javascript
console.log('begin synchronous execution')
try {
  throw Error('foo')
} catch (e) {
  console.log('caught error', e)
}
console.log('continue synchronous execution')
// begin synchronous execution
// caught error Error: foo
// continue synchronous execution
new Promise((resolve, reject) => {
  console.log('begin asynchronous execution')
  reject(Error('bar'))
})
  .catch((e) => {
    console.log('caught error', e)
  })
  .then(() => {
    console.log('continue asynchronous execution')
  })
// begin asynchronous execution
// caught error Error: bar
// continue asynchronous execution
```

### 11.2.4 期约连锁与期约合成

期约连锁就是一个期约接一个期约地拼接，期约合成则是将多个期约组合为一个期约。

#### 1．期约连锁

将异步任务串行化，解决之前依赖回调的难题。

#### 2．期约图

因为一个期约可以有任意多个处理程序，所以期约连锁可以构建有向非循环图的结构。

```javascript
//      A
//     / \
//    B    C
//   /\   /\
//   D E  F G
let A = new Promise((resolve, reject) => {
  console.log('A')
  resolve()
})
let B = A.then(() => console.log('B'))
let C = A.then(() => console.log('C'))
B.then(() => console.log('D'))
B.then(() => console.log('E'))
C.then(() => console.log('F'))
C.then(() => console.log('G'))
```

#### 3．Promise.all()和 Promise.race()

**● Promise.all()**

`Promise.all()`静态方法创建的期约会在一组期约全部解决之后再解决。这个静态方法接收一个可迭代对象，返回一个新期约。

```javascript
let p1 = Promise.all([Promise.resolve(), Promise.resolve()])
// 可迭代对象中的元素会通过Promise.resolve()转换为期约
let p2 = Promise.all([3, 4])
// 空的可迭代对象等价于Promise.resolve()
let p3 = Promise.all([])
// 无效的语法
let p4 = Promise.all() // TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
```

合成的期约只会在每个包含的期约都解决之后才解决。如果至少有一个包含的期约待定，则合成的期约也会待定。如果有一个包含的期约拒绝，则合成的期约也会拒绝。

```javascript
let p = Promise.all([Promise.resolve(), new Promise((resolve, reject) => setTimeout(resolve, 1000))])
setTimeout(console.log, 0, p) // Promise <pending>
p.then(() => setTimeout(console.log, 0, 'all() resolved! '))
// all() resolved!（大约1 秒后）
```

如果所有期约都成功解决，则合成期约的解决值就是所有包含期约解决值的数组，按照迭代器顺序。

```javascript
let p = Promise.all([Promise.resolve(3), Promise.resolve(), Promise.resolve(4)])
p.then((values) => setTimeout(console.log, 0, values)) // [ 3, undefined, 4 ]
```

如果有期约拒绝，则第一个拒绝的期约会将自己的理由作为合成期约的拒绝理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这并不影响所有包含期约正常的拒绝操作。合成的期约会静默处理所有包含期约的拒绝操作。

**● Promise.race()**

`Promise.race()`静态方法返回一个包装期约，是一组集合中最先解决或拒绝的期约的镜像。这个方法接收一个可迭代对象，返回一个新期约：

```javascript
let p1 = Promise.race([Promise.resolve(), Promise.resolve()])
// 可迭代对象中的元素会通过Promise.resolve()转换为期约
let p2 = Promise.race([3, 4])
// 空的可迭代对象等价于new Promise(() => {})
let p3 = Promise.race([])
// 无效的语法
let p4 = Promise.race()
// TypeError: cannot read Symbol.iterator of undefined
```

`Promise.race()`不会对解决或拒绝的期约区别对待。无论是解决还是拒绝，只要是第一个落定的期约，`Promise.race()`就会包装其解决值或拒绝理由并返回新期约。如果有一个期约拒绝，只要它是第一个落定的，就会成为拒绝合成期约的理由。之后再拒绝的期约不会影响最终期约的拒绝理由。不过，这并不影响所有包含期约正常的拒绝操作。与 `Promise.all()`类似，合成的期约会静默处理所有包含期约的拒绝操作。

#### 4．串行期约合成

异步产生值并将其传给处理程序。基于后续期约使用之前期约的返回值来串联期约是期约的基本功能。这很像函数合成，即将多个函数合成为一个函数。

```javascript
function addTwo(x) {
  return x + 2
}
function addThree(x) {
  return x + 3
}
function addFive(x) {
  return x + 5
}
// ①
function addTen(x) {
  return addFive(addTwo(addThree(x)))
}
console.log(addTen(7)) // 17
// ②
function addTen(x) {
  return Promise.resolve(x).then(addTwo).then(addThree).then(addFive)
}
addTen(8).then(console.log) // 18
// ③
function addTen(x) {
  return [addTwo, addThree, addFive].reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}
addTen(8).then(console.log) // 18
```

这种模式可以提炼出一个通用函数，可以把任意多个函数作为处理程序合成一个连续传值的期约连锁。这个通用的合成函数可以这样实现：

```javascript
function addTwo(x) {
  return x + 2
}
function addThree(x) {
  return x + 3
}
function addFive(x) {
  return x + 5
}
function compose(...fns) {
  return (x) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}
let addTen = compose(addTwo, addThree, addFive)
addTen(8).then(console.log) // 18
```

### 11.2.5 期约扩展

#### 1．期约取消

```html
<button id="start">Start</button>
<button id="cancel">Cancel</button>
<script>
  class CancelToken {
    constructor(cancelFn) {
      this.promise = new Promise((resolve, reject) => {
        cancelFn(() => {
          setTimeout(console.log, 0, 'delay cancelled')
          resolve()
        })
      })
    }
  }
  const startButton = document.querySelector('#start')
  const cancelButton = document.querySelector('#cancel')
  function cancellableDelayedResolve(delay) {
    setTimeout(console.log, 0, 'set delay')
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        setTimeout(console.log, 0, 'delayed resolve')
        resolve()
      }, delay)
      const cancelToken = new CancelToken((cancelCallback) => cancelButton.addEventListener('click', cancelCallback))
      cancelToken.promise.then(() => clearTimeout(id))
    })
  }
  startButton.addEventListener('click', () => cancellableDelayedResolve(1000))
</script>
```

#### 2．期约进度通知

ECMAScript 6 期约并不支持进度追踪，但是可以通过扩展来实现。

一种实现方式是扩展 `Promise` 类，为它添加 `notify()`方法。

```javascript
class TrackablePromise extends Promise {
  constructor(executor) {
    const notifyHandlers = []
    super((resolve, reject) => {
      return executor(resolve, reject, (status) => {
        notifyHandlers.map((handler) => handler(status))
      })
    })
    this.notifyHandlers = notifyHandlers
  }
  notify(notifyHandler) {
    this.notifyHandlers.push(notifyHandler)
    return this
  }
}
```

## 11.3 异步函数

### 11.3.1 异步函数

#### 1．async

`async` 关键字用于声明异步函数。这个关键字可以用在函数声明、函数表达式、箭头函数和方法上：

```javascript
async function foo() {}
let bar = async function () {}
let baz = async () => {}
class Qux {
  async qux() {}
}
```

使用 `async` 关键字可以让函数具有异步特征，但总体上其代码仍然是同步求值的。而在参数或闭包方面，异步函数仍然具有普通 JavaScript 函数的正常行为。不过，异步函数如果使用 `return` 关键字返回了值（如果没有 `return` 则会返回 `undefined`）​，这个值会被 `Promise.resolve()`包装成一个期约对象。异步函数始终返回期约对象。

```javascript
// ①
async function foo() {
  console.log(1)
}
foo()
console.log(2)
// 1 2

// ②
async function foo() {
  console.log(1)
  return 3
}
foo().then(console.log)
console.log(2)
// 1 2 3

// ③ 直接返回一个期约对象也是一样的
async function foo() {
  console.log(1)
  return Promise.resolve(3)
}
foo().then(console.log)
console.log(2)
// 1 2 3
```

异步函数的返回值期待（但实际上并不要求）一个实现 thenable 接口的对象，但常规的值也可以。如果返回的是实现 thenable 接口的对象，则这个对象可以由提供给 `then()`的处理程序“解包”​。如果不是，则返回值就被当作已经解决的期约。

在异步函数中抛出错误会返回拒绝的期约，不过，拒绝期约的错误不会被异步函数捕获。

```javascript
async function foo() {
  console.log(1)
  Promise.reject(3)
  throw 4
}

foo().catch(console.log)
console.log(2)
// 1 2 Uncaught(inpromise): 3 4
```

#### 2．await

使用 `await` 关键字可以暂停异步函数代码的执行，等待期约解决。

`await` 关键字会暂停执行异步函数后面的代码，让出 JavaScript 运行时的执行线程。这个行为与生成器函数中的 `yield` 关键字是一样的。`await` 关键字同样是尝试“解包”对象的值，然后将这个值传给表达式，再异步恢复异步函数的执行。

`await` 关键字的用法与 JavaScript 的一元操作一样。它可以单独使用，也可以在表达式中使用。

`await` 关键字期待（但实际上并不要求）一个实现 thenable 接口的对象，但常规的值也可以。如果是实现 thenable 接口的对象，则这个对象可以由 `await` 来“解包”​。如果不是，则这个值就被当作已经解决的期约。

等待会抛出错误的同步操作，会返回拒绝的期约：

```javascript
async function foo() {
  console.log(1)
  await (() => {
    throw 3
  })()
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log)
console.log(2)
// 1 2 3
```

如前面的例子所示，单独的 `Promise.reject()`不会被异步函数捕获，而会抛出未捕获错误。不过，对拒绝的期约使用 `await` 则会释放（unwrap）错误值（将拒绝期约返回）​：

```javascript
async function foo() {
  console.log(1)
  await Promise.reject(3)
  console.log(4) // 这行代码不会执行
}
// 给返回的期约添加一个拒绝处理程序
foo().catch(console.log)
console.log(2)
// 1 2 3
```

#### 3．await 的限制

`await` 关键字必须在异步函数中使用，不能在顶级上下文如`<script>`标签或模块中使用。不过，定义并立即调用异步函数是没问题的。下面两段代码实际是相同的：

```javascript
async function foo() {
  console.log(await Promise.resolve(3))
}
foo()
// 3
// 立即调用的异步函数表达式
;(async function () {
  console.log(await Promise.resolve(3))
})()
// 3
```

此外，异步函数的特质不会扩展到嵌套函数。因此，`await` 关键字也只能直接出现在异步函数的定义中。在同步函数内部使用 `await` 会抛出 SyntaxError。

### 11.3.2 停止和恢复执行

`async/await` 中真正起作用的是 `await`。`async` 关键字，无论从哪方面来看，都不过是一个标识符。毕竟，异步函数如果不包含 `await` 关键字，其执行基本上跟普通函数没有什么区别。

JavaScript 运行时在碰到 `await` 关键字时，会记录在哪里暂停执行。等到 `await` 右边的值可用了，JavaScript 运行时会向消息队列中推送一个任务，这个任务会恢复异步函数的执行。因此，即使 `await` 后面跟着一个立即可用的值，函数的其余部分也会被异步求值。

如果 `await` 后面是一个期约，则问题会稍微复杂一些。此时，为了执行异步函数，实际上会有两个任务被添加到消息队列并被异步求值。

```javascript
async function foo() {
  console.log(2)
  console.log(await Promise.resolve(6))
  console.log(7)
}
async function bar() {
  console.log(4)
  console.log(await 8)
  console.log(9)
}
console.log(1)
foo()
console.log(3)
bar()
console.log(5)
// 1 2 3 4 5 6 7 8 9
```

### 11.3.3 异步函数策略

#### 1．实现 sleep()

```javascript
async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}
async function foo() {
  const t0 = Date.now()
  await sleep(1500) // 暂停约1500 毫秒
  console.log(Date.now() - t0)
}
foo() // 1502
```

#### 2．利用平行执行

如果顺序不是必需保证的，那么可以先一次性初始化所有期约，然后再分别等待它们的结果。

#### 3．串行执行期约

#### 4．栈追踪与内存管理

期约与异步函数的功能有相当程度的重叠，但它们在内存中的表示则差别很大。看看下面的例子，它展示了拒绝期约的栈追踪信息：

```javascript
function fooPromiseExecutor(resolve, reject) {
  setTimeout(reject, 1000, 'bar')
}
function foo() {
  new Promise(fooPromiseExecutor)
}
foo()
// Uncaught (in promise) bar
//    setTimeout
//    setTimeout (async)
//   fooPromiseExecutor
//   foo
```

根据对期约的不同理解程度，以上栈追踪信息可能会让某些读者不解。栈追踪信息应该相当直接地表现 JavaScript 引擎当前栈内存中函数调用之间的嵌套关系。在超时处理程序执行时和拒绝期约时，我们看到的错误信息包含嵌套函数的标识符，那是被调用以创建最初期约实例的函数。可是，我们知道这些函数已经返回了，因此栈追踪信息中不应该看到它们。

答案很简单，这是因为 JavaScript 引擎会在创建期约时尽可能保留完整的调用栈。在抛出错误时，调用栈可以由运行时的错误处理逻辑获取，因而就会出现在栈追踪信息中。当然，这意味着栈追踪信息会占用内存，从而带来一些计算和存储成本。

如果在前面的例子中使用的是异步函数，那又会怎样呢？比如：

```javascript
function fooPromiseExecutor(resolve, reject) {
  setTimeout(reject, 1000, 'bar')
}
async function foo() {
  await new Promise(fooPromiseExecutor)
}
foo()
// Uncaught (in promise) bar
//   foo
//   asyncfunction(async)
//   foo
```

这样一改，栈追踪信息就准确地反映了当前的调用栈。`fooPromiseExecutor()`已经返回，所以它不在错误信息中。但 `foo()`此时被挂起了，并没有退出。JavaScript 运行时可以简单地在嵌套函数中存储指向包含函数的指针，就跟对待同步函数调用栈一样。这个指针实际上存储在内存中，可用于在出错时生成栈追踪信息。这样就不会像之前的例子那样带来额外的消耗，因此在重视性能的应用中是可以优先考虑的。
