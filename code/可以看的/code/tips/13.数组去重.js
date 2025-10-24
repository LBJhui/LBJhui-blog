/**
 * 数组去重
 * 两个属性相同的对象也认为是重复的
 * @param {Array} arr
 * @return {Array}
 * @throws {TypeError} 如果传入的参数不是数组
 */
function uniqueArray(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('uniqueArray expects an array as input')
  }
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const item1 = arr[i]
    let isFind = false
    for (let j = 0; j < result.length; j++) {
      const item2 = result[j]
      if (equals(item1, item2)) {
        isFind = true
        break
      }
    }
    if (!isFind) {
      result.push(item1)
    }
  }
  return result
}
/**
 * 判断给定的值是否为原始值。
 * 原始值包括：undefined, null, boolean, number, string, symbol。
 *
 * @param {any} value - 需要判断的值。
 * @returns {boolean} - 如果给定的值是原始值，则返回true；否则返回false。
 */
function isPrimitive(value) {
  return value === null || !['object', 'function'].includes(typeof value)
}
/**
 * 判断两个值是否相等
 * 支持深度比较对象和数组
 * @param {*} value1
 * @param {*} value2
 * @return {boolean}
 */
function equals(value1, value2) {
  if (isPrimitive(value1) || isPrimitive(value2)) {
    return Object.is(value1, value2)
  }
  const entires1 = Object.entries(value1)
  const entires2 = Object.entries(value2)
  if (entires1.length !== entires2.length) {
    return false
  }
  for (const [key, value] of entires1) {
    if (!equals(value, value2[key]) || !(key in value2)) {
      return false
    }
  }
  return true
}
