import { defineConfig } from 'vite'
import { vitepressPlugin } from 'vitepress'

export default defineConfig({
  plugins: [vitepressPlugin()],
  build: {
    rollupOptions: {
      output: {
        // 自定义输出目录
        dir: 'dist-custom',
        // 自定义入口文件名称
        entryFileNames: '[name].js',
        // 自定义块文件名称，例如 CSS 和 assets
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
