import { urls } from './urls'
import fs from 'fs'
import path from 'path'

interface SideBarItem {
  [key: string]: Array<{ text: string; link: string }>
}

const handlerText = (text) => {
  const textArr = text.split('.')
  if (textArr.length > 2) {
    textArr[1] = ' ' + textArr[1]
    return textArr.join('.').slice(0, -3)
  } else {
    return text.slice(0, -3)
  }
}

const getSideBarItem = (url) => {
  let result = { [url]: [] } as SideBarItem
  const folders = fs.readdirSync(`./docs${url}`, { withFileTypes: true })

  folders.forEach((item) => {
    if (path.extname(item.name) === '.md') {
      result[url].push({ text: handlerText(item.name), link: `${url}${item.name}` })
    }
  })
  result[url].sort((a, b) => {
    const aIndex = +a.text.split('.')[0]
    const bIndex = +b.text.split('.')[0]
    return aIndex - bIndex
  })
  return result
}

const getSideBar = (urlList) => {
  let result = {}
  urlList.forEach((url) => {
    result = Object.assign(result, getSideBarItem(url))
  })
  return result
}

const sidebar = getSideBar(urls)

export default sidebar
