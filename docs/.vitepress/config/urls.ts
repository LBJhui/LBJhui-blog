import fs from 'fs'

interface Urls {
  [key: string]: string
}

const getUrls = () => {
  const url = './docs/website'
  const folders = fs.readdirSync(url, { withFileTypes: true })
  return handlerFolders(folders) as Urls
}

const handlerFolders = (folders) => {
  let urls = {}
  folders.forEach((item) => {
    if (item.isDirectory() && !item.name.includes('image')) {
      urls[item.name] = `${item.parentPath}/${item.name}/`.slice(6)
      const folders = fs.readdirSync(`${item.parentPath}/${item.name}`, { withFileTypes: true })
      urls = Object.assign(urls, handlerFolders(folders))
    }
  })
  return urls
}

const urlsObject = getUrls()
const urls = [] as string[]
for (const value in urlsObject) {
  urls.push(urlsObject[value])
}

export { urls, urlsObject }
