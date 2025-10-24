# JavaScript 模块化规范

## 1. 模块化概念

### 1.1 什么是模块化

- 将程序文件依据一定规则拆分成多个文件，这种编码方式就是**模块化**的编码方式
- 拆分出来**每个文件就是一个模块**，模块中的数据都是**私有的**，模块之间互相**隔离**
- 同时也能通过一些手段，可以把模块内的指定数据**“交出去”**，供其他模块使用

### 1.2 为什么需要模块化？

随着应用的复杂度越来越高，其代码量和文件数量都会急剧增加，会逐渐引发以下问题：

1. 全局污染问题
2. 依赖混乱问题
3. 数据安全问题

## 2. 有哪些模块化规范？

随着时间的推移，针对 JavaScript 的不同运行环境，相继出现了多种模块化规范，按时间排序，分别为：

1. CommonJS——服务端应用广泛
2. AMD
3. CMD
4. ES6 模块化——浏览器端应用广泛

## 3. 导入与导出的概念

模块化的核心思想就是：模块之间是**隔离的**，通过**导入**和**导出**进行数据和功能的共享

- **导出**：模块公开其内部的一部分（如变量、函数等），使这些内容可以被其他模块使用
- **导入**：模块引用和使用其他模块导出的内容，以重用代码和功能

## 4. CommonJS

### 导出数据

在 CommonJS 标准中，导出数据有**两种方式**：

- `module.exports=value`
- `exports.xxx=value`

**注意点如下：**

1. 每个模块内部的 `this`、`exports`、`module.exports` 在初始时，都指向**同一个**空对象，该空对象就是当前模块导出的数据

```mermaid
graph LR
A[this ] --> B[{}]
C[exports]--> B
D[module.exports]--> B
```

2. 无论如何修改对象，最终导出的都是 `module.exports` 的值。
3. `exports` 是对 `module.exports` 的初始引用，仅为了方便给导出对象添加属性，所以不能使用 `exports=value` 的形式导出数据，但是可以使用 `module.exports=value` 导出数据。

### 导入数据

在 CommonJS 模块化标准中，使用内置的 `require` 函数进行导入数据。

### 扩展理解

一个 JS 模块在执行时，是被包裹在一个**内置函数**中执行的，所以每个模块都有自己的作用域，我们可以通过如下方式验证这一说法：

```javascript
console.log(arguments)
console.log(arguments.callee.toString())
```

### 在浏览器端运行

Node.js 默认是支持 CommonJS 规范的，但浏览器端不支持，所以需要经过编译，步骤如下：

第一步：全局安装 browserify：`npm install -g browserify`

第二步：编译 `browserify index.js -o bundle.js`

备注： `index.js` 是源文件,`-o` 表示输出文件，`bundle.js` 表示输出文件名。

第三步：页面中引入使用。

## 5. ES6 模块化规范

### 导出数据

ES6 模块化提供 3 种导出方式：① 分别导出 ② 统一导出 ③ 默认导出

### 导入数据

1. 导入全部
2. 命名导入
3. 默认导入
4. 命名导入与默认导入可以混合使用
5. 动态导入
6. import 可以不接收任何数据

### 数据引用问题

```javascript
function count() {
  let sum = 1
  function increment() {
    sum += 1
  }
  return { increment, sum }
}

const { increment, sum } = count()
console.log(sum)
increment()
increment()
console.log(sum)
```

```javascript
// index.js
const { increment, sum } = require('./data.js')
console.log(sum)
increment()
increment()
console.log(sum)

// data.js
let sum = 1
function increment() {
  sum += 1
}
module.exports = { increment, sum }
```

```javascript
// index.js
import { increment, sum } from './data.js'
console.log(sum)
increment()
increment()
console.log(sum)

// data.js
let sum = 1
function increment() {
  sum += 1
}
exports { increment, sum }
```

## 6. AMD

`require.js`

## 7. CMD
