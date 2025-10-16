## **对象和数据结构**

### 使用 getters 和 setters

JS 没有接口或类型，因此实现这一模式是很困难的，因为我们并没有类似 `public` 和 `private` 的关键词。

然而，使用 getters 和 setters 获取对象的数据远比直接使用点操作符具有优势。为什么呢？

1. 当需要对获取的对象属性执行额外操作时。
2. 执行 `set` 时可以增加规则对要变量的合法性进行判断。
3. 封装了内部逻辑。
4. 在存取时可以方便的增加日志和错误处理。
5. 继承该类时可以重载默认行为。
6. 从服务器获取数据时可以进行懒加载。

**反例**:

```javascript
class BankAccount {
  constructor() {
    this.balance = 1000
  }
}

let bankAccount = new BankAccount()

// Buy shoes...
bankAccount.balance = bankAccount.balance - 100
```

**正例**:

```javascript
class BankAccount {
  constructor() {
    this.balance = 1000
  }

  // It doesn't have to be prefixed with `get` or `set` to be a getter/setter
  withdraw(amount) {
    if (verifyAmountCanBeDeducted(amount)) {
      this.balance -= amount
    }
  }
}

let bankAccount = new BankAccount()

// Buy shoes...
bankAccount.withdraw(100)
```

**[回到目录](#目录)**

### 让对象拥有私有成员

可以通过闭包完成

**反例**:

```javascript
var Employee = function (name) {
  this.name = name
}

Employee.prototype.getName = function () {
  return this.name
}

var employee = new Employee('John Doe')
console.log('Employee name: ' + employee.getName()) // Employee name: John Doe
delete employee.name
console.log('Employee name: ' + employee.getName()) // Employee name: undefined
```

**正例**:

```javascript
var Employee = (function () {
  function Employee(name) {
    this.getName = function () {
      return name
    }
  }

  return Employee
})()

var employee = new Employee('John Doe')
console.log('Employee name: ' + employee.getName()) // Employee name: John Doe
delete employee.name
console.log('Employee name: ' + employee.getName()) // Employee name: John Doe
```

**[回到目录](#目录)**

## **类**

### 单一职责原则 (SRP)

如《代码整洁之道》一书中所述，“修改一个类的理由不应该超过一个”。

将多个功能塞进一个类的想法很诱人，但这将导致你的类无法达到概念上的内聚，并经常不得不进行修改。

最小化对一个类需要修改的次数是非常有必要的。如果一个类具有太多太杂的功能，当你对其中一小部分进行修改时，将很难想象到这一修够对代码库中依赖该类的其他模块会带来什么样的影响。

**反例**:

```javascript
class UserSettings {
  constructor(user) {
    this.user = user
  }

  changeSettings(settings) {
    if (this.verifyCredentials(user)) {
      // ...
    }
  }

  verifyCredentials(user) {
    // ...
  }
}
```

**正例**:

```javascript
class UserAuth {
  constructor(user) {
    this.user = user
  }

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  constructor(user) {
    this.user = user
    this.auth = new UserAuth(user)
  }

  changeSettings(settings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

**[回到目录](#目录)**

### 开/闭原则 (OCP)

“代码实体(类，模块，函数等)应该易于扩展，难于修改。”

这一原则指的是我们应允许用户方便的扩展我们代码模块的功能，而不需要打开 js 文件源码手动对其进行修改。

**反例**:

```javascript
class AjaxRequester {
  constructor() {
    // What if we wanted another HTTP Method, like DELETE? We would have to
    // open this file up and modify this and put it in manually.
    this.HTTP_METHODS = ['POST', 'PUT', 'GET']
  }

  get(url) {
    // ...
  }
}
```

**正例**:

```javascript
class AjaxRequester {
  constructor() {
    this.HTTP_METHODS = ['POST', 'PUT', 'GET']
  }

  get(url) {
    // ...
  }

  addHTTPMethod(method) {
    this.HTTP_METHODS.push(method)
  }
}
```

**[回到目录](#目录)**

### 利斯科夫替代原则 (LSP)

“子类对象应该能够替换其超类对象被使用”。

也就是说，如果有一个父类和一个子类，当采用子类替换父类时不应该产生错误的结果。

**反例**:

```javascript
class Rectangle {
  constructor() {
    this.width = 0
    this.height = 0
  }

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }

  setWidth(width) {
    this.width = width
  }

  setHeight(height) {
    this.height = height
  }

  getArea() {
    return this.width * this.height
  }
}

class Square extends Rectangle {
  constructor() {
    super()
  }

  setWidth(width) {
    this.width = width
    this.height = width
  }

  setHeight(height) {
    this.width = height
    this.height = height
  }
}

function renderLargeRectangles(rectangles) {
  rectangles.forEach((rectangle) => {
    rectangle.setWidth(4)
    rectangle.setHeight(5)
    let area = rectangle.getArea() // BAD: Will return 25 for Square. Should be 20.
    rectangle.render(area)
  })
}

let rectangles = [new Rectangle(), new Rectangle(), new Square()]
renderLargeRectangles(rectangles)
```

**正例**:

```javascript
class Shape {
  constructor() {}

  setColor(color) {
    // ...
  }

  render(area) {
    // ...
  }
}

class Rectangle extends Shape {
  constructor() {
    super()
    this.width = 0
    this.height = 0
  }

  setWidth(width) {
    this.width = width
  }

  setHeight(height) {
    this.height = height
  }

  getArea() {
    return this.width * this.height
  }
}

class Square extends Shape {
  constructor() {
    super()
    this.length = 0
  }

  setLength(length) {
    this.length = length
  }

  getArea() {
    return this.length * this.length
  }
}

function renderLargeShapes(shapes) {
  shapes.forEach((shape) => {
    switch (shape.constructor.name) {
      case 'Square':
        shape.setLength(5)
      case 'Rectangle':
        shape.setWidth(4)
        shape.setHeight(5)
    }

    let area = shape.getArea()
    shape.render(area)
  })
}

let shapes = [new Rectangle(), new Rectangle(), new Square()]
renderLargeShapes(shapes)
```

**[回到目录](#目录)**

### 接口隔离原则 (ISP)

“客户端不应该依赖它不需要的接口；一个类对另一个类的依赖应该建立在最小的接口上。”

在 JS 中，当一个类需要许多参数设置才能生成一个对象时，或许大多时候不需要设置这么多的参数。此时减少对配置参数数量的需求是有益的。

**反例**:

```javascript
class DOMTraverser {
  constructor(settings) {
    this.settings = settings
    this.setup()
  }

  setup() {
    this.rootNode = this.settings.rootNode
    this.animationModule.setup()
  }

  traverse() {
    // ...
  }
}

let $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  animationModule: function () {} // Most of the time, we won't need to animate when traversing.
  // ...
})
```

**正例**:

```javascript
class DOMTraverser {
  constructor(settings) {
    this.settings = settings
    this.options = settings.options
    this.setup()
  }

