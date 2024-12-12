import * as fs from 'node:fs'

/**
 * sidebar
 *  /website/language/JavaScript/': [
 *    { text: '1. 变量声明(var,let和const)', link: '/website/language/JavaScript/1.变量声明(var,let和const).md' }
 *  ],
 *
 * nav
 *  [{ text: 'Leetcode算法', link: '/website/Leetcode/0. (no)list.md' },]
 */

const BASE = 'docs/website'
const folders = fs.readdirSync(BASE, { withFileTypes: true, recursive: true })
const urls = {}
const sidebar = {}
const navLink = {}
const rewrites = {}

// 删除文件后缀名
const deleteSuffix = (name) => {
  const index = name.lastIndexOf('.')
  return name.slice(0, index)
}

const formatterPath = (path) => {
  return path.replace('docs', '').replaceAll('\\', '/')
}

const getFolderPath = (folder) => {
  return formatterPath(folder.path)
}
const getFilePath = (folder) => {
  const { path, name } = folder
  return `${formatterPath(path)}/${name}`
}

const getNavKey = (key) => {
  return key.slice(key.lastIndexOf('/') + 1)
}

const getRewrites = (folder) => {
  return `/${getNavKey(getFolderPath(folder))}/${folder.name}`
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
    const sidebarItem = {
      text: deleteSuffix(item.name),
      link: getFilePath(item),
    }
    rewrites[getFilePath(item)] = getRewrites(item)
    urls[getFolderPath(folders[i])] ? urls[getFolderPath(folders[i])].push(sidebarItem) : (urls[getFolderPath(folders[i])] = [sidebarItem])
  }
}

for (let key in urls) {
  sidebar[key] = sortList(urls[key])
  navLink[getNavKey(key)] = sidebar[key][0].link
}

export { sidebar, navLink, rewrites }
