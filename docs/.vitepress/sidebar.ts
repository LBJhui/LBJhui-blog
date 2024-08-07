import fs from 'fs';
import path from 'path';
import { cssUrl, vueUrl } from './urls';

interface SideBarItem {
  [key: string]: Array<{ text: string; link: string }>;
}
const getSideBarItem = (url) => {
  let result = { [url]: [] } as SideBarItem;
  const folders = fs.readdirSync(`./docs${url}`, { withFileTypes: true });
  folders.forEach((item) => {
    if (path.extname(item.name) === '.md') {
      result[url].push({ text: item.name, link: `${url}${item.name}` });
    }
  });
  return result;
};

const getSideBar = (urlList) => {
  let result = {};
  urlList.forEach((url) => {
    result = Object.assign(result, getSideBarItem(url));
  });
  return result;
};

const sidebar = getSideBar([cssUrl, vueUrl]);

export default sidebar;
