```javascript
console.log(++[[]][+[]]+[+[]]) // '10'
+[] // 0
++[[]][0]+[0]
++[] +'0'
1 + '0'
```

非原始类型转 number，先调用 `valueOf`，不行的话调用 `toString`

---

### 前端项目中使用过的前端安全措施

1. 数据传输加密
2. 输入验证和过滤
3. 访问控制和权限管理
4. 安全编码
5. 扫描漏洞和安全测试

### rem 和 em 区别

```
相对于 font-size
em 针对于父元素的font-size
rem针对于根（html）元素的font-size
```

```javascript
// 漩涡型二维数组
function vortex(n, m) {
  const nums = new Array(n).fill(0).map(() => new Array(m).fill(0))
  let i = 0
  let j = 0
  let count = 1
  let stepI = 0
  let stepJ = 1
  function _hasBlock() {
    return !nums[i + stepI] || nums[i + stepI][j + stepJ] !== 0
  }
  while (1) {
    nums[i][j] = count++
    if (_hasBlock()) {
      if (stepI === 0) {
        stepI = stepJ
        stepJ = 0
      } else {
        stepJ = -stepI
        stepI = 0
      }
      if (_hasBlock()) {
        break
      }
    }
    i += stepI
    j += stepJ
  }
  return nums
}
```
