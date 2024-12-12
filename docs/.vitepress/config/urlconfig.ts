import * as fs from 'node:fs'

const DOC = 'docs'
const FILEDIRECTORYNAME = 'website'
const BASE = `${DOC}/${FILEDIRECTORYNAME}`

const folders = fs.readdirSync(BASE, { withFileTypes: true, recursive: true })
const urls = {}
const sidebar = {}
const navLink = {}

// 删除文件后缀名
const deleteSuffix = (name) => {
  const index = name.lastIndexOf('.')
  return name.slice(0, index)
}

const getFolderPath = (folder) => {
  const { path } = folder
  return path.replace(`${DOC}\\`, '').replaceAll('\\', '/')
}

const getNavKey = (key) => {
  return key.slice(key.lastIndexOf('/') + 1)
}

const regex = /\d+/g
const sortList = (list) => {
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

for (let i = 0; i < folders.length; i++) {
  const item = folders[i]
  if (!item.isDirectory() && item.name.endsWith('.md') && !item.name.includes('(no)')) {
    const text = deleteSuffix(item.name)
    const key = getFolderPath(item)
    const sidebarItem = {
      text,
      link: `/${item.name}`,
    }
    urls[key] ? urls[key].push(sidebarItem) : (urls[key] = [sidebarItem])
  }
}

for (let key in urls) {
  const items = sortList(urls[key])
  sidebar[key] = {
    base: key,
    items,
  }
  navLink[getNavKey(key)] = `${key}${items[0].link}`
}

export { sidebar, navLink }
