import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'

export default ({ command, mode }) => {
  return defineConfig({
    plugins: [
      vue(),
      eslintPlugin({
        exclude: ['./node_modules/**'],
        cache: false
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 设置 `@` 指向 `src` 目录
      }
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        less: {
          charset: false,
          additionalData: '@import "./src/assets/style/global.less";'
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8000,
      hmr: true,
      // 是否自动在浏览器打开
      open: true,
      // 是否开启 https
      https: false,
      // 服务端渲染
      // ssr: false,
      base: process.env.VITE_BASE_URL
    }
  })
}
