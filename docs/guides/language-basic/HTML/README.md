# HTML 小点知识

## 你不知道的 HTML 属性

inputmode: 在移动端，inputmode 值会影响弹出的键盘布局

```html
<!-- 默认值，普通任意文本 -->
<input type="text" inputmode="text" />
<!-- 电话号码 -->
<input type="text" inputmode="tel" />
<!-- url 地址 -->
<input type="text" inputmode="url" />
<!-- 邮箱 -->
<input type="text" inputmode="email" />
<!-- 数字 -->
<input type="text" inputmode="numeric" />
<!-- 小数 -->
<input type="text" inputmode="decimal" />
<!-- 搜索 -->
<input type="text" inputmode="search" />
```

accesskey: 可以为元素设置快捷键，当按下快捷键后，可以聚焦元素

```html
<!-- 按下键盘 Alt + b 可聚焦元素-->
<input type="text" accesskey="b" />
```

tabindex: 用户可以使用 tab 键切换聚焦的元素，默认情况下，切换的顺序和元素的顺序一致，如果希望不一致，可以通过 tabindex 属性进行手动干预

```html
<input type="text" tabindex="3" />
<input type="text" tabindex="2" />
<input type="text" tabindex="1" />
```

dir:ltr/rtl 该属性可以用于设置内部文字的排版方向

```html
<p dir="ltr">从左往右排版</p>
<p dir="rtl">从右往左排版</p>
<p dir="auto">自动排版</p>
```

spellcheck: 该属性可以启用拼写检查，通常用于富文本编辑

```html
<div contenteditable spellcheck="true"></div>
```

translate: 使用 translate 可以指定某个元素的内容是否应该触发翻译

```html
<!--开启翻译-->
<div translate="yes">how are you</div>
<!--关闭翻译-->
<div translate="no">how are you</div>
```

## input 输入框验证

```html
只允许输入数字(整数：小数点不能输入)
<input type="text" onkeyup="value=value.replace(/[^\d]/g,'')" />
允许输入小数(两位小数)
<input type="text" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" />
允许输入小数(一位小数)
<input type="text" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,1})?).*$/g, '$1')" />
开头不能为0，且不能输入小数
<input type="text" onkeyup="value=value.replace(/[^\d]/g,'').replace(/^0{1,}/g,'')" />
```
