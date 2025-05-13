<template>
  <div id="drag-content" ref="contentRef">
    <div class="left" data-drop="move">
      <div draggable="true" style="background: rgb(26, 231, 156)">语文</div>
      <div draggable="true" style="background: rgb(107, 219, 15)">数学</div>
      <div draggable="true" style="background: rgb(208, 133, 13)">英语</div>
      <div draggable="true" style="background: rgb(30, 98, 246)">物理</div>
      <div draggable="true" style="background: rgb(210, 40, 113)">化学</div>
      <div draggable="true" style="background: rgb(210, 224, 26)">生物</div>
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
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const contentRef = ref(null)
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
      }
    }
  }
}
</style>
