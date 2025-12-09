/**
 * 深度比较两个对象是否相等
 * 通过递归地对对象属性进行排序并序列化，确保属性顺序不影响比较结果
 * @param {Object} obj1 - 待比较的第一个对象
 * @param {Object} obj2 - 待比较的第二个对象
 * @returns {boolean} - 若两个对象深度相等返回 true，否则返回 false
 */
function areObjectsEqual(obj1, obj2) {
  const normalize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj
    const sorted = {}
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = normalize(obj[key])
      })
    return JSON.stringify(sorted)
  }
  return normalize(obj1) === normalize(obj2)
}

/**
 * 通过归一化元素后进行频率统计，判断两个数组的元素组成是否完全一致
 * @param {Array} arr1 - 待比较的第一个数组
 * @param {Array} arr2 - 待比较的第二个数组
 * @returns {boolean} - 若两个数组包含相同元素返回 true，否则返回 false
 */
function arraysHaveSameElements(arr1, arr2) {
  if (arr1.length !== arr2.length) return false

  const frequencyMap = new Map()

  // 统计arr1元素频率
  arr1.forEach((item) => {
    const key = JSON.stringify(normalizeItem(item))
    frequencyMap.set(key, (frequencyMap.get(key) || 0) + 1)
  })

  // 验证arr2元素频率
  arr2.forEach((item) => {
    const key = JSON.stringify(normalizeItem(item))
    if (!frequencyMap.has(key)) return false
    const count = frequencyMap.get(key)
    if (count === 1) frequencyMap.delete(key)
    else frequencyMap.set(key, count - 1)
  })

  return frequencyMap.size === 0
}

/**
 * 归一化数组项
 * 对对象类型的数组项进行深度排序，保证属性顺序一致，方便后续比较
 * @param {*} item - 待归一化的数组项
 * @returns {*} - 归一化后的数组项（对象类型返回排序后的对象，非对象类型原样返回）
 */
function normalizeItem(item) {
  if (typeof item !== 'object' || item === null) return item
  const sorted = {}
  Object.keys(item)
    .sort()
    .forEach((key) => {
      sorted[key] = normalizeItem(item[key])
    })
  return sorted
}

/**
 * 判断数据是否发生变更
 * 通过比较过滤掉默认数据后的新数组与旧数组，检测是否存在增删或顺序变化
 * @param {Object} params - 参数对象
 * @param {Array} params.after - 变更后的数组
 * @param {Array} params.before - 变更前的数组
 * @param {Object} params.defaultData - 默认数据项，用于过滤
 * @returns {boolean} - 若数据有变更返回 true，否则返回 false
 */
function isDataChange(params) {
  const { after, before, defaultData } = params
  // 过滤新数组中的默认数据项
  const filteredAfter = after.filter((item) => !areObjectsEqual(item, defaultData))

  // 特殊处理：当旧数组为空时
  if (before.length === 0) {
    return filteredAfter.length !== 0
  }

  // 特殊处理：当新数组过滤后为空
  if (filteredAfter.length === 0) {
    return before.length !== 0
  }

  // 比较过滤后的新数组与旧数组
  return !arraysHaveSameElements(filteredAfter, before)
}

// 测试用例
const before = [{ projectID: { a: { b: { c: 2 } } }, projectName: '项目1' }]
const after = [
  { projectID: { a: { b: { c: 2 } } }, projectName: '项目1' },
  { projectID: '1', projectName: '' }
]
const defaultData = { projectID: '1', projectName: '' }

console.log(isDataChange({ after, before, defaultData }))
