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

// 需要删除的键（存储字符串数组）
const needDeleteKey: string[] = []

// 遍历 sideBarMap 进行合并
for (const [key, value] of sideBarMap) {
  const file = getNavLinkKey(key.slice(0, -1)) || ''
  if (mergeSideBarMap.has(file)) {
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

type UnionSideBarItem = {
  text: string
  base: string
  children?: Array<UnionSideBarItem>
}

const unionSideBarMap: Map<string, UnionSideBarItem[]> = new Map([
  [
    '/website/exam/408/',
    [
      {
        text: '数据结构',
        base: '/website/exam/408/datastructure/',
        children: [{ text: '算法题', base: '/website/exam/408/datastructure/算法题/' }]
      },
      { text: '计算机网络', base: '/website/exam/408/network/' }
    ]
  ]
])
const formatSideBarItem = (data: UnionSideBarItem): { sideBarItem: SideBarItem; deleteKeys: string[] } => {
  const deleteKeys = []
  let sideBarItem = {
    text: data.text,
    collapsed: true,
    base: data.base,
    items: [...(sideBarMap.get(data.base) as SideBarItem).items]
  }
  deleteKeys.push(data.base)

  if (data.children) {
    sideBarItem.items.push(
      ...data.children.map((item) => {
        deleteKeys.push(item.base)
        return {
          text: item.text,
          collapsed: true,
          base: item.base,
          items: [...(sideBarMap.get(item.base) as SideBarItem).items]
        }
      })
    )
  }

  return { sideBarItem, deleteKeys }
}

for (const [key, value] of unionSideBarMap) {
  sideBar[key] = []
  for (const item of value) {
    const { sideBarItem, deleteKeys } = formatSideBarItem(item)
    needDeleteKey.push(...deleteKeys)
    sideBar[key].push(sideBarItem)
  }
}

// 删除已被合并的子项
for (const key of needDeleteKey) {
  delete sideBar[key]
}

// import util from 'util'
// console.log(util.inspect(sideBar, { showHidden: false, depth: null, colors: true }))
export default sideBar
