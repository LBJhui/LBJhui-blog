# 第 16 章 DOM2 和 DOM3

DOM1（DOM Level 1）主要定义了 HTML 和 XML 文档的底层结构。DOM2（DOM Level 2）和 DOM3（DOM Level 3）在这些结构之上加入更多交互能力，提供了更高级的 XML 特性。实际上，DOM2 和 DOM3 是按照模块化的思路来制定标准的，每个模块之间有一定关联，但分别针对某个 DOM 子集。这些模式如下所示。

❑ DOM Core：在 DOM1 核心部分的基础上，为节点增加方法和属性。<br />
❑ DOM Views：定义基于样式信息的不同视图。<br />
❑ DOM Events：定义通过事件实现 DOM 文档交互。<br />
❑ DOM Style：定义以编程方式访问和修改 CSS 样式的接口。<br />
❑ DOM Traversal and Range：新增遍历 DOM 文档及选择文档内容的接口。<br />
❑ DOM HTML：在 DOM1 HTML 部分的基础上，增加属性、方法和新接口。<br />
❑ DOM Mutation Observers：定义基于 DOM 变化触发回调的接口。这个模块是 DOM4 级模块，用于取代 Mutation Events。

## 16.1 DOM 的演进

### 16.1.1 XML 命名空间

XML 命名空间可以实现在一个格式规范的文档中混用不同的 XML 语言，而不必担心元素命名冲突。严格来讲，XML 命名空间在 XHTML 中才支持，HTML 并不支持。因此，本节的示例使用 XHTML。

命名空间是使用 `xmlns` 指定的。XHTML 的命名空间是"http://www.w3.org/1999/xhtml"，应该包含在任何格式规范的XHTML页面的`<html>`元素中。

```xml
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    Hello world!
  </body>
</html>
```

对这个例子来说，所有元素都默认属于 XHTML 命名空间。可以使用 xmlns 给命名空间创建一个前缀，格式为“xmlns：前缀”​。为避免混淆，属性也可以加上命名空间前缀。

```xml
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xhtml:head>
    <xhtml:title>Example XHTML page</xhtml:title>
  </xhtml:head>
  <xhtml:body xhtml:class="home">
    Hello world!
  </xhtml:body>
</xhtml:html>
```

如果文档中只使用一种 XML 语言，那么命名空间前缀其实是多余的，只有一个文档混合使用多种 XML 语言时才有必要。

```xml
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width:100%;height:100%">
      <rect x="0" y="0" width="100" height="100" style="fill:red" />
    </svg>
  </body>
</html>
```

#### 1．Node 的变化

在 DOM2 中，Node 类型包含以下特定于命名空间的属性：

❑ localName，不包含命名空间前缀的节点名；<br />
❑ namespaceURI，节点的命名空间 URL，如果未指定则为 null；<br />
❑ prefix，命名空间前缀，如果未指定则为 null。

在节点使用命名空间前缀的情况下，nodeName 等于 prefix + ":" + localName。

```xhtml
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    <s:svg xmlns:s="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width:100%;height:100%">
      <s:rect x="0" y="0" width="100" height="100" style="fill:red" />
    </s:svg>
  </body>
</html>
```
