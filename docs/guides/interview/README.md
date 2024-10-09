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

// ③
let a = 1
let b = 2

let c = 3 - (a = b + 1) // 0
```

## ++ 运算符

```js
let i = 1
console.log(i++ + ++i)
console.log(i++ + ++i * ++i)
```

## 变量遮蔽

```js
var test = 'hello world'
;(function () {
  test = 'LBJhui'
  console.log(test)
})()
;(function test() {
  test = 'LBJhui'
  console.log(test)
})()
```

- 变量遮蔽：在函数内部引用时，会查找最近的作用域里的 test 的变量或函数，而不会查找外部作用域的。在这种情况下，函数 test 遮蔽了外部的 test 变量

- 函数的名称是只读的：函数的名称是只读的，所以不能在函数内部修改函数的名称。因此，函数内部 test = 'LBJhui' 这行代码其实是无效的

## 参数归一化

```js
formate(new Date(), 'date') // 2024-9-26
formate(new Date(), 'datetime') // 2024-9-26 15:5:33
formate(new Date(), 'date', true) // 2024-09-26
formate(new Date(), 'datetime', true) // 2024-09-26 15:05:33
formate(new Date(), 'yyyy年MM月dd日 HH:mm:ss:ms', true) // 2024年09月26日 15:06:15:880
formate(new Date(), (dateInfo) => {
  const { year } = dateInfo
  const thisYear = new Date().getFullYear()
  if (year < thisYear) {
    return `${thisYear - year}年前`
  } else if (year > thisYear) {
    return `${year - thisYear}年后`
  } else {
    return '今年'
  }
})
```

```js
function _formatNormalize(formatter) {
  if (typeof formatter === 'function') {
    return formatter
  }
  if (typeof formatter !== 'string') {
    throw new TypeError('formatter must be a function or string')
  }
  if (formatter === 'date') {
    formatter = 'yyyy-MM-dd'
  } else if (formatter === 'datetime') {
    formatter = 'yyyy-MM-dd HH:mm:ss'
  }
  return (dateInfo) => {
    const { yyyy, MM, dd, HH, mm, ss, ms } = dateInfo
    return formatter.replace('yyyy', yyyy).replace('MM', MM).replace('dd', dd).replace('HH', HH).replace('mm', mm).replace('ss', ss).replace('ms', ms)
  }
}
/**
 * 格式化一个日期
 * @param {Date} date 日期对象
 */
function formate(date, formatter, isPad = false) {
  formatter = _formatNormalize(formatter)
  const dateInfo = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),
  }
  dateInfo.yyyy = isPad ? dateInfo.year.toString().padStart(4, '0') : dateInfo.year
  dateInfo.MM = isPad ? dateInfo.month.toString().padStart(2, '0') : dateInfo.month
  dateInfo.dd = isPad ? dateInfo.date.toString().padStart(2, '0') : dateInfo.date
  dateInfo.HH = isPad ? dateInfo.hour.toString().padStart(2, '0') : dateInfo.hour
  dateInfo.mm = isPad ? dateInfo.minutes.toString().padStart(2, '0') : dateInfo.minutes
  dateInfo.ss = isPad ? dateInfo.seconds.toString().padStart(2, '0') : dateInfo.seconds
  dateInfo.ms = isPad ? dateInfo.milliseconds.toString().padStart(3, '0') : dateInfo.milliseconds
  return formatter(dateInfo)
}
```

## 以同步的方式实现事件监听

```js
function getElement(cssSelector) {
  // 请完成 getElement 函数，让后续的程序顺利执行
}

;(async () => {
  const btn = getElement('button')
  while (1) {
    await btn.waitClick
    console.log('按钮被点击了')
  }
})()
```

```js
function getElement(cssSelector) {
  const dom = document.querySelector(cssSelector)
  const proxy = new Proxy(dom, {
    get(target, key) {
      if (!key.startsWith('wait')) {
        return Reflect.get(target, key)
      }
      return new Promise((resolve) => {
        const eventName = key.replace('wait', '').toLowerCase()
        target.addEventListener(eventName, resolve, {
          once: true,
        })
      })
    },
  })
  return proxy
}
```

#