  setup() {
    this.rootNode = this.settings.rootNode
    this.setupOptions()
  }

  setupOptions() {
    if (this.options.animationModule) {
      // ...
    }
  }

  traverse() {
    // ...
  }
}

let $ = new DOMTraverser({
  rootNode: document.getElementsByTagName('body'),
  options: {
    animationModule: function () {}
  }
})
```

**[回到目录](#目录)**

### 依赖反转原则 (DIP)

该原则有两个核心点：

1. 高层模块不应该依赖于低层模块。他们都应该依赖于抽象接口。
2. 抽象接口应该脱离具体实现，具体实现应该依赖于抽象接口。

**反例**:

```javascript
class InventoryTracker {
  constructor(items) {
    this.items = items

    // BAD: We have created a dependency on a specific request implementation.
    // We should just have requestItems depend on a request method: `request`
    this.requester = new InventoryRequester()
  }

  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item)
    })
  }
}

class InventoryRequester {
  constructor() {
    this.REQ_METHODS = ['HTTP']
  }

  requestItem(item) {
    // ...
  }
}

let inventoryTracker = new InventoryTracker(['apples', 'bananas'])
inventoryTracker.requestItems()
```

**正例**:

```javascript
class InventoryTracker {
  constructor(items, requester) {
    this.items = items
    this.requester = requester
  }

