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
  }
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

#### 链表构造函数 & append 方法

```javascript
class LinkedList {
  constructor() {
    this.head = null // 链表中第一个节点
    this.tail = null // 链表中最后一个节点
  }

  // append 追加节点(末尾添加)
  append(value) {
    const newNode = { value: value, next: null }
    if (this.tail) {
      this.tail.next = newNode
    }
    this.tail = newNode
    if (!this.head) {
      this.head = newNode
    }
  }
}

const linkedList1 = new LinkedList()
```

#### 创建输出链表的方法

```javascript
// 以数组方式输出节点
toArray() {
  const elements = []
  let curNode = this.head
  while (curNode) {
    elements.push(curNode)
    curNode = curNode.next
  }
  return elements
}
```

#### prepend 方法

```javascript
// prepend 前置节点（头部添加）
prepend(value) {
  const newNode = { value: value, next: this.head }
  this.head = newNode
  if (!this.tail) {
    this.tail = newNode
  }
}
```

#### delete 方法

```javascript
// delete 删除节点
delete(value) {
  if (!this.head) {
    return
  }
  while (this.head && this.head.value === value) {
    this.head = this.head.next
  }
  let curNode = this.head
  while (curNode.next) {
    if (curNode.next.value === value) {
      curNode.next = curNode.next.next
    } else {
      curNode = curNode.next
    }
  }
  if (this.tail.value === value) {
    this.tail = curNode
  }
}
```

#### find & insertAfter 方法

```javascript
// find 节点查询
find(value) {
  if (!this.head) {
    return null
  }

  let curNode = this.head
  while (curNode) {
    if (curNode.value === value) {
      return curNode
    }
    curNode = curNode.next
  }
  return null
}

// insertAfter 某个节点后面插入
insertAfter(value, afterValue) {
  const existingNode = this.find(afterValue)
  if (existingNode) {
    const newNode = { value: value, next: existingNode.next }
    existingNode.next = newNode
  }
}
```

**总结**

```javascript
class LinkedList {
  constructor() {
    this.head = null // 链表中第一个节点
    this.tail = null // 链表中最后一个节点
  }

  // append 追加节点(末尾添加)
  append(value) {
    const newNode = { value: value, next: null }
    if (this.tail) {
      this.tail.next = newNode
    }
    this.tail = newNode
    if (!this.head) {
      this.head = newNode
    }
  }

  // prepend 前置节点（头部添加）
  prepend(value) {
    const newNode = { value: value, next: this.head }
    this.head = newNode
    if (!this.tail) {
      this.tail = newNode
    }
  }

  // find 节点查询
  find(value) {
    if (!this.head) {
      return null
    }

    let curNode = this.head
    while (curNode) {
      if (curNode.value === value) {
        return curNode
      }
      curNode = curNode.next
    }
    return null
  }

  // insertAfter 某个节点后面插入
  insertAfter(value, afterValue) {
    const existingNode = this.find(afterValue)
    if (existingNode) {
      const newNode = { value: value, next: existingNode.next }
      existingNode.next = newNode
    }
  }

  // delete 删除节点
  delete(value) {
    if (!this.head) {
      return
    }
    while (this.head && this.head.value === value) {
      this.head = this.head.next
    }
    let curNode = this.head
    while (curNode.next) {
      if (curNode.next.value === value) {
        curNode.next = curNode.next.next
      } else {
        curNode = curNode.next
      }
    }
    if (this.tail.value === value) {
      this.tail = curNode
    }
  }

  // 以数组方式输出节点
  toArray() {
    const elements = []
    let curNode = this.head
    while (curNode) {
      elements.push(curNode)
      curNode = curNode.next
    }
    return elements
  }
}

const linkedList1 = new LinkedList()

linkedList1.append(1)
linkedList1.append('Summer')
linkedList1.append('Summer')
linkedList1.append('Hello')
linkedList1.append(5)
linkedList1.append(true)
linkedList1.prepend('第一个元素')
linkedList1.prepend('第一个元素')

console.log(linkedList1.toArray())

linkedList1.delete('Summer')
linkedList1.delete('第一个元素')
linkedList1.delete(5)

console.log(linkedList1.toArray())
console.log(linkedList1.find('Summer'))
console.log(linkedList1.find(true))
```

