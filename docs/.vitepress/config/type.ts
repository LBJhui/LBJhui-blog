type Item = {
  link: string
  text: string
}

type SideBarItem = {
  base: string
  items: Array<Item | SideBarItem>
  text?: string // 可选属性，用于合并后的标题
  collapsed?: boolean // 可选属性，表示是否折叠
}

// 递归类型：可以是嵌套的 SideBar 或 SideBarItem
type SideBar = {
  [key: string]: SideBar | SideBarItem
}

export { Item, SideBarItem, SideBar }
