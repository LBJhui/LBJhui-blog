# HTML 小点知识

## 你不知道的 HTML 属性

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

## ruby 拼音标记

<ruby style="ruby-align: center;ruby-position: top;"> 汉 <rp>(</rp><rt>Han</rt><rp>)</rp> 字 <rp>(</rp><rt>zi</rt><rp>)</rp> </ruby>

```html
<style>
  ruby {
    ruby-align: center;
    ruby-position: top;
  }
</style>
<ruby> 汉 <rp>(</rp><rt>Han</rt><rp>)</rp> 字 <rp>(</rp><rt>zi</rt><rp>)</rp> </ruby>
```

## `<b>`和`<strong>`的区别

`<b>`和`<strong>`的区别主要体现在语义和用途上：

### 语义差异

- **`<b>`**：仅表示文字加粗，无语义强调作用，主要用于视觉呈现。
- **`<strong>`**：表示内容的重要性或强调，默认以粗体显示，但核心是传递语义。

### 适用场景

- **`<b>`**：适用于需要突出显示但无强调语义的场景，如产品名称、关键词等。
- **`<strong>`**：更适合强调关键信息（如警告、重要指令等），有助于提升可读性并优化 SEO。

### 无障碍特性

- `<strong>`标签会被:ml-search-more[无障碍阅读器]{text="无障碍阅读器"}特别处理（如重读），而`<b>`仅改变样式。