  requestItems() {
    this.items.forEach((item) => {
      this.requester.requestItem(item)
    })
  }
}

class InventoryRequesterV1 {
  constructor() {
    this.REQ_METHODS = ['HTTP']
  }

  requestItem(item) {
    // ...
  }
}

class InventoryRequesterV2 {
  constructor() {
    this.REQ_METHODS = ['WS']
  }

  requestItem(item) {
    // ...
  }
}

// By constructing our dependencies externally and injecting them, we can easily
// substitute our request module for a fancy new one that uses WebSockets.
let inventoryTracker = new InventoryTracker(['apples', 'bananas'], new InventoryRequesterV2())
inventoryTracker.requestItems()
```

**[回到目录](#目录)**

### 使用 ES6 的 classes 而不是 ES5 的 Function

典型的 ES5 的类(function)在继承、构造和方法定义方面可读性较差。

当需要继承时，优先选用 classes。

但是，当在需要更大更复杂的对象时，最好优先选择更小的 function 而非 classes。

**反例**:

```javascript
var Animal = function (age) {
  if (!(this instanceof Animal)) {
    throw new Error('Instantiate Animal with `new`')
  }

  this.age = age
}

Animal.prototype.move = function () {}

var Mammal = function (age, furColor) {
  if (!(this instanceof Mammal)) {
    throw new Error('Instantiate Mammal with `new`')
  }

  Animal.call(this, age)
  this.furColor = furColor
}

Mammal.prototype = Object.create(Animal.prototype)
Mammal.prototype.constructor = Mammal
Mammal.prototype.liveBirth = function () {}

var Human = function (age, furColor, languageSpoken) {
  if (!(this instanceof Human)) {
    throw new Error('Instantiate Human with `new`')
  }

  Mammal.call(this, age, furColor)
  this.languageSpoken = languageSpoken
}

Human.prototype = Object.create(Mammal.prototype)
Human.prototype.constructor = Human
Human.prototype.speak = function () {}
```

**正例**:

```javascript
class Animal {
  constructor(age) {
    this.age = age
  }

  move() {}
}

class Mammal extends Animal {
  constructor(age, furColor) {
    super(age)
    this.furColor = furColor
  }

  liveBirth() {}
}

class Human extends Mammal {
  constructor(age, furColor, languageSpoken) {
    super(age, furColor)
    this.languageSpoken = languageSpoken
  }

  speak() {}
}
```

**[回到目录](#目录)**

### 使用方法链

这里我们的理解与《代码整洁之道》的建议有些不同。

有争论说方法链不够干净且违反了[德米特法则](https://en.wikipedia.org/wiki/Law_of_Demeter)，也许这是对的，但这种方法在 JS 及许多库(如 JQuery)中显得非常实用。

因此，我认为在 JS 中使用方法链是非常合适的。在 class 的函数中返回 this，能够方便的将类需要执行的多个方法链接起来。

**反例**:

```javascript
class Car {
  constructor() {
    this.make = 'Honda'
    this.model = 'Accord'
    this.color = 'white'
  }

  setMake(make) {
    this.name = name
  }

  setModel(model) {
    this.model = model
  }

  setColor(color) {
    this.color = color
  }

  save() {
    console.log(this.make, this.model, this.color)
  }
}

let car = new Car()
car.setColor('pink')
car.setMake('Ford')
car.setModel('F-150')
car.save()
```

**正例**:

```javascript
class Car {
  constructor() {
    this.make = 'Honda'
    this.model = 'Accord'
    this.color = 'white'
  }

  setMake(make) {
    this.name = name
    // NOTE: Returning this for chaining
    return this
  }

  setModel(model) {
    this.model = model
    // NOTE: Returning this for chaining
    return this
  }

  setColor(color) {
    this.color = color
    // NOTE: Returning this for chaining
    return this
  }

  save() {
    console.log(this.make, this.model, this.color)
  }
}

