# JavaScript 数据结构与算法

- 掌握 JS 内置的数据结构及背后的工作原理
- 依据内置数据结构自定义创建其他数据结构（链表、堆栈、队列、二叉搜索树、有限队列、堆、图形等）
- 理解不同数据结构的存在意义及背后工作原理
- 学会比较不同数据结构在进行操作的时间复杂度
- 掌握分析数据结构，优化数据结构的思考方式及实现过程
- 学会分析在开发环境中对数据结构的选择

## 基础知识

### 1. 什么是数据结构&为什么需要数据结构

数据结构是计算机存储、组织数据的方式，允许我们管理数据

不同的场景需要不同的数据结构

- 有序列表数据允许重复——Array
- 无序列表数据不允许重复——Set
- 无序数据键值对形式——Object
- 有序键值对可遍历数据——Map

### 2. 数组

- 保留插入顺序
- 通过索引访问元素
- 可遍历（for 循环）
- 大小（长度）动态调整
- 允许重复
- 删除和查找元素比较耗费性能

```javascript
const names = ['Summer', 'Henry', 'Lucy', 'Summer']

// 索引值从0开始
console.log(names[1])
console.log(names.length)

// for循环遍历
for (const name of names) {
  console.log(name)
}

// 添加元素
names.push('Lucy')
console.log(names.length)

// 查询元素
const lucyIndex = names.findIndex((name) => name === 'Lucy')
console.log(lucyIndex)

// 删除元素
names.splice(2, 1)
console.log(names)
```

### 3. 集合

- 无序（存储和读取顺序可能不一样）
- 通过方法访问和获取元素
- 可遍历（for 循坏）
- 大小（长度）动态调整
- 不允许重复（要求元素唯一）
- 删除和查找元素简单快捷

```javascript
const ids = new Set()

// 添加元素
ids.add('a')
ids.add(1)
ids.add('b')
ids.add(1)
// Set(3) {'a', 1, 'b'}

// 集合遍历元素
for (const id of ids) {
  console.log(id)
}

// 集合访问元素
console.log(ids.has('a')) // true

// 集合删除元素
ids.delete('b')
console.log(ids) // Set(2) {'a', 1}
console.log(ids[0]) // undefined
```

### 4. 数组 VS 集合

数组

- 总是使用数组
- 如果强调排序和元素重复，则必须使用

集合

- 仅在顺序无关紧要且仅要求唯一值时可用
- 与数组相比，可以简化数据访问（例如查找，删除）

### 5. 对象

- 无序的键值对数据
- 通过键（属性）访问元素
- 不可遍历（除了 for-in 循环）
- 键是唯一的，值不是
- 键必须是字符串，数字或符号
- 可以存储数据和 “函数”（方法）

```javascript
const person = {
  name: 'John',
  age: 33,
  hobbies: ['Sports', 'Music'],
  greeting() {
    console.log('Hello, I am ' + this.name)
  },
}

console.log(person[0]) // undefined
console.log(person['name'])
console.log(person.name)

// 添加属性
person.sex = 'male'
// 删除属性
delete person.age
console.log(person)

// 有方法，添加功能
person.greeting()
```

### 6. 映射

- 有序的键值对数据
- 通过键访问元素
- 可遍历（使用 for 循环）
- 键是唯一的，值不是
- 键可是各种类型的值（包括对象、数组）
- 纯数据存储，针对数据访问进行了优化

```javascript
const resultData = new Map()

// 添加键值对 set
resultData.set('average', 1.6)
resultData.set('lastResult', null)

const person = { name: 'John', age: 34 }

resultData.set(person, 1.24)

// for循环
for (const el of resultData) {
  console.log(el)
}

// key相同情况
resultData.set('average', 23)

// 获取或者访问值
console.log(resultData.get('lastResult'))
console.log(resultData.lastResult) //undefined

// 删除
console.log(resultData.delete('average'))

// 删除key为对象的时候
resultData.delete({ name: 'John', age: 34 })

console.log(resultData)
```

### 7. 对象&映射

对象

- 非常通用的构造和数据存储结构
- 如果添加额外的功能则必须使用

映射

- 专注于数据存储
- 与对象相比，可以简化数据访问

### 8. 弱映射&弱集合

集合和映射的变体 → 值和键仅 “弱引用” → 如果未在应用程序的其他任何地方使用，垃圾回收则可以删除值和键

## 自定义数据结构

### 链表

每一个元素都知道下一个元素

可以有效地调整大小并在列表的开头和结尾插入

```JavaScript

```
