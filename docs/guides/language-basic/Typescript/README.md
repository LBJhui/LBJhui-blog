# 类型标注

## 前置的不定量参数

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
type DeepReadonly<T extends Record<string | symbol, any>> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

interface Obj {
  a: number
  b: string
}
// Readonly 浅的不可变类型
let obj: Readonly<Obj> = {
  a: 1,
  b: '2',
}
```

##
