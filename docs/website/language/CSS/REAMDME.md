# tips

- inital: 默认值
- unset 清除浏览器样式
- revert 使用浏览器的样式

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

## iOS 底部安全距离

```css
padding-bottom: constant(safe-area-inset-bottom);
padding-bottom: env(safe-area-inset-bottom);
```
