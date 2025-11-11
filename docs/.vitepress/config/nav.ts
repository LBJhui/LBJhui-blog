import { navLinkMap } from './urlConfig'

const nav = [
  { text: '首页', link: '/' },
  {
    text: '前端基础',
    items: [
      { text: 'HTML', link: navLinkMap.get('HTML') },
      { text: 'CSS', link: navLinkMap.get('CSS') },
      { text: 'JavaScript', link: navLinkMap.get('JavaScript') },
      { text: 'Git', link: navLinkMap.get('Git') }
    ]
  },
  {
    text: '框架&库',
    items: [
      { text: 'Vue', link: navLinkMap.get('Vue') },
      { text: '前端工程化', link: navLinkMap.get('engineering') },
      { text: '浏览器和网络', link: navLinkMap.get('browser&network') },
      { text: '微信环境', link: navLinkMap.get('wx') }
    ]
  },
  {
    text: '面试题',
    link: navLinkMap.get('interview')
  },
  {
    text: 'Leetcode算法',
    link: navLinkMap.get('Leetcode')
  },
  {
    text: '业务场景',
    link: navLinkMap.get('work')
  },
  {
    text: '考研',
    items: [
      { text: '数学', link: navLinkMap.get('math') },
      { text: '408', link: navLinkMap.get('王道笔记') }
    ]
  },
  {
    text: '更多',
    items: [
      { text: 'python', link: navLinkMap.get('python') },
      { text: '网址收藏', link: navLinkMap.get('more') }
    ]
  }
]

export default nav