#### 为什么需要链表

历史上（对于其他编程语言），主要原因是内存管理：不必事先指定（占用）的大小

如今，JavaScript 具有动态数组（内置动态调整大小），而内存并不是 JavaScript 应用程序中的主要问题

如果在列表的开头进行高频插入操作，那链表会很有用——链表比数组操作更快

#### 衡量性能（时间复杂度——大 O 符号）

表示代码执行时间的增长变化趋势

#### 链表时间复杂度 & 数组

|          |   链表（Linked List）    | 数组（Arrays） |
| :------: | :----------------------: | :------------: |
| 元素访问 |           O(n)           |      O(1)      |
| 末尾插入 | 尾部：O(1)，非尾部：O(n) |      O(1)      |
| 头部插入 |           O(1)           |      O(n)      |
| 中间插入 |     搜索时间 + O(1)      |      O(n)      |
| 元素搜索 |           O(n)           |      O(n)      |

### 列表和表格

什么是列表和表格数据结构

栈 & 队列

哈希表

#### 什么是“列表和表格结构”

列表（Lists）——值的集合，例如：数组，集合，链表；适合存储通过位置（通过索引或搜索）检索的值，也适合循环

表格（Tables）——键值对的集合，例如：对象，映射；适合存储通过键检索的值，不关注循环

#### 内置表格和列表

```javascript
// 列表结构——数组
const shoppingList = ['Apple', 'Banana', 'Orange']

const thirdItem = shoppingList[2]

for (const item of shoppingList) {
  // 得到每一项采购的水果名称
}

// 表格结构——对象
const citizens = {
  123: {
    name: 'summer',
    age: 26,
    sex: 'female',
    address: 'xxxx',
    birthdate: 'xxx'
  },
  456: {}
}

const summerData = citizens['123'] // ==> summer相关的信息
```

#### 列表

##### 堆栈

列表——堆栈（Stack）：简化的数组，后进先出（Last In First Out，LIFO）

###### 自定义堆栈结构（数组）

```javascript
class Stack {
  constructor() {
    this.items = []
  }

  push(value) {
    this.items.push(value)
  }

  pop() {
    return this.items.pop()
  }

  isEmpty() {
    return this.items.length === 0
  }

  toArray() {
    return this.items.slice()
  }
}

const stack = new Stack()

stack.push('关冰箱门！')
stack.push('推入大象')
stack.push('开冰箱门！')

console.log(stack.toArray())

console.log(stack.pop())
console.log(stack.toArray())
console.log(stack.pop())
console.log(stack.toArray())
console.log(stack.pop())
console.log(stack.toArray())
```

###### 自定义堆栈结构（链表）

```javascript
import { LinkedList } from './linked-list.js'

class Stack {
  constructor() {
    this.list = new LinkedList()
  }

  push(value) {
    this.list.prepend(value)
  }

  pop() {
    return this.list.deleteHead()
  }

  isEmpty() {
    return !this.list.head
  }

  toArray() {
    return this.list.toArray()
  }
}
```

