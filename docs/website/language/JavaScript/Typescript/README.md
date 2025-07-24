# Typescript 小点知识总结

## 用发布订阅模式解耦

```Typescript
const eventNames = ['API:UN_AUTH', 'API:INVALID']
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listeners: Record<string, Set<Function>> = {
    'API:UN_AUTH': new Set(),
    'API:INVALID': new Set()
  }

  on(eventName: EventNames, listener: Function) {
    this.listeners[eventName].add(listener)
  }

  emit(eventName: EventNames, ...args: any[]) {
    this.listeners[eventName].forEach((listener) => listener(...args))
  }
}

export default new EventEmitter()
```

## 前置的不定量参数(类型标注)

```ts
type JSTypeMap = {
  string: string
  number: number
  boolean: boolean
  undefined: undefined
  object: object
  symbol: symbol
  bigint: bigint
  null: null
}

type JSTypeNames = keyof JSTypeMap

type ArgsType<T extends JSTypeNames[]> = {
  [I in keyof T]: JSTypeMap[T[I]]
}

declare function addImpl<T extends JSTypeNames[]>(...args: [...T, (...args: ArgsType<T>) => any]): void
```

## 不可变类型

```ts
type DeepReadonly = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

interface Obj {
  a: number
  b: string
}
// Readonly 浅的不可变类型
let obj: Readonly<Obj> = {
  a: 1,
  b: '2'
}
```

## 使用元祖生成联合类型

```ts
const colors = ['♥', '♦', '♣', '♠'] as const
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const
type Color = (typeof colors)[number]
type Value = (typeof values)[number]
```
