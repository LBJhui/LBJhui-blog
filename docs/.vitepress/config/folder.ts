import * as fs from 'node:fs'
import type { SideBar, SideBarItem, Item } from './type'

const DOC = 'docs'
const BASE = `${DOC}/website`
const SIDEBARKEY = Symbol('sidebar')
const regex = /\d+/g
const sideBarMap = new Map<string, SideBarItem>()
const navLinkMap = new Map<string, string>()

const isExclude = (file: fs.Dirent): boolean => {
  return file.parentPath.includes('images') || file.parentPath.includes('components') || file.name === 'images' || file.name === 'components'
}

const deleteSuffix = (name: string): string => {
  const index = name.lastIndexOf('.')
  return name.slice(0, index)
}

const sortList = (list: Item[]): Item[] => {
  return list.sort((a, b) => {
    const aIndex = +a.text.split('.')[0]
    const bIndex = +b.text.split('.')[0]
    if (isNaN(aIndex) && isNaN(bIndex)) {
      const aNum = a.text.match(regex) ? (a.text.match(regex) as string[])[0] : 0
      const bNum = b.text.match(regex) ? (b.text.match(regex) as string[])[0] : 0
      return +aNum - +bNum
    }
    return aIndex - bIndex
  })
}

const getNavLinkKey = (path: string): string => {
  return path.split('/').pop() as string
}

const getFoldStructure = (path: string): SideBar => {
  let result: SideBar = {}
  let item: Item[] = []
  const files = fs.readdirSync(path, { withFileTypes: true })
  for (let file of files) {
    if (isExclude(file)) continue
    if (file.isDirectory()) {
      // 递归调用，返回 SideBar 类型
      result[file.name] = getFoldStructure(`${path}/${file.name}`)
    } else if (file.name.includes('.md')) {
      item.push({
        text: deleteSuffix(file.name),
        link: `${file.name}`
      })
    }
  }
  const key = `${path.replace(DOC, '')}/`
  const sidebar: SideBarItem = { base: `${key}`, items: sortList(item) }
  sidebar.items.length && sideBarMap.set(key, sidebar)
  navLinkMap.set(getNavLinkKey(path), sidebar.items.length ? `${key}${sidebar.items[0].link}` : '')
  result[SIDEBARKEY as unknown as string] = sidebar // 如果需要 symbol 键
  return result
}

getFoldStructure(BASE)

export { navLinkMap, sideBarMap, getNavLinkKey }
