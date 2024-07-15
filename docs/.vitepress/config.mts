import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'LBJhui-blog',
  description: '随便写写，没什么想法',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      {
        text: '前端',
        items: [
          { text: 'html', link: '/markdown-examples' },
          { text: 'CSS', link: '/css/1.CSS Grid 网格布局教程' },
          { text: 'JavaScript', link: '/api-examples' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'CSS',
        items: [{ text: '1. CSS Grid 网格布局教程', link: '/css/1.CSS Grid 网格布局教程' }],
      },
      {
        text: 'JavaScript',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/LBJhui/LBJhui-blog' }],
  },
});
