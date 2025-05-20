<template>
  <div id="drag-content" ref="contentRef" @dragstart="dragstart" @dragover="dragover" @dragenter="dragenter" @drop="drop" @dragend="dragend">
    <div class="left" data-drop="move">
      <div data-effect="copy" draggable="true" style="background: rgb(26, 231, 156)">语文</div>
      <div data-effect="copy" draggable="true" style="background: rgb(107, 219, 15)">数学</div>
      <div data-effect="copy" draggable="true" style="background: rgb(208, 133, 13)">英语</div>
      <div data-effect="copy" draggable="true" style="background: rgb(30, 98, 246)">物理</div>
      <div data-effect="copy" draggable="true" style="background: rgb(210, 40, 113)">化学</div>
      <div data-effect="copy" draggable="true" style="background: rgb(210, 224, 26)">生物</div>
    </div>
    <div class="right">
      <table>
        <thead>
          <tr>
            <td>星期一</td>
            <td>星期二</td>
            <td>星期三</td>
            <td>星期四</td>
            <td>星期五</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
          </tr>
          <tr>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
          </tr>
          <tr>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
          </tr>
          <tr>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
            <td data-drop="copy"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
const contentRef = ref(null)

const state = reactive({
  source: null as HTMLElement | null,
  dropNode: null
})

const dragover = (e) => {
  // 接受拖放元素
  e.preventDefault()
}

const dragstart = (e) => {
  if (e.target.dataset.effect === 'move') {
    e.dataTransfer.effectAllowed = 'move'
  }
  state.source = e.target
  // 设置拖拽元素的样式
  e.target.style.opacity = '0.2'
}

const dragenter = (e) => {
  const dropNode = getDropNode(e.target)
  // 判断放置元素是否可以接收拖拽元素，当 data-effect 和 data-drop 的值相等时，说明可以
  if (dropNode && dropNode.dataset.drop === (state.source as HTMLElement).dataset.effect) {
    // 给放置元素添加样式
    dropNode.classList.add('hover-background')
  }
}

// 获取最近的可接受拖拽元素的父节点
const getDropNode = (node) => {
  while (node) {
    //  判断元素是否设置了data-drop属性，如果设置了，说明此元素是一个放置元素
    if (node.dataset && node.dataset.drop) {
      return node
    }
    node = node.parentNode
  }
  return node
}

const clearHoverClass = () => {
  document.querySelectorAll('.hover-background').forEach((ele) => ele.classList.remove('hover-background'))
}

const drop = (e) => {
  // 清除hover时的样式
  clearHoverClass()
  // 获取最近的放置节点
  const dropNode = getDropNode(e.target)
  if (dropNode && dropNode.dataset.drop === (state.source as HTMLElement).dataset.effect) {
    // 如果是新增课程
    if (dropNode.dataset.drop === 'copy') {
      dropNode.innerHTML = ''
      const cloned = (state.source as HTMLElement).cloneNode(true)
      if (cloned instanceof HTMLElement) {
        cloned.dataset.effect = 'move'
        cloned.style.opacity = '1'
      }
      dropNode.appendChild(cloned)
      // 移除课程
    } else {
      ;(state.source as HTMLElement).remove()
    }
  }
}

const dragend = (e) => {
  e.target.style.opacity = '1'
}
</script>

<style scoped lang="scss">
#drag-content {
  display: flex;
  .left {
    width: 80px;
    line-height: 32px;
    margin-right: 20px;
    div {
      padding: 10px;
      margin-bottom: 10px;
      text-align: center;
      color: white;
    }
  }

  .right {
    flex: 1;
    table {
      margin: 10px;
      td {
        width: 120px;
        height: 65px;
        div {
          padding: 10px;
          text-align: center;
          color: white;
        }
      }
    }
  }

  .hover-background {
    background-color: aqua;
  }
}
</style>