let car = new Car().setColor('pink').setMake('Ford').setModel('F-150').save()
```

**[回到目录](#目录)**

### 优先使用组合模式而非继承

在著名的[设计模式](https://en.wikipedia.org/wiki/Design_Patterns)一书中提到，应多使用组合模式而非继承。

这么做有许多优点，在想要使用继承前，多想想能否通过组合模式满足需求吧。

那么，在什么时候继承具有更大的优势呢？这取决于你的具体需求，但大多情况下，可以遵守以下三点：

1. 继承关系表现为"是一个"而非"有一个"(如动物->人 和 用户->用户细节)
2. 可以复用基类的代码("Human"可以看成是"All animal"的一种)
3. 希望当基类改变时所有派生类都受到影响(如修改"all animals"移动时的卡路里消耗量)

**反例**:

```javascript
class Employee {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  // ...
}

// Bad because Employees "have" tax data. EmployeeTaxData is not a type of Employee
class EmployeeTaxData extends Employee {
  constructor(ssn, salary) {
    super()
    this.ssn = ssn
    this.salary = salary
  }

  // ...
}
```

**正例**:

```javascript
class Employee {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  setTaxData(ssn, salary) {
    this.taxData = new EmployeeTaxData(ssn, salary)
  }
  // ...
}

class EmployeeTaxData {
  constructor(ssn, salary) {
    this.ssn = ssn
    this.salary = salary
  }

  // ...
}
```

**[回到目录](#目录)**

## **测试**

[一些好的覆盖工具](http://gotwarlost.github.io/istanbul/)。

[一些好的 JS 测试框架](http://jstherightway.org/#testing-tools)。

### 单一的测试每个概念

**反例**:

```javascript
const assert = require('assert')

describe('MakeMomentJSGreatAgain', function () {
  it('handles date boundaries', function () {
    let date

    date = new MakeMomentJSGreatAgain('1/1/2015')
    date.addDays(30)
    date.shouldEqual('1/31/2015')

    date = new MakeMomentJSGreatAgain('2/1/2016')
    date.addDays(28)
    assert.equal('02/29/2016', date)

    date = new MakeMomentJSGreatAgain('2/1/2015')
    date.addDays(28)
    assert.equal('03/01/2015', date)
  })
})
```

**正例**:

```javascript
const assert = require('assert')

describe('MakeMomentJSGreatAgain', function () {
  it('handles 30-day months', function () {
    let date = new MakeMomentJSGreatAgain('1/1/2015')
    date.addDays(30)
    date.shouldEqual('1/31/2015')
  })

  it('handles leap year', function () {
    let date = new MakeMomentJSGreatAgain('2/1/2016')
    date.addDays(28)
    assert.equal('02/29/2016', date)
  })

  it('handles non-leap year', function () {
    let date = new MakeMomentJSGreatAgain('2/1/2015')
    date.addDays(28)
    assert.equal('03/01/2015', date)
  })
})
```

**[回到目录](#目录)**

## **并发**

### 用 Promises 替代回调

回调不够整洁并会造成大量的嵌套。ES6 内嵌了 Promises，使用它吧。

**反例**:

```javascript
require('request').get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin', function (err, response) {
  if (err) {
    console.error(err)
  } else {
    require('fs').writeFile('article.html', response.body, function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log('File written')
      }
    })
  }
})
```

**正例**:

```javascript
require('request-promise')
  .get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
  .then(function (response) {
    return require('fs-promise').writeFile('article.html', response)
  })
  .then(function () {
    console.log('File written')
  })
  .catch(function (err) {
    console.error(err)
  })
```

**[回到目录](#目录)**

### Async/Await 是较 Promises 更好的选择

Promises 是较回调而言更好的一种选择，但 ES7 中的 async 和 await 更胜过 Promises。

在能使用 ES7 特性的情况下可以尽量使用他们替代 Promises。

**反例**:

```javascript
require('request-promise')
  .get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
  .then(function (response) {
    return require('fs-promise').writeFile('article.html', response)
  })
  .then(function () {
    console.log('File written')
  })
  .catch(function (err) {
    console.error(err)
  })