```javascript
// linked-list.js
export class LinkedList {
  constructor() {
    this.head = null // 链表中第一个节点
    this.tail = null // 链表中最后一个节点
  }

  // append 追加节点(末尾添加)
  append(value) {
    const newNode = { value: value, next: null }
    if (this.tail) {
      this.tail.next = newNode
    }
    this.tail = newNode
    if (!this.head) {
      this.head = newNode
    }
  }

  // prepend 前置节点（头部添加）
  prepend(value) {
    const newNode = { value: value, next: this.head }
    this.head = newNode
    if (!this.tail) {
      this.tail = newNode
    }
  }

  // find 节点查询
  find(value) {
    if (!this.head) {
      return null
    }

    let curNode = this.head
    while (curNode) {
      if (curNode.value === value) {
        return curNode
      }
      curNode = curNode.next
    }
    return null
  }

  // insertAfter 某个节点后面插入
  insertAfter(value, afterValue) {
    const existingNode = this.find(afterValue)
    if (existingNode) {
      const newNode = { value: value, next: existingNode.next }
      existingNode.next = newNode
    }
  }

  // delete 删除节点
  delete(value) {
    if (!this.head) {
      return
    }
    while (this.head && this.head.value === value) {
      this.head = this.head.next
    }
    let curNode = this.head
    while (curNode.next) {
      if (curNode.next.value === value) {
        curNode.next = curNode.next.next
      } else {
        curNode = curNode.next
      }
    }
    if (this.tail.value === value) {
      this.tail = curNode
    }
  }

  // 删除头部节点
  deleteHead() {
    if (!this.head) {
      return null
    }
    const deleteHead = this.head
    if (this.head.next) {
      this.head = this.head.next
    } else {
      this.head = null
      this.tail = null
    }

    return deleteHead
  }

  // 以数组方式输出节点
  toArray() {
    const elements = []
    let curNode = this.head
    while (curNode) {
      elements.push(curNode)
      curNode = curNode.next
    }
    return elements
  }
}
```

###### 堆栈时间复杂度 & 数组

|          |     堆栈（Stacks）     | 数组（Arrays） |
| :------: | :--------------------: | :------------: |
| 元素访问 | O(1)仅限于 “栈顶元素”  |      O(1)      |
| 末尾插入 |          O(1)          |      O(1)      |
| 头部插入 | O(n) 会导致 “数据丢失” |      O(n)      |
| 中间插入 | O(n) 会导致 “数据丢失” |      O(n)      |
| 元素搜索 | O(n) 会导致 “数据丢失” |      O(n)      |

##### 队列

简化的数组，先进先出（First In First Out，FIFO）

###### 自定义队列结构（数组实现）

```javascript
class Queue {
  constructor() {
    this.items = []
  }

  enqueue(value) {
    this.items.unshift(value)
  }

  dequeue() {
    return this.items.pop()
  }

  isEmpty() {
    return this.items.length === 0
  }

  toArray() {
    return this.items.slice()
  }
}

const queue = new Queue()

queue.enqueue('第1号')
queue.enqueue('第2号')
queue.enqueue('第3号')

console.log(queue.toArray())

console.log(queue.dequeue())
console.log(queue.toArray())
console.log(queue.dequeue())
console.log(queue.toArray())
console.log(queue.dequeue())
console.log(queue.toArray())
```

###### 自定义队列结构（链表实现）

```javascript
import { LinkedList } from './linked-list.js'

class Queue {
  constructor() {
    this.list = new LinkedList()
  }

  enqueue(value) {
    this.list.append(value)
  }

  dequeue() {
    return this.list.deleteHead()
  }

  isEmpty() {
    return !this.list.head
  }

  toArray() {
    return this.list.toArray()
  }
}
```

```javascript
// linked - list.js
export class LinkedList {
  constructor() {
    this.head = null // 链表中第一个节点
    this.tail = null // 链表中最后一个节点
  }

  // append 追加节点(末尾添加)
  append(value) {
    const newNode = { value: value, next: null }
    if (this.tail) {
      this.tail.next = newNode
    }
    this.tail = newNode
    if (!this.head) {
      this.head = newNode
    }
  }

  // prepend 前置节点（头部添加）
  prepend(value) {
    const newNode = { value: value, next: this.head }
    this.head = newNode
    if (!this.tail) {
      this.tail = newNode
    }
  }

  // find 节点查询
  find(value) {
    if (!this.head) {
      return null
    }

    let curNode = this.head
    while (curNode) {
      if (curNode.value === value) {
        return curNode
      }
      curNode = curNode.next
    }
    return null
  }

  // insertAfter 某个节点后面插入
  insertAfter(value, afterValue) {
    const existingNode = this.find(afterValue)
    if (existingNode) {
      const newNode = { value: value, next: existingNode.next }
      existingNode.next = newNode
    }
  }

  // delete 删除节点
  delete(value) {
    if (!this.head) {
      return
    }
    while (this.head && this.head.value === value) {
      this.head = this.head.next
    }
    let curNode = this.head
    while (curNode.next) {
      if (curNode.next.value === value) {
        curNode.next = curNode.next.next
      } else {
        curNode = curNode.next
      }
    }
    if (this.tail.value === value) {
      this.tail = curNode
    }
  }

  // 删除头部节点
  deleteHead() {
    if (!this.head) {
      return null
    }
    const deleteHead = this.head
    if (this.head.next) {
      this.head = this.head.next
    } else {
      this.head = null
      this.tail = null
    }

    return deleteHead
  }

  // 以数组方式输出节点
  toArray() {
    const elements = []
    let curNode = this.head
    while (curNode) {
      elements.push(curNode)
      curNode = curNode.next
    }
    return elements
  }
}
```

