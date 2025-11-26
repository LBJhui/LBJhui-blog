import { navLinkMap } from './folder'

type Item = { text: string; link: string }
type NavItem = Item | { text: string; items: Item[] }

const nav: NavItem[] = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    items: [
      { text: 'HTML', link: navLinkMap.get('HTML') as string },
      { text: 'CSS', link: navLinkMap.get('CSS') as string },
      { text: 'JavaScript', link: navLinkMap.get('JavaScript') as string },
      { text: 'Git', link: navLinkMap.get('Git') as string }
    ]
  },
  {
    text: '框架&库',
    items: [
      { text: 'Vue', link: navLinkMap.get('Vue') as string },
      { text: '前端工程化', link: navLinkMap.get('engineering') as string },
      { text: '浏览器和网络', link: navLinkMap.get('browser&network') as string },
      { text: '微信环境', link: navLinkMap.get('wx') as string }
    ]
  },
  {
    text: '面试题',
    link: navLinkMap.get('interview') as string
  },
  {
    text: 'Leetcode算法',
    link: navLinkMap.get('Leetcode') as string
  },
  {
    text: '业务场景',
    link: navLinkMap.get('work') as string
  },
  {
    text: '考研',
    items: [
      { text: '数学', link: navLinkMap.get('math') as string },
      { text: '408', link: navLinkMap.get('datastructure') as string }
    ]
  },
  {
    text: '更多',
    items: [
      { text: 'python', link: navLinkMap.get('python') as string },
      { text: '网址收藏', link: navLinkMap.get('more') as string }
    ]
  }
]

export default nav
