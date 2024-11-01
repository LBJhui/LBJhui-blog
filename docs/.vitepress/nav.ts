import { urlsObject } from './urls'
import fs from 'fs'
import path from 'path'

const getFirstFileName = (url: string) => {
  let result = ''
  const folders = fs.readdirSync(`./docs${url}`, { withFileTypes: true })
  if (!folders.length) {
    return result
  }
  folders.sort((a, b) => {
    const aIndex = +a.name.split('.')[0]
    const bIndex = +b.name.split('.')[0]
    return aIndex - bIndex
  })

  for (let i = 0; i < folders.length; i++) {
    if (path.extname(folders[i].name) === '.md') {
      result = folders[i].name
      break
    }
  }
  if (!result) {
    for (let i = 0; i < folders.length; i++) {
      if (path.extname(folders[i].name) === '.md') {
        result = folders[i].name
        break
      }
    }
  }
  return result
}

const getLink = (url: string) => {
  return `${url}${getFirstFileName(url)}`
}

const nav = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    items: [
      { text: 'CSS', link: getLink(urlsObject.CSS) },
      { text: 'JavaScript', link: getLink(urlsObject.JavaScript) },
      { text: 'Typescript', link: getLink(urlsObject.Typescript) },
      { text: 'Git', link: getLink(urlsObject.Git) },
    ],
  },
  {
    text: '框架&库',
    items: [
      { text: 'Vue', link: getLink(urlsObject.Vue) },
      { text: '前端工程化', link: getLink(urlsObject.engineering) },
      { text: '浏览器', link: getLink(urlsObject.browser) },
      { text: 'nginx', link: getLink(urlsObject.nginx) },
    ],
  },
  {
    text: '面试题',
    link: getLink(urlsObject.interview),
  },
  {
    text: '算法',
    link: getLink(urlsObject.Leetcode),
  },
  {
    text: '更多',
    items: [
      { text: 'code', link: getLink(urlsObject.code) },
      { text: 'python', link: getLink(urlsObject.python) },
      { text: '其他', link: getLink(urlsObject.others) },
      { text: '网址收藏', link: '/guides/others/favorites.md' },
    ],
  },
]

export default nav
