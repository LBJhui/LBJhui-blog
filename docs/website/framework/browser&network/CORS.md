# 跨域

## CORS 策略

CORS（Cross-Origin Resource Sharing）

CORS 是一套机制，用于浏览器校验跨域请求

它的基本理念是：

只要服务器明确表示允许，则校验通过

服务器明确拒绝或没有表示，则校验不通过

CORS 将请求分为两类

**简单请求**

- 请求方法为 GET、HEAD、POST
- 头部字段满足 CORS 安全规范
- 请求头的 Content-Type 为
  text/plain
  multipart/form-data
  application/x-www-form-urlencoded

**预检请求**

非简单请求
