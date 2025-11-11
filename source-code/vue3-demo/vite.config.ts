import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import { viteMockServe } from 'vite-plugin-mock'
import { preLoadImages } from '../vue3-demo/src/plugin/preLoadImages.ts'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        imports: ['vue', 'vue-router'], // 第三方
        // dirs: ['./src/api'], // 本地
        dts: 'src/types/auto-imports.d.ts', // 生成 ts 声明文件
      }),
      viteMockServe({
        enable: command === 'serve',
      }),
      preLoadImages({
        dir: '*.{jpg,png,svg}',
        attrs: {
          rel: 'preload',
        },
      }),
    ],
    resolve: {
      // src 别名的配置
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @use "@/styles/variable.scss" as *;
          @use "@/L-UI/styles/index.scss" as LUI;
          `,
        },
      },
    },
    build: {
      // 启用source map
      sourcemap: true,
    },
  }
})