###### lesson-26: 队列时间复杂度 & 数组

|          |     队列（Queues）     | 数组（Arrays） |
| :------: | :--------------------: | :------------: |
| 元素访问 | O(1) 仅限 “第一个元素  |      O(1)      |
| 末尾插入 | O(n) 会导致 “数据丢失” |      O(1)      |
| 头部插入 |          O(1)          |      O(n)      |
| 中间插入 | O(n) 会导致 “数据丢失” |      O(n)      |
| 元素搜索 | O(n) 会导致 “数据丢失” |      O(n)      |

#### 表格——哈希表

##### 为什么需要表格

现有的 JavaScript “对象” 都是基于哈希表实现的

JS 中不需要自己创建哈希表

```javascript
const words = 'ehehlloworld'

// 双重for循环
// function findFirst(str) {
//   for (let i = 0; i < str.length; i++) {
//     for (let j = i + 1; j < str.length; j++) {
//       if (str[i] === str[j]) {
//         return str[i]
//       }
//     }
//   }
// }
// 大O符号：O(n^2)
// console.log(findFirst(words))

// 通过对象（哈希表）
function findFirstRep(str) {
  const table = {}
  for (const word of str) {
    if (table[word]) {
      return word
    }
    table[word] = 1
  }
}

// 大O符号：O(n)
console.log(findFirstRep(words))
```

##### 自定义简单的哈希表

```javascript
class HashTable {
  constructor() {
    this.size = 1000
    this.buckets = Array(1000).fill(null)
  }

  hash(key) {
    let hash = 0
    for (const char of key) {
      hash += char.charCodeAt(0)
    }
    return hash % this.size
  }

  set(key, value) {
    const keyHash = this.hash(key)
    this.buckets[keyHash] = value
  }

  get(key) {
    const keyHash = this.hash(key)
    return this.buckets[keyHash]
  }
}

const words = 'helloworld'
function findFirstRep(str) {
  const table = new HashTable()
  for (const word of str) {
    if (table.get(word)) {
      return word
    }
    table.set(word, 1)
  }
}

console.log(findFirstRep(words))
```

##### 哈希碰撞

```javascript
class HashTable {
  constructor() {
    this.size = 16
    this.buckets = Array(16).fill(null)
  }

  hash(key) {
    let hash = 0
    for (const char of key) {
      hash += char.charCodeAt(0)
    }
    return hash % this.size
  }

  set(key, value) {
    const keyHash = this.hash(key)
    this.buckets[keyHash] = value
  }

  get(key) {
    const keyHash = this.hash(key)
    return this.buckets[keyHash]
  }

  showInfo() {
    for (const key in this.buckets) {
      if (this.buckets[key] !== null) {
        console.log(key, this.buckets[key])
      }
    }
  }
}

const table = new HashTable()

for (const char of 'abcde') {
  table.set(char, char)
}

for (const char of 'fghijk') {
  table.set(char, char)
}

for (const char of 'lmnopq') {
  table.set(char, char)
}

console.log(table.showInfo())
```

##### 哈希碰撞——链地址法

