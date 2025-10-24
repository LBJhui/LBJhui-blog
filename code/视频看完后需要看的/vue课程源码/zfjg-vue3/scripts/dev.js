// 只针对具体的某个包打包
import { readdirSync, statSync } from 'fs'
import { execa } from 'execa' // 开启子进程 进行打包，最终还是使用 rollup 来进行打包

const target = 'reactivity'

build(target)
// 对我们目标进行依次打包，并行打包
async function build(target) {
  await execa('rollup', ['-c', '--environment', `TARGET:${target}`], { stdio: 'inherit' }) // 当子进程打包的信息共享给父进程
}
