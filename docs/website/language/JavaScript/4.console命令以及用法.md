# console 命令以及用法

## 一、显示信息

```javascript
console.log('text') // 日志的输出
console.info('信息') // 信息提示
console.error('错误') // 错误信息
console.warn('警告') // 警告信息

const foo = { id: 1, verified: true, color: 'green' }
const bar = { id: 2, verified: false, color: 'red' }
console.table({ foo, bar }) // 通过表格的形式进行展示
```

**对象时空固定术**

之前遇到过类似这样的问题：为什么我明明把 XX 改了，但是输出的时候它不是我想的那样（确保代码都正确）。

```javascript
let a = { b: { c: 1 } }
a.b.c = 2
console.log(a)
a.b.c = 3
```

当你打开 log 的时候你会发现 `c` 的值为 3。其实这个显示没太大问题，因为这种显示方式永远显示的是最新的对象数据。`console.log` 输出的是内存地址上的东西，打印一个对象/数组时，我们在控制台看到的是它的最终状态，而不是打印时的状态。如果你就想看到 `c` 改动为 2 时的对象，可以选择以下方式（对象时空固定术）：

```javascript
let a = { b: { c: 1 } }
a.b.c = 2
console.table(a)
console.log(JSON.stringify(a))
a.b.c = 3
```

此时你会发现输出符合了你的预期。

## 二、占位符

console 对象的五种方法都可以使用 printf 的风格的占位符，支持的占位符有：

字符（%s）、整数（%d 或%i）、浮点数（%f）和对象（%o）

```javascript
console.log('%d年%d月%d日', 2011, 3, 26)
console.log('圆周率是%f', 3.1415926)
```

## 三、信息分组

```javascript
console.group('第一组信息')
console.log('第一组第一条信息')
console.log('第一组第二条信息')
console.groupEnd() //第一组信息结束；可以开始第二条
console.group('第二组信息')
console.log('第二组第一条信息')
console.log('第二组第二条信息')
console.groupEnd() //第二组信息结束
```

`group()` - 添加 1 个分组。`groupCollapsed()` - 类似于`group()`，但分组开始时处于折叠状态。`groupEnd()` - 结束当前分组

## 四、查看对象的属性和方法

```javascript
var info = {
  name: 'Bob',
  age: 23,
  message: '今年大学毕业'
}
console.dir(info)
```

## 五、显示某个节点的内容

```javascript
var table = document.getElementById('table1')
console.dirxml(table)
```

## 六、判断变量是否是真

console.assert()用来判断一个表达式或变量是否为真。如果结果为否，则在控制台输出一条相应信息，并且抛出一个异常。

```javascript
var result = 1
console.assert(result)
var year = 2018
console.assert(year == 2015)
var year = 2018
console.assert(year == 2018)
```

## 七、追踪函数的调用轨迹

```javascript
/*函数是如何被调用的，在其中加入console.trace()方法就可以了*/
function add(a, b) {
  console.trace()
  return a + b
}
var x = add3(1, 1)
function add3(a, b) {
  return add2(a, b)
}
function add2(a, b) {
  return add1(a, b)
}
function add1(a, b) {
  return add(a, b)
}
```

## 八、计时功能

```javascript
console.time('控制台计时器') //计时开始
for (var i = 0; i < 1000; i++) {
  for (var j = 0; j < 1000; j++) {}
  console.timeLog('时间记录')
}
console.timeEnd('控制台计时器') //计时结束
```

## 九、性能分析

```javascript
function Foo() {
  for (var i = 0; i < 10; i++) {
    funcA(1000)
  }
  funcB(10000)
}
function funcA(count) {
  for (var i = 0; i < count; i++) {}
}
function funcB(count) {
  for (var i = 0; i < count; i++) {}
}

console.profile('性能分析器一')
Foo()
console.profileEnd()
```

结束后，在浏览器性能面板查看

## 十、统计代码被执行的次数

```javascript
function myFunction() {
  console.count('myFunction被执行的次数')
}
myFunction()
myFunction()
myFunction()
```

## 十一、查看当前的堆的使用情况

如果你发现性能问题很难分析，可能还要考虑是否有内存泄露，你可以使用 console.memory（注意 memory 是 console 的属性，不是函数），来查看当前的堆的使用情况。

```javascript
console.memory
```

## 十二、清空

```javascript
console.clear()
```
