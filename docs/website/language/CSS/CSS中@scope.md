# 说说你对 CSS 中@scope 的了解

`@scope` 可以实现 CSS 选择器的嵌套书写。支持复杂选择器。

`@scope` 规则内选择器的优先级是计算在内的，也就是下面这段 CSS 代码中 a 元素的优先级等同于 `nav a`。

```css
@scope (nav) {
  a {
  }
}
```

`:scope` 伪类，可以匹配 `@scope` 函数中选择器匹配的元素。

如果希望范围内的某个元素不参与选择器匹配，可以使用 `to (xxx)`的语法

```html
<style>
  @scope (nav) to (p) {
    :scope {
      border: double red;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: inline-block;
    }
    a {
      display: block;
      padding: 6px 12px;
      text-decoration: none;
      background: skyblue;
    }
  }
</style>
<nav>
  <ul>
    <li><a href="">链接1</a></li>
    <li><a href="">链接2</a></li>
    <li><a href="">链接3</a></li>
  </ul>
  <p><a>我呢？</a></p>
</nav>
```

![参考链接](https://www.zhangxinxu.com/wordpress/2024/01/css-at-scope/)
