<template>
  <div></div>
</template>

<script setup lang="ts">
// TS中字符串索引带来的类型问题
const obj = {
  name: 'LBJhui',
  age: 18,
}
// function method(key: keyof typeof obj) {
//   return obj[key]
// }

// function method(key: string) {
//   return obj[key as keyof typeof obj]
// }

// function method(key: string, a) {
//   return obj[key]
// }

//  "noImplicitAny": false,

/**
 * 在TypeScript中，noImplicitAny是一种编译选项，用于指示编译器在出现隐式any类型的情况下发出错误或警告。
 *
 * any类型是TypeScript中的一种动态类型，它可以表示任意类型的值，但其使用会带来一定的类型不确定性和安全隐患。通过配置noImplicitAny选项，可以在编译期间发现潜在的类型错误，提高代码质量和可靠性。
 *
 * 例如，如果启用noImplicitAny选项，并且在代码中有一个函数，其参数的类型没有明确指定，那么编译器会提示错误，要求明确指定参数的类型。
 *
 * 此外，noImplicitAny编译器选项实际上是将TypeScript从可选类型语言转换为强制类型检验语言，这意味着在编写代码时，需要更多地关注类型，如果不指定类型，编译器就会报错。
 *
 * 要在TypeScript中使用noImplicitAny注解，需要在tsconfig.json配置文件中进行相应的设置。如果设置为noImplicitAny:true，那么即使值是any（任意值），也需要进行类型注释。
 */

// "suppressImplicitAnyIndexErrors": true,

/**
 * 在TypeScript中，suppressImplicitAnyIndexErrors 是一个编译选项，用于控制当使用索引访问对象属性时，如果编译器无法确定该属性的确切类型，是否应该产生错误。
 *
 * 当 suppressImplicitAnyIndexErrors 设置为 true 时，TypeScript 编译器会抑制由索引访问导致的隐式 any 类型错误。这在你遍历一个对象的属性，但无法事先知道所有属性名的情况下可能很有用。然而，这种做法可能会隐藏潜在的类型错误，因为它允许你以 any 类型访问对象的属性。
 *
 * 在 TypeScript 5.5 及以后的版本中，suppressImplicitAnyIndexErrors 选项已被弃用，并且将在未来的版本中移除。如果你正在使用或考虑使用这个选项，建议你重新考虑你的代码设计，并尝试使用更明确的类型注解来避免隐式 any 类型。
 *
 * 如果你确实需要访问一个对象的未知属性，并且无法提供明确的类型注解，你可以考虑使用索引签名（index signature）来定义对象的类型。索引签名允许你指定一个类型作为对象属性的默认类型，即使你无法列出所有可能的属性名。
 */

function method(key: string, a) {
  // @ts-ignore
  return obj[key]

  /**
   * 在TypeScript中，@ts-ignore 是一个特殊的注释，用于告诉TypeScript编译器忽略紧接其后的下一行代码或区域的类型检查错误。这个注释在某些情况下可能是有用的，特别是当你需要绕过TypeScript的类型系统限制，或者当你确信某个类型错误是安全的，但出于某些原因TypeScript无法识别时。
   *
   * 在@ts-ignore后面添加冒号和描述（如@ts-ignore: some description）是可选的，但这样做可以提供额外的上下文信息，有助于其他开发者理解为什么需要忽略这个特定的类型错误。
   */
}

</script>

<style scoped lang=""></style>
