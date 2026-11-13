# JSON 转换中的精度问题

因为 JavaScript 语言问题，数字大于 16 位后，会丢失 16 位以后的数字：比如声明 `let n = 1234567890123456789`;打印 n 之后会显示 1234567890123456800;

同理 `JSON.parse` 将 json 字符串转为 Object 时，如果其中有大数字的值，也会发生精度丢失问题。

语法

```javascript
JSON.parse(text)
/**
 * reviver 如果是函数，则规定了最初由解析产生的每个值在返回前的转换方式。不可调用的值将被忽略。
 */
JSON.parse(text, reviver)
```

```javascript
const json = `{
  "bigNumber": 1234567891234567891234567891323236565
}`

const obj = JSON.parse(json)
const bigObj = JSON.parse(json, (key, value, context) => {
  if (key === 'bigNumber') {
    // 忽略值，它已经损失了精度
    return BigInt(context.source)
  }
  return value
})

console.log(obj) // { bigNumber: 1.2345678912345678e+36 }
console.log(bigObj) // {bigNumber: 1234567891234567891234567891323236565n}
```
