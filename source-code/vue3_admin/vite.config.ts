import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite' //模块自动导入
import { preLoadImages } from './src/plugin/preLoadImages.ts'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        enable: command === 'serve',
      }),
      VueDevTools(),
      AutoImport({
        imports: ['vue', 'vue-router'], // 第三方
        // dirs: ['./src/api'], // 本地
        dts: 'src/types/auto-imports.d.ts', // 生成 ts 声明文件
      }),
      preLoadImages({
        dir: '*.{jpg,png,svg}',
        attrs: {
          rel: 'preload',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
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
