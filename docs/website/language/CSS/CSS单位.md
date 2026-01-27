# CSS 中的单位

## CSS 新单位：vmin 和 vmax

1. **vmin**

`vmin` 表示相对于视口宽度和高度中较小者的百分比。

2. **vmax**

`vmax` 表示相对于视口宽度和高度中较大者的百分比。

例如，如果视口的宽度为 1000px，高度为 800px，那么 1vmax 就等于 10px（即 1000px 的 0.1），1vmin 就等于 8px（即 800px 的 0.1）。

使用 vmin 和 vmax 单位可以根据视口的宽度和高度来设置元素的大小，实现响应式布局。

## CSS 新增的单位 ch

在 CSS 中，`ch` 是一个相对单位，它代表数字 0（零）的宽度，在当前的字体和字体大小下的度量。这个单位特别适用于需要基于字符宽度进行布局的场景，比如保持文本的垂直对齐或者在元素内部确保一定的空间以容纳文本字符。

%——百分比
in——寸
cm——厘米
mm——毫米
pt——point，大约 1/72 寸；
pc——pica，大约 6pt，1/6 寸；
px——屏幕的一个像素点；
em——元素的 font-size；
ex——font-size 的 x-height 值，为小写字母 x 的高度，通常相当于 font-size 的一半。

ch——字符 0(零)的宽度；
rem——根元素(html 元素)的 font-size；
vw——viewpoint width，视窗宽度，1vw 等于视窗宽度的 1%；
vh——viewpoint height，视窗高度，1vh 等于视窗高度的 1%；
vmin——vw 和 vh 中较小的那个。
