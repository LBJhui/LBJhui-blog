import { navLink } from './urlconfig'

const nav = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    items: [
      { text: 'CSS', link: navLink['CSS'] },
      { text: 'JavaScript', link: navLink['JavaScript'] },
      { text: 'Git', link: navLink['Git'] }
    ]
  },
  {
    text: '框架&库',
    items: [
      // { text: 'Vue', link: getLink(urlsObject.Vue) },
      { text: '前端工程化', link: navLink['engineering'] },
      { text: '浏览器和网络', link: navLink['browser&network'] },
      { text: '小程序', link: navLink['miniprogram'] }
      // { text: 'nginx', link: getLink(urlsObject.nginx) },
    ]
  },
  {
    text: '面试题',
    link: navLink['interview']
  },
  {
    text: 'Leetcode算法',
    link: navLink['Leetcode']
  },
  {
    text: '业务场景',
    link: navLink['work']
  },
  {
    text: '更多',
    items: [
      // { text: 'code', link: getLink(urlsObject.code) },
      { text: 'python', link: navLink['python'] },
      { text: '网址收藏', link: navLink['more'] }
    ]
  }
]

export default nav