```javascript
class HashTable {
  constructor() {
    this.size = 16
    this.buckets = Array(16)
      .fill(null)
      .map(() => [])
  }

  hash(key) {
    let hash = 0
    for (const char of key) {
      hash += char.charCodeAt(0)
    }
    return hash % this.size
  }

  set(key, value) {
    const keyHash = this.hash(key)
    const bucketArray = this.buckets[keyHash]
    const storedElment = bucketArray.find((element) => {
      return element.key === key
    })
    if (storedElment) {
      storedElment.val = value
    } else {
      bucketArray.push({ key: key, val: value })
    }
  }

  get(key) {
    const keyHash = this.hash(key)
    const bucketArray = this.buckets[keyHash]
    const storedElment = bucketArray.find((element) => {
      return element.key === key
    })
    return storedElment
  }

  showInfo() {
    for (const key in this.buckets) {
      if (this.buckets[key] !== null) {
        console.log(key, this.buckets[key])
      }
    }
  }
}
```

##### 哈希碰撞——开放地址法

```javascript
class HashTable {
  constructor() {
    this.size = 100
    this.buckets = Array(100).fill(null)
  }

  hash(key) {
    let hash = 0
    for (const char of key) {
      hash += char.charCodeAt(0)
    }
    return hash % this.size
  }

  set(key, value) {
    let keyHash = this.hash(key)
    if (this.buckets[keyHash] === null || this.buckets[keyHash].key === key) {
      this.buckets[keyHash] = { key: key, val: value }
    } else {
      while (this.buckets[keyHash] !== null) {
        keyHash++
      }
      this.buckets[keyHash] = { key: key, val: value }
    }
  }

  get(key) {
    const keyHash = this.hash(key)
    for (let i = keyHash; i < this.buckets.length; i++) {
      if (!this.buckets[i]) {
        continue
      }
      if (this.buckets[i].key === key) {
        return this.buckets[i].value
      }
    }
    return undefined
  }

  showInfo() {
    for (const key in this.buckets) {
      if (this.buckets[key] !== null) {
        console.log(key, this.buckets[key])
      }
    }
  }
}
```

##### lesson-31: 哈希表时间复杂度 & 数组 & 对象

|          |    哈希表（Hash Table）     | 数组（Arrays） | 对象（Objects） |
| :------: | :-------------------------: | :------------: | :-------------: |
| 元素访问 | 理论上 O(1) / 哈希碰撞 O(n) |      O(1)      |      O(1)       |
| 末尾插入 | 理论上 O(1) / 哈希碰撞 O(n) |      O(1)      |      O(1)       |
| 头部插入 | 理论上 O(1) / 哈希碰撞 O(n) |      O(n)      |      O(1)       |
| 中间插入 | 理论上 O(1) / 哈希碰撞 O(n) |      O(n)      |      O(1)       |
| 元素搜索 | 理论上 O(1) / 哈希碰撞 O(n) |      O(n)      |      O(1)       |

### 树

- 什么是树形结构
- 二叉搜索树 & AVL 树
- 字典树

#### 什么是树形结构

树形结构指的是数据元素之间存在着 “一对多” 的树形关系的数据结构，是一类重要的非线性数据结构。（没有周期，没有循环）

- 结点/顶点：包含值的结构（树中的数据元素）
- 边：连接两个结点
- 根结点：树中最上面的结点
- 子树：嵌套树/子树的根结点不是主树的根结点，子树就是树的其中一个节点以及其下面的所有的结点所构成的树
- 树叶：没有任何子结点的结点（即没有子树，树的尽头）
- 路径：连接两个结点的一系列结点和边
- 距离：两个结点之间的边数
- 父结点/子结点：两个直接连接的结点，父结点在子结点之上
- 祖先/后裔：通过多个父子路径连接的两个结点
- 兄弟：具有相同父亲的结点称为兄弟
- 结点的度：结点所拥有的子树的个数称之为结点的度
- 结点的层次：从根结点到树中某结点所经路径上的分支树称为该结点的层次（根结点层次为 0）
- 树的深度：树中结点的最大层次数（垂直空间）
- 树的广度：树的叶子数（水平空间）
- 大小：树中的结点总数

#### 代码实现基础的树形结构

