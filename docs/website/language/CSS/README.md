# tips

- inital: 默认值
- unset 清除浏览器样式
- revert 使用浏览器的样式

## iOS 底部安全距离

```css
padding-bottom: constant(safe-area-inset-bottom);
padding-bottom: env(safe-area-inset-bottom);
```

## `display` 都有哪些属性

|        值        |                         描述                         |
| :--------------: | :--------------------------------------------------: |
|     **none**     |                  此元素不会被显示。                  |
|    **block**     |   此元素将显示为块级元素，此元素前后会带有换行符。   |
|    **inline**    | 默认。此元素会被显示为内联元素，元素前后没有换行符。 |
| **inline-block** |                     行内块元素。                     |
|    **table**     |   此元素会作为块级表格来显示，表格前后带有换行符。   |
|   **inherit**    |       规定应该从父元素继承 display 属性的值。        |
|     **flex**     |                     弹性盒模型。                     |
|     **grid**     |                      网格布局。                      |
