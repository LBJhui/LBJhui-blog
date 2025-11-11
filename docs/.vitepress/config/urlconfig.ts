import * as fs from 'node:fs'

const DOC = 'docs'
const BASE = `${DOC}/website`
const SIDEBARKEY = Symbol('sidebar')
const regex = /\d+/g
const sideBarMap = new Map()
const navLinkMap = new Map()

// 排除
const isExclude = (file: fs.Dirent) => {
  return file.parentPath.includes('images') || file.parentPath.includes('components') || file.name === 'images' || file.name === 'components'
}
// 删除文件后缀名
const deleteSuffix = (name: string) => {
  const index = name.lastIndexOf('.')
  return name.slice(0, index)
}

// 排序
const sortList = (list: any[]) => {
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

const getNavLinkKey = (path: string) => {
  return path.split('/').pop()
}

const getFoldStructure = (path: string) => {
  let result = {}
  let item = []
  const files = fs.readdirSync(path, { withFileTypes: true })
  for (let file of files) {
    if (isExclude(file)) continue
    if (file.isDirectory()) {
      result[file.name] = getFoldStructure(`${path}/${file.name}`)
    } else if (file.name.includes('.md')) {
      item.push({
        text: deleteSuffix(file.name),
        link: `${file.name}`
      })
    }
  }
  const key = `${path.replace(DOC, '')}/`
  const sidebar = { base: `${key}`, items: sortList(item) }
  sidebar.items.length && sideBarMap.set(key, sidebar)
  navLinkMap.set(getNavLinkKey(path), sidebar.items.length ? `${key}${sidebar.items[0].link}` : '')
  result[SIDEBARKEY] = sidebar
  return result
}

getFoldStructure(BASE)

export { navLinkMap, sideBarMap, getNavLinkKey }
