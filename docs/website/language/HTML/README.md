# HTML 小点知识

## 你不知道的 HTML 属性

**inputmode**: 在移动端，inputmode 值会影响弹出的键盘布局

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

**accesskey**: 可以为元素设置快捷键，当按下快捷键后，可以聚焦元素

```html
<!-- 按下键盘 Alt + b 可聚焦元素-->
<input type="text" accesskey="b" />
```

**tabindex**: 用户可以使用 tab 键切换聚焦的元素，默认情况下，切换的顺序和元素的顺序一致，如果希望不一致，可以通过 tabindex 属性进行手动干预

```html
<input type="text" tabindex="3" />
<input type="text" tabindex="2" />
<input type="text" tabindex="1" />
```

**dir:ltr/rtl**： 该属性可以用于设置内部文字的排版方向

```html
<p dir="ltr">从左往右排版</p>
<p dir="rtl">从右往左排版</p>
<p dir="auto">自动排版</p>
```

**spellcheck**: 该属性可以启用拼写检查，通常用于富文本编辑

```html
<div contenteditable spellcheck="true"></div>
```

**translate**: 使用 translate 可以指定某个元素的内容是否应该触发翻译

```html
<!--开启翻译-->
<div translate="yes">how are you</div>
<!--关闭翻译-->
<div translate="no">how are you</div>
```

**autocapoitalize**：是一个枚举属性，它控制用户输入/编辑文本输入时文本输入是否自动大写，以及如何自动大写。属性必须取下列值之一：

- `off` or `none`: 没有应用自动大写（所有字母都默认为小写字母）。
- `on` or `sentences`: 每个句子的第一个字母默认为大写字母；所有其他字母都默认为小写字母。
- `words`: 每个单词的第一个字母默认为大写字母；所有其他字母都默认为小写字母。
- `characters`: 所有的字母都默认为大写。

在物理键盘上输入时，`autocapitalize` 属性不会影响行为。相反，它会影响其他输入机制的行为，比如移动设备的虚拟键盘和语音输入。这种机制的行为是，它们经常通过自动地将第一个句子的字母大写来帮助用户。`autocapitalize` 属性使作者能够覆盖每个元素的行为。

`autocapitalize` 属性永远不会为带有 `type` 属性，其值为 `url`、`email` 或 `password` 的 `<input>` 元素启用自动大写。

:::details 如何关闭 ios 键盘首字母自动大写

```html
<input type="text" autocapoitalize="off" />
```

:::

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
