# 零碎的面试题

## 连续赋值

```js
// ①
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }
console.log(a.x) // undefined
console.log(b.x) // { n: 2 }

// ②
;(function () {
  var a = (b = 5)
})()
console.log(a) // a is not defined
console.log(b) // 5
```

## ++ 运算符

```js
let i = 1
console.log(i++ + ++i)
console.log(i++ + ++i * ++i)
```

#
