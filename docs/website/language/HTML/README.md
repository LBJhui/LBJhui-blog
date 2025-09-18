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
