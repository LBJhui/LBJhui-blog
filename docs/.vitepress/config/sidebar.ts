import { sideBarMap, getNavLinkKey } from './folder.ts'
import type { Item, SideBarItem } from './type.ts'

// 定义 mergeSideBarMap 的结构（用于配置侧边栏的合并规则）
type MergeSideBarConfig = Map<string, Array<{ file: string; text: string }>>

// 定义最终的 sideBar 结构（键是字符串，值是 SideBarItem 数组）
const sideBar: Record<string, SideBarItem[]> = {}

// 定义合并配置（明确类型为 MergeSideBarConfig）
const mergeSideBarMap: MergeSideBarConfig = new Map([
  ['CSS', [{ file: 'code', text: 'CSS code' }]],
  [
    'JavaScript',
    [
      { file: 'Handwritten code', text: '手写代码' },
      { file: 'High-Performance JavaScript', text: 'JavaScript高级程序设计(第4版)' },
      { file: 'Node.js', text: 'Node.js' },
      { file: 'Typescript', text: 'Typescript' }
    ]
  ],
  ['engineering', [{ file: 'webpack', text: 'webpack' }]],
  [
    'browser&network',
    [
      { file: 'network', text: '网络' },
      { file: '前端安全', text: '前端安全' }
    ]
  ],
  [
    'math',
    [
      { file: '高等数学', text: '高等数学' },
      { file: '线性代数', text: '线性代数' }
    ]
  ]
])
type unionSideBarMapType = {
  text: string
  index: number
}
const unionSideBarMap = new Map<string, unionSideBarMapType>([
  [
    'datastructure',
    {
      text: '数据结构',
      index: 0
    }
  ],
  [
    'computer-network',
    {
      text: '计算机网络',
      index: 1
    }
  ]
])

// 需要删除的键（存储字符串数组）
const needDeleteKey: string[] = []

// 遍历 sideBarMap 进行合并
for (const [key, value] of sideBarMap) {
  const file = getNavLinkKey(key.slice(0, -1)) || ''
  if (unionSideBarMap.has(file)) {
    const data = unionSideBarMap.get(file) as unionSideBarMapType
    const key = value.base
      .split('/')
      .filter((item) => item !== file)
      .join('/')
    const sideBarItem = {
      ...value,
      text: data.text, // 使用配置的标题
      collapsed: true // 默认折叠
    }
    !sideBar[key] && (sideBar[key] = [])
    sideBar[key][data.index] = sideBarItem
    // 多个目录合并为一个新的目录
  } else if (mergeSideBarMap.has(file)) {
    // 移动到合并后的目录
    const subFolder = mergeSideBarMap.get(file) as Array<{ file: string; text: string }>
    const subSideBar: SideBarItem[] = []

    // 处理每个子文件夹
    subFolder.forEach((item) => {
      const subKey = `${key}${item.file}/`
      const subItem = sideBarMap.get(subKey)

      // 如果子项存在，则合并到 subSideBar
      if (subItem) {
        subSideBar.push({
          ...subItem,
          text: item.text, // 使用配置的标题
          collapsed: true // 默认折叠
        })
        needDeleteKey.push(subKey) // 标记需要删除的子项
      }
    })

    // 合并到最终结果（保留原始 value + 新增的 subSideBar）
    sideBar[key] = [value, ...subSideBar]
  }
  // 如果不需要合并且未被标记删除，则直接添加
  else if (!needDeleteKey.includes(key)) {
    sideBar[key] = [value] // 注意：这里统一转为数组形式，保持一致性
  }
}

// 删除已被合并的子项
for (const key of needDeleteKey) {
  delete sideBar[key]
}
// import util from 'util'
// console.log(util.inspect(sideBar, { showHidden: false, depth: null, colors: true }))
export default sideBar
