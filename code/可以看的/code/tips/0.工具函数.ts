/**
 * 定义了一个类型别名DeepReadonly，用于创建一个深度只读的类型。
 * 这意味着不仅该类型的属性是只读的，而且嵌套对象的属性也是只读的。
 *
 * @param T 被标记为DeepReadonly的泛型类型
 * @returns 返回一个深度只读的版本的T类型
 */
type DeepReadonly<T> = {
  /**
   * 通过索引访问T的属性，如果属性的值是一个对象，则递归地应用DeepReadonly。
   * 这样做是为了确保对象的内部属性也是只读的，防止在运行时修改这些属性。
   */
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}
