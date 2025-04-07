<template>
  <div style="height: 300px; overflow: auto">
    <div id="waterfall" ref="waterfallRef"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const waterfallRef = ref()
const imgWidth = 100 //每张图片的固定宽度

onMounted(() => {
  // 2. 设置每张图片的位置
  const setPoision = () => {
    /**
     * 计算一共有多少列，以及每一列之间的间隙
     */
    const cal = () => {
      const containerWidth = waterfallRef.value.clientWidth //容器的宽度
      console.log('%c 🧀 containerWidth', 'font-size:16px;color:#465975', containerWidth)
      //计算列的数量
      const columns = Math.floor(containerWidth / imgWidth)
      //计算间隙
      const spaceNumber = columns + 1 //间隙数量
      const leftSpace = containerWidth - columns * imgWidth //计算剩余的空间
      const space = leftSpace / spaceNumber //每个间隙的空间
      return {
        space: space,
        columns: columns
      }
    }
    const info = cal() //得到列数，和 间隙的空间
    const nextTops = new Array(info.columns) //该数组的长度为列数，每一项表示该列的下一个图片的纵坐标
    nextTops.fill(0) //将数组的每一项填充为0
    for (let i = 0; i < waterfallRef.value.children.length; i++) {
      const img = waterfallRef.value.children[i]
      //找到nextTops中的最小值作为当前图片的纵坐标
      const minTop = Math.min.apply(null, nextTops)
      img.style.top = minTop + 'px'
      //重新设置数组这一项的下一个top值
      const index = nextTops.indexOf(minTop) //得到使用的是第几列的top值
      nextTops[index] += img.height + info.space
      //横坐标
      const left = (index + 1) * info.space + index * imgWidth
      img.style.left = left + 'px'
      img.style.width = imgWidth + 'px'
      img.style.position = 'absolute'
    }
    const max = Math.max.apply(null, nextTops) //求最大值
    waterfallRef.value.style.height = max + 'px' //3. 设置容器的高度
  }
  const createImgs = () => {
    for (let i = 0; i <= 40; i++) {
      const height = Math.ceil(Math.random() * 100 + 200)
      const src = 'https://picsum.photos/220/' + height
      const img = document.createElement('img')
      img.onload = setPoision
      img.src = src
      waterfallRef.value.appendChild(img)
    }
  }

  // 1. 加入图片元素
  createImgs()
})
</script>

<style scoped>
#waterfall {
  position: relative;
}
</style>
