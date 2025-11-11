import { sideBarMap, getNavLinkKey } from './urlConfig'

const sideBar = {}

type mapItem = {
  file: string
  text: string
}

const mergeSideBarMap = new Map([
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

let needDeleteKey = []
for (let [key, value] of sideBarMap) {
  const file = getNavLinkKey(key.slice(0, -1))
  if (mergeSideBarMap.has(file)) {
    const subFolder = mergeSideBarMap.get(file) as mapItem[]
    const subSideBar = []
    subFolder.forEach((item) => {
      const subKey = `${key}${item.file}/`
      subSideBar.push({ ...sideBarMap.get(subKey), text: item.text, collapsed: true })
      needDeleteKey.push(subKey)
    })
    sideBar[key] = [value, ...subSideBar]
  } else if (!needDeleteKey.includes(key)) {
    sideBar[key] = value
  }
}

for (const key of needDeleteKey) {
  delete sideBar[key]
}

// import util from 'util'
// console.log(util.inspect(sideBar, { showHidden: false, depth: null, colors: true }))

export default sideBar