```javascript
class Node {
  constructor(value, parentNode = null) {
    this.children = []
    this.value = value
    this.parent = parentNode
  }

  addNode(value) {
    const node = new Node(value, this)
    this.children.push(node)
    return { node: node, index: this.children.length - 1 }
  }

  removeNode(index) {
    this.children.splice(index, 1)
  }
}

class Tree {
  constructor(rootValue) {
    this.root = new Node(rootValue)
  }
}

const filesystem = new Tree('/')
const pagesDocumentNode = filesystem.root.addNode('/pages文稿')
const deskTopNode = filesystem.root.addNode('/桌面')

pagesDocumentNode.node.addNode('/学习')
pagesDocumentNode.node.addNode('/工作')
deskTopNode.node.addNode('数据结构.key')

console.log(filesystem)
```

#### 递归实现文件树

```javascript
class Node {
  constructor(value, parentNode = null) {
    this.children = []
    this.value = value
    this.parent = parentNode
  }

  addNode(value) {
    const segments = value.split('/')
    if (segments.length === 0) {
      return
    }
    if (segments.length === 1) {
      const node = new Node(value, this)
      this.children.push(node)
      return { node: node, index: this.children.length - 1 }
    }

    const existingChildNode = this.children.find((child) => child.value === segments[0])

    if (existingChildNode) {
      existingChildNode.addNode(segments.slice(1).join('/'))
    } else {
      const node = new Node(segments[0], this)
      node.addNode(segments.slice(1).join('/'))
      this.children.push(node)
      return { node: node, index: this.children.length - 1 }
    }
  }

  removeNode(value) {
    const segments = value.split('/')
    if (segments.length === 0) {
      return
    }
    if (segments.length === 1) {
      const existingChildNode = this.children.findIndex((child) => child.value === segments[0])
      if (existingChildNode < 0) {
        throw new Error('无法找到匹配的值！')
      }
      this.children.splice(existingChildNode, 1)
    }
    if (segments.length > 1) {
      const existingChildNode = this.children.find((child) => child.value === segments[0])
      if (!existingChildNode) {
        throw new Error('无法找到匹配的路径！路径为：' + segments[0])
      }
      existingChildNode.removeNode(segments.slice(1).join('/'))
    }
  }
}

class Tree {
  constructor(rootValue) {
    this.root = new Node(rootValue)
  }
  add(path) {
    this.root.addNode(path)
  }
  remove(path) {
    this.root.removeNode(path)
  }
}

const filesystem = new Tree('/')
filesystem.add('pages文稿/学习/前端学习路线.pdf')
filesystem.add('pages文稿/工作/code.js')
filesystem.add('下载/ps.dmg/ps.exe')
filesystem.add('下载/ps.dmg/ps.txt')
filesystem.remove('pages文稿/工作/code.js')
filesystem.remove('下载/ps.dmg/ps.txt')

console.log(filesystem)
```

#### 树形结构时间复杂度 & 数组

|           |  树（Tree）   |     数组（Arrays）     |
| :-------: | :-----------: | :--------------------: |
| 访问/搜索 | 最差情况 O(n) | 有索引：O(1)/搜索 O(n) |
|   插入    | 最差情况 O(n) |  末尾 O(1)/头部 O(n)   |
|   清除    | 最差情况 O(n) |  末尾 O(1)/头部 O(n)   |

#### 遍历树形结构

深度优先（DFS）：从根结点开始挖掘树并逐步探索同级树

广度优先（BFS）：在深入挖掘树之前，先查找所有同级值

```javascript
class Node {
  constructor(value, parentNode = null) {
    this.children = []
    this.value = value
    this.parent = parentNode
  }

  //深度优先搜索
  findDFS(value) {
    console.log(this)
    for (const child of this.children) {
      if (child.value === value) {
        return child
      }
      const nestedChildNode = child.find(value)
      if (nestedChildNode) {
        return nestedChildNode
      }
    }
  }
  //广度优先搜索
  findBFS(value) {
    console.log(this)
    for (const child of this.children) {
      if (child.value === value) {
        return child
      }
    }
    for (const child of this.children) {
      const nestedChildNode = child.find(value)
      if (nestedChildNode) {
        return nestedChildNode
      }
    }
  }
}

class Tree {
  constructor(rootValue) {
    this.root = new Node(rootValue)
  }
  findDFS(value) {
    if (this.root.value === value) {
      return this.root
    }
    return this.root.findDFS(value)
  }
  findBFS(value) {
    if (this.root.value === value) {
      return this.root
    }
    return this.root.findBFS(value)
  }
}
```

