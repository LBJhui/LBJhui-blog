// 把 packages 目录下的所有包都进行打包

import { readdirSync, statSync } from 'fs';
import { execa } from 'execa'; // 开启子进程 进行打包，最终还是使用 rollup 来进行打包

// 同步地读取目录的内容，返回目录中所有文件和子目录的名称数组。
// fs.statSync() 是 Node.js 中文件系统（fs）模块的一个方法，用于同步地获取文件或目录的状态信息。这个方法返回一个 fs.Stats 对象，其中包含有关文件或目录的详细信息，如文件大小、创建时间、修改时间、访问时间等。
// 判断一个对象是否是文件夹
const targets = readdirSync('packages').filter((f) => {
  if (!statSync(`packages/${f}`).isDirectory()) {
    return false;
  }
  return true;
});

// 对我们目标进行依次打包，并行打包
async function build(target) {
  await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], { stdio: 'inherit' }); // 当子进程打包的信息共享给父进程
}
function runParallel(targets, iteratorFn) {
  const res = [];
  for (const item of targets) {
    const p = iteratorFn(item);
    res.push(p);
  }
  return Promise.all(res);
}

runParallel(targets, build);

const reg = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1589]))\d{8}$/;
