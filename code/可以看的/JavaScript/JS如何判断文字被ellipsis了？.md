```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .box {
        border: 1px solid gray;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <div class="ellipsis box">
      <span class="content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum
        dolor sit amet consectetur adipisicing elit.
        <span style="font-size: large"> hello world </span>
        <span style="letter-spacing: 20px"> hello world </span>
      </span>
    </div>
  </body>
  <script>
    /**
     *
     * client
     *  clientWidth:表示获取可视区域的宽度，不包括边框，不包括滚动条
     *  clientHeight:表示可视区域的高度，不包括边框，不包括滚动条
     *  clientLeft:表示左边框的宽度
     *  clientTop:表示上边框的宽度
     *  clientX:获取鼠标事件发生时,鼠标距离可视区域的水平坐标
     *  clientY:获取鼠标事件发生时，鼠标距离可视区域的垂直坐标
     *
     * scroll
     *  scrollWidth:获取元素的实际宽度，包括内容的宽度，和padding的宽度，但是不包括border
     *  scrollHeight:获取元素的实际高度，其中包括内容的高度和padding的高度，但是不包括border
     *  scrollTop:获取元素向上滚动的距离
     *  scorllLeft:获取元素向左滚动的距离
     *  scroll兼容性问题
     *    1、谷歌，火狐，iE9+支持
     *      document,body.scrollTop/document.body.scrollLeft
     *    2、IE8以下支持
     *      document.documentElement.scrollTop/document.documentElement.scrollLeft
     *    3、火狐/谷歌/iE9+支持
     *      window.pageYOffset/pageXOffset
     *
     *    function getScroll() {
     *      return {
     *        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
     *        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
     *      }
     *    }
     *
     * offset
     *  offsetWidth返回当前的元素宽度，这个宽度包括内容的宽度 + border的宽度 + padding的宽度。
     *  offsetHeight返回的是当前元素的高度，这个高度包括内容的高度 + border的高度 + padding的高度。
     *  offsetLeft属性存在两种情况
     *    一： 如果当前元素没有脱离文档流，此时，offsetLeft表示获取当前元素到定位父元素左侧的距离，如果父元素没有定位，则继续向上查找，知道找到body为止。
     *    二：如果该标签元素脱离文档流，此时offsetLeft = margin-left + left。
     *  offsetTop属性存在两种情况
     *    一：如果当前元素没有脱离文档流，此时offsetLeft表示获取当前元素到定位父元素上侧的距离，如果父元素没有定位，则继续向上查找，直到找到body为止。
     *    二、如果该标签元素脱离文档流，此时offsetTop = margin-top + top
     *  offsetParent属性表示获取当前元素的最近定位父元素，如果不存在就为body。
     *
     */
    const checkEllipsis = () => {
      let result = {}
      const box = document.querySelector('.box')
      const content = document.querySelector('.content')
      const { pLeft, pRight } = getPadding(box)
      const horizontalPadding = pLeft + pRight
      if (box.clientWidth <= content.offsetWidth + horizontalPadding) {
        result.textContent = '存在省略号'
      } else {
        result.textContent = '容器宽度足够，没有省略号了'
      }
    }

    const getPadding = (dom) => {
      return {
        pLeft: dom.style.paddingLeft || 0,
        pRight: dom.style.paddingRight || 0,
      }
    }
    checkEllipsis()
  </script>
</html>
```