#### 二叉搜索树(Binary Search Tree)

```javascript
class Node {
  constructor(value) {
    this.value = value
    this.right = null
    this.left = null
    this.parent = null
  }

  add(value) {
    if (this.value === null) {
      this.value = value
      return
    }
    if (this.value < value) {
      if (this.right) {
        this.right.add(value)
        return
      }
      const newNode = new Node(value)
      newNode.parent = this
      this.right = newNode
      return
    }
    if (this.value > value) {
      if (this.left) {
        this.left.add(value)
        return
      }
      const newNode = new Node(value)
      newNode.parent = this
      this.left = newNode
      return
    }
  }

  remove(value) {
    const identifiedNode = this.find(value)
    if (!identifiedNode) {
      throw new Error('无法找到匹配的结点值')
    }
    //删除的结点是树叶的情况
    if (!identifiedNode.left && !identifiedNode.right) {
      const identifiedParent = identifiedNode.parent
      identifiedParent.removeChild(identifiedNode)
      return
    }
    //删除的结点有子结点
    if (identifiedNode.left && identifiedNode.right) {
      const nextBiggerNode = identifiedNode.right.findNext()
      if (nextBiggerNode.value !== identifiedNode.right.value) {
        this.remove(nextBiggerNode.value)
        identifiedNode.value = nextBiggerNode.value
      } else {
        identifiedNode.value = identifiedNode.right.value
        identifiedNode.right = identifiedNode.right.right
      }
    } else {
      const childNode = identifiedNode.left || identifiedNode.right
      identifiedNode.left = childNode.left
      identifiedNode.right = childNode.right
      identifiedNode.value = childNode.value
    }
    if (identifiedNode.left) {
      identifiedNode.left.parent = identifiedNode
    }
    if (identifiedNode.right) {
      identifiedNode.right.parent = identifiedNode
    }
  }

  removeChild(node) {
    if (this.left && this.left === node) {
      this.left = null
      return
    }
    if (this.right && this.right === node) {
      this.right = null
      return
    }
  }

  findNext() {
    if (!this.left) {
      return this
    }
    return this.left.findNext()
  }

  find(value) {
    if (this.value === value) {
      return this
    }
    if (this.value < value && this.right) {
      return this.right.find(value)
    }
    if (this.value > value && this.left) {
      return this.left.find(value)
    }
  }
}

class Tree {
  constructor() {
    this.root = new Node(null)
  }

  add(value) {
    this.root.add(value)
  }

  remove(value) {
    this.root.remove(value)
  }

  find(value) {
    return this.root.find(value)
  }
}
```

|           |         二叉搜索树（BST）         |       数组（Arrays）       |
| :-------: | :-------------------------------: | :------------------------: |
| 访问/搜索 | 最差：O(n)<br />平均情况：O(logn) | 有索引 O(1)<br />搜索 O(n) |
|   插入    | 最差：O(n)<br />平均情况：O(logn) |  末尾 O(1)<br />头部 O(n)  |
|   清除    | 最差：O(n)<br />平均情况：O(logn) |  末尾 O(1)<br />头部 O(n)  |

#### AVL 树

