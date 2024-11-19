# CSS 小点知识

## CSS 伪类和伪元素

|        | 语法 | 数量 |    位置    | 类与元素 | 使用场景 |
| :----: | :--: | :--: | :--------: | :------: | :------: |
|  伪类  | `:`  | 多个 | 前方和后方 |   修饰   |    多    |
| 伪元素 | `::` | 单个 |    后方    | 创建对象 |    少    |

**使用场景**

- 伪类
  - 状态类：`:link` `:visited` `:hover` `:active` `:focus`
  - 结构类：`:first-child` `:last-child` `:nth-child` `:ninth-of-type`
  - 表单类：`:checked` `:disabled` `:valid` `:required`
  - 语言类：`:dir` `:lang`
- 伪元素
  - `::before` `::after`
  - `::first-letter` `::first-line`
  - `::selection`
  - `::placeholder`
  - `::backdrop`

## 修改 input 中 placeholder 的字体颜色

```css
.mint {
  background-color: #f5f5f5;
  color: #cccccc;
  padding-left: 10px;
}

.mint::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #cccccc;
  font-size: 10px;
}

.mint:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #cccccc;
  font-size: 10px;
}

.mint::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #cccccc;
  font-size: 10px;
}

.mint:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #cccccc;
  font-size: 10px;
}
```
