import { sidebar as sidebarList } from './urlconfig'
const sidebar = {}

type mapItem = {
  file: string
  text: string
}

const map = new Map([['JavaScript', [{ file: 'High-Performance JavaScript', text: 'JavaScript高级程序设计(第4版)' }]]])

for (const key in sidebarList) {
  if (map.has(key)) {
    const sub = map.get(key) as mapItem[]
    const subSideBar: any[] = []
    sub.forEach((item) => {
      sidebar[sidebarList[item.file].base] = null
      subSideBar.push({ ...sidebarList[item.file], text: item.text, collapsed: true })
    })
    sidebar[sidebarList[key].base] = [...subSideBar, { ...sidebarList[key], text: key, collapsed: false }]
  } else {
    if (sidebar[sidebarList[key].base] !== null) {
      sidebar[sidebarList[key].base] = { ...sidebarList[key] }
    }
  }
}

for (const key in sidebar) {
  if (sidebar[key] === null) {
    delete sidebar[key]
  }
}

export default sidebar
