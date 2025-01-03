# 第 23 章 JSON

## 23.1 语法

JSON 语法支持表示 3 种类型的值。

❑ 简单值：字符串、数值、布尔值和 null 可以在 JSON 中出现，就像在 JavaScript 中一样。特殊值 undefined 不可以。<br />
❑ 对象：第一种复杂数据类型，对象表示有序键/值对。每个值可以是简单值，也可以是复杂类型。<br />
❑ 数组：第二种复杂数据类型，数组表示可以通过数值索引访问的值的有序列表。数组的值可以是任意类型，包括简单值、对象，甚至其他数组。

### 23.1.1 简单值

最简单的 JSON 可以是一个数值，也可以是一个字符串，JavaScript 字符串与 JSON 字符串的主要区别是，JSON 字符串必须使用双引号（单引号会导致语法错误）​。布尔值和 null 本身也是有效的 JSON 值。

### 23.1.2 对象

JSON 中的对象必须使用双引号把属性名包围起来。

与 JavaScript 对象字面量相比，JSON 主要有两处不同。首先，没有变量声明（JSON 中没有变量）​。其次，最后没有分号（不需要，因为不是 JavaScript 语句）​。同样，用引号将属性名包围起来才是有效的 JSON。属性的值可以是简单值或复杂数据类型值，后者可以在对象中再嵌入对象。

### 23.1.3 数组

## 23.2 解析与序列化

### 23.2.1 JSON 对象

JSON 对象有两个方法：`stringify()`和 `parse()`。在简单的情况下，这两个方法分别可以将 JavaScript 序列化为 JSON 字符串，以及将 JSON 解析为原生 JavaScript 值。

在序列化 JavaScript 对象时，所有函数和原型成员都会有意地在结果中省略。此外，值为 `undefined` 的任何属性也会被跳过。最终得到的就是所有实例属性均为有效 JSON 数据类型的表示。

### 23.2.2 序列化选项

`JSON.stringify()`方法除了要序列化的对象，还可以接收两个参数。这两个参数可以用于指定其他序列化 JavaScript 对象的方式。第一个参数是过滤器，可以是数组或函数；第二个参数是用于缩进结果 JSON 字符串的选项。

#### 1．过滤结果

如果第二个参数是一个数组，那么 `JSON.stringify()`返回的结果只会包含该数组中列出的对象属性。

```javascript
let book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas', 'Matt Frisbie'],
  edition: 4,
  year: 2017
}
let jsonText = JSON.stringify(book, ['title', 'edition']) // '{"title":"Professional JavaScript","edition":4}'
```

如果第二个参数是一个函数，则行为又有不同。提供的函数接收两个参数：属性名（key）和属性值（value）​。

```javascript
let book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas', 'Matt Frisbie'],
  edition: 4,
  year: 2017
}
let jsonText = JSON.stringify(book, (key, value) => {
  switch (key) {
    case 'authors':
      return value.join(',')
    case 'year':
      return 5000
    case 'edition':
      return undefined
    default:
      return value
  }
})
// '{"title":"Professional JavaScript","authors":"Nicholas C. Zakas,Matt Frisbie","year":5000}'
```

#### 2．字符串缩进

`JSON.stringify()`方法的第三个参数控制缩进和空格。在这个参数是数值时，表示每一级缩进的空格数。

```javascript
let book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas', 'Matt Frisbie'],
  edition: 4,
  year: 2017
}
let jsonText = JSON.stringify(book, null, 4)
// '{\n' +
//   '    "title": "Professional JavaScript",\n' +
//   '    "authors": [\n' +
//   '        "Nicholas C. Zakas",\n' +
//   '        "Matt Frisbie"\n' +
//   '    ],\n' +
//   '    "edition": 4,\n' +
//   '    "year": 2017\n' +
//   '}'
```

注意，除了缩进，`JSON.stringify()`方法还为方便阅读插入了换行符。这个行为对于所有有效的缩进参数都会发生。​（只缩进不换行也没什么用。​）最大缩进值为 10，大于 10 的值会自动设置为 10。

如果缩进参数是一个字符串而非数值，那么 JSON 字符串中就会使用这个字符串而不是空格来缩进。使用字符串时同样有 10 个字符的长度限制。如果字符串长度超过 10，则会在第 10 个字符处截断。

#### 3．toJSON()方法

```javascript
let book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas', 'Matt Frisbie'],
  edition: 4,
  year: 2017,
  toJSON: function () {
    return this.title
  }
}
let jsonText = JSON.stringify(book) // '"Professional JavaScript"'
```

`toJSON()`方法可以与过滤函数一起使用，因此理解不同序列化流程的顺序非常重要。在把对象传给 `JSON.stringify()`时会执行如下步骤。

（1）如果可以获取实际的值，则调用 toJSON()方法获取实际的值，否则使用默认的序列化。<br />
（2）如果提供了第二个参数，则应用过滤。传入过滤函数的值就是第（1）步返回的值。<br />
（3）第（2）步返回的每个值都会相应地进行序列化。<br />
（4）如果提供了第三个参数，则相应地进行缩进。

### 23.2.3 解析选项

`JSON.parse()`方法也可以接收一个额外的参数，这个函数会针对每个键/值对都调用一次。为区别于传给 `JSON.stringify()`的起过滤作用的替代函数（replacer）​，这个函数被称为还原函数（reviver）​。实际上它们的格式完全一样，即还原函数也接收两个参数，属性名（key）和属性值（value）​，另外也需要返回值。

如果还原函数返回 `undefined`，则结果中就会删除相应的键。如果返回了其他任何值，则该值就会成为相应键的值插入到结果中。

```javascript
let book = {
  title: 'Professional JavaScript',
  authors: ['Nicholas C. Zakas', 'Matt Frisbie'],
  edition: 4,
  year: 2017,
  releaseDate: new Date(2017, 11, 1)
}
let jsonText = JSON.stringify(book)
let bookCopy = JSON.parse(jsonText, (key, value) => (key == 'releaseDate' ? new Date(value) : value))
console.log(bookCopy.releaseDate.getFullYear()) // 2017
```
