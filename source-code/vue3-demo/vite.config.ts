import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 第三方
      // dirs: ['./src/api'], // 本地
      dts: 'src/types/auto-imports.d.ts', // 生成 ts 声明文件
    }),
  ],
})
