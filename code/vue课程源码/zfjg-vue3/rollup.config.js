// rollup 配置
import json from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import ts from 'rollup-plugin-typescript2'

// 最新 node 核心包的导入写法
import path, { format } from 'path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))
// 解决 require is not defined in ES module scope, you can use import instead
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// 根据环境变量中的 target 属性 获取对应模块中的 package.json
const packagesDir = path.resolve(__dirname, 'packages')

// packageDir 打包的基准目录
// 找到要打包的某个包
const packageDir = path.resolve(packagesDir, process.env.TARGET)

// 永远针对的是某个模块
const resolve = (p) => path.resolve(packageDir, p)

const pkg = require(resolve(`package.json`)) // 获取当前模块的 package.json
const name = path.basename(packageDir)
// 对打包类型 先做一个映射表。根据你提供的 formats 来格式化需要打包的内容
const outputConfig = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife', //立即执行函数
  },
}
const options = pkg.buildOptions

function createConfig(format, output) {
  output.name = options.name
  output.sourcemap = true
  // 生成 rollup 配置
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      // 插件
      json(),
      ts({
        // ts 插件
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      resolvePlugin(), // 解析第三方模块插件
    ],
  }
}

// rollup 最终需要导出配置
export default options.formats.map((format) => createConfig(format, outputConfig[format]))