```javascript
class Node {
  constructor(value) {
    this.value = value
    this.right = null
    this.left = null
    this.parent = null
  }

  //AVL树自平衡
  get leftDepth() {
    if (!this.left) {
      return 0
    }
    return this.left.depth + 1
  }

  get rightDepth() {
    if (!this.right) {
      return 0
    }
    return this.right.depth + 1
  }
  get depth() {
    return Math.max(this.leftDepth, this.rightDepth)
  }

  get balanceFactor() {
    return this.leftDepth - this.rightDepth
  }

  add(value) {
    if (this.value === null) {
      this.value = value
      return
    }

    if (this.value < value) {
      if (this.right) {
        this.right.add(value)
        return
      }
      const newNode = new Node(value)
      newNode.parent = this
      this.right = newNode
      return
    }

    if (this.value > value) {
      if (this.left) {
        this.left.add(value)
        return
      }
      const newNode = new Node(value)
      newNode.parent = this
      this.left = newNode
      return
    }
  }

  remove(value) {
    const identifiedNode = this.find(value)

    if (!identifiedNode) {
      throw new Error('无法找到匹配的结点值')
    }
    //删除的结点是树叶的情况
    if (!identifiedNode.left && !identifiedNode.right) {
      const identifiedParent = identifiedNode.parent
      identifiedParent.removeChild(identifiedNode)
      return
    }

    //删除的结点有子结点
    if (identifiedNode.left && identifiedNode.right) {
      const nextBiggerNode = identifiedNode.right.findNext()
      if (nextBiggerNode.value !== identifiedNode.right.value) {
        this.remove(nextBiggerNode.value)
        identifiedNode.value = nextBiggerNode.value
      } else {
        identifiedNode.value = identifiedNode.right.value
        identifiedNode.right = identifiedNode.right.right
      }
    } else {
      const childNode = identifiedNode.left || identifiedNode.right

      identifiedNode.left = childNode.left
      identifiedNode.right = childNode.right
      identifiedNode.value = childNode.value
    }

    if (identifiedNode.left) {
      identifiedNode.left.parent = identifiedNode
    }
    if (identifiedNode.right) {
      identifiedNode.right.parent = identifiedNode
    }
  }
  removeChild(node) {
    if (this.left && this.left === node) {
      this.left = null
      return
    }
    if (this.right && this.right === node) {
      this.right = null
      return
    }
  }

  findNext() {
    if (!this.left) {
      return this
    }
    return this.left.findNext()
  }

  find(value) {
    if (this.value === value) {
      return this
    }

    if (this.value < value && this.right) {
      return this.right.find(value)
    }

    if (this.value > value && this.left) {
      return this.left.find(value)
    }
  }
}

class Tree {
  constructor() {
    this.root = new Node(null)
  }

  add(value) {
    this.root.add(value)
  }

  remove(value) {
    this.root.remove(value)
  }

  find(value) {
    return this.root.find(value)
  }
}

class AVLTree extends Tree {
  add(value) {
    super.add(value)

    let curNode = this.root.find(value)
    while (curNode) {
      this.balance(curNode)
      curNode = curNode.parent
    }
  }
  remove(value) {
    super.remove(value)
    this.balance(this.root)
  }

  balance(node) {
    if (node.balanceFactor < -1) {
      //单向左旋
      if (node.right.balanceFactor < 0) {
        this.rotateLeft(node)
      } else if (node.right.balanceFactor > 0) {
        //双向旋转（先右后左）
        this.rotateRightLeft(node)
      }
    } else if (node.balanceFactor > 1) {
      //双向旋转（先左后右）
      if (node.left.balanceFactor < 0) {
        this.rotateLeftRight(node)
      } else if (node.left.balanceFactor > 0) {
        //单向右旋
        this.rotateRight(node)
      }
    }
  }

  //单向左旋
  rotateLeft(node) {
    const rightNode = node.right
    node.right = null

    if (node.parent) {
      node.parent.right = rightNode
      node.parent.right.parent = node.parent
    } else if (node === this.root) {
      this.root = rightNode
      this.root.parent = null
    }

    if (rightNode.left) {
      node.right = rightNode.left
      node.right.parent = node
    }
    rightNode.left = node
    rightNode.left.parent = rightNode
  }
  //单向右旋
  rotateRight(node) {
    const leftNode = node.left
    node.left = null

    if (node.parent) {
      node.parent.left = leftNode
      node.parent.left.parent = node.parent
    } else if (node === this.root) {
      this.root = leftNode
      this.root.parent = null
    }

    if (leftNode.right) {
      node.right = leftNode.right
      node.right.parent = node
    }
    leftNode.right = node
    leftNode.right.parent = leftNode
  }
}

const tree = new AVLTree()

tree.add(3)
tree.add(2)
tree.add(1)

console.log(tree)
```