```

**正例**:

```javascript
async function getCleanCodeArticle() {
  try {
    var request = await require('request-promise')
    var response = await request.get('https://en.wikipedia.org/wiki/Robert_Cecil_Martin')
    var fileHandle = await require('fs-promise')

    await fileHandle.writeFile('article.html', response)
    console.log('File written')
  } catch (err) {
    console.log(err)
  }
}
```

**[回到目录](#目录)**

## **错误处理**

错误抛出是个好东西！这使得你能够成功定位运行状态中的程序产生错误的位置。

### 别忘了捕获错误

对捕获的错误不做任何处理是没有意义的。

代码中 `try/catch` 的意味着你认为这里可能出现一些错误，你应该对这些可能的错误存在相应的处理方案。

**反例**:

```javascript
try {
  functionThatMightThrow()
} catch (error) {
  console.log(error)
}
```

**正例**:

```javascript
try {
  functionThatMightThrow()
} catch (error) {
  // One option (more noisy than console.log):
  console.error(error)
  // Another option:
  notifyUserOfError(error)
  // Another option:
  reportErrorToService(error)
  // OR do all three!
}
```

### 不要忽略被拒绝的 promises

理由同 `try/catch`。

**反例**:

```javascript
getdata()
  .then((data) => {
    functionThatMightThrow(data)
  })
  .catch((error) => {
    console.log(error)
  })
```

**正例**:

```javascript
getdata()
  .then((data) => {
    functionThatMightThrow(data)
  })
  .catch((error) => {
    // One option (more noisy than console.log):
    console.error(error)
    // Another option:
    notifyUserOfError(error)
    // Another option:
    reportErrorToService(error)
    // OR do all three!
  })
```

**[回到目录](#目录)**

## **格式化**

格式化是一件主观的事。如同这里的许多规则一样，这里并没有一定/立刻需要遵守的规则。可以在[这里](http://standardjs.com/rules.html)完成格式的自动化。

### 大小写一致

JS 是弱类型语言，合理的采用大小写可以告诉你关于变量/函数等的许多消息。

这些规则是主观定义的，团队可以根据喜欢进行选择。重点在于无论选择何种风格，都需要注意保持一致性。

**反例**:

```javascript
var DAYS_IN_WEEK = 7
var daysInMonth = 30

var songs = ['Back In Black', 'Stairway to Heaven', 'Hey Jude']
var Artists = ['ACDC', 'Led Zeppelin', 'The Beatles']

function eraseDatabase() {}
function restore_database() {}

class animal {}
class Alpaca {}
```

**正例**:

```javascript
var DAYS_IN_WEEK = 7
var DAYS_IN_MONTH = 30

var songs = ['Back In Black', 'Stairway to Heaven', 'Hey Jude']
var artists = ['ACDC', 'Led Zeppelin', 'The Beatles']

function eraseDatabase() {}
function restoreDatabase() {}

class Animal {}
class Alpaca {}
```

**[回到目录](#目录)**

### 调用函数的函数和被调函数应放在较近的位置

当函数间存在相互调用的情况时，应将两者置于较近的位置。

理想情况下，应将调用其他函数的函数写在被调用函数的上方。

**反例**:

```javascript
class PerformanceReview {
  constructor(employee) {
    this.employee = employee
  }

  lookupPeers() {
    return db.lookup(this.employee, 'peers')
  }

  lookupMananger() {
    return db.lookup(this.employee, 'manager')
  }

  getPeerReviews() {
    let peers = this.lookupPeers()
    // ...
  }

  perfReview() {
    getPeerReviews()
    getManagerReview()
    getSelfReview()
  }

  getManagerReview() {
    let manager = this.lookupManager()
  }

  getSelfReview() {
    // ...
  }
}

let review = new PerformanceReview(user)
review.perfReview()
```

**正例**:

```javascript
class PerformanceReview {
  constructor(employee) {
    this.employee = employee
  }

  perfReview() {
    getPeerReviews()
    getManagerReview()
    getSelfReview()
  }

  getPeerReviews() {
    let peers = this.lookupPeers()
    // ...
  }

  lookupPeers() {
    return db.lookup(this.employee, 'peers')
  }

  getManagerReview() {
    let manager = this.lookupManager()
  }

  lookupMananger() {
    return db.lookup(this.employee, 'manager')
  }

  getSelfReview() {
    // ...
  }
}

let review = new PerformanceReview(employee)
review.perfReview()
```

**[回到目录](#目录)**
