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

#
