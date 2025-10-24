// .eslintrc.js
module.exports = {
  root: true, // 停止在父级目录中寻找
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true,
    node: true
  },
  parser: 'vue-eslint-parser',
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    // 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    'no-mutating-props': 'off',
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-explicit-any': ['off'],
    'vue/comment-directive': 'off',
    'no-alert': 0, // 禁止使用alert confirm prompt
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-dupe-args': 2, // 函数参数不能重复
    'no-duplicate-case': 2, // switch中的case标签不能重复
    'no-duplicate-imports': [
      1,
      {
        includeExports: true
      }
    ] // 不允许重复导入
  }
};
