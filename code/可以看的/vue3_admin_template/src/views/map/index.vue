<template>
  <div class="geo" ref="charts"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { my } from 'element-plus/es/locales.mjs'
import { ref, onMounted } from 'vue'
//获取DOM节点
let charts = ref()
onMounted(async () => {
  let myChart = echarts.init(charts.value)
  myChart.showLoading()
  const resp = await import('./data/china.json')
  const users = await import('./data/user.json')

  //注册地图数据
  echarts.registerMap('China', JSON.stringify(resp.default))
  myChart.setOption({
    title: {
      text: '注册用户分布图',
    },
    tooltip: {
      formatter: '{b} 注册用户 {c}人',
    },
    visualMap: {
      // 可视地图，一般用户设置不同颜色来展现数据的差异
      left: 'left', // 可视地图显示的位置
      top: 'center',
      min: 0, // 区间的最小值
      max: 10000,
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
      },
    },
    series: [
      {
        type: 'map',
        map: 'China',
        roam: true, //是否开启鼠标缩放和平移漫游
        scaleLimit: {
          min: 0.7,
          max: 3,
        },
        data: users.default,
      },
    ],
  })
  myChart.hideLoading()
})
</script>

<style scoped lang="scss">
.geo {
  width: 1000px;
  height: 95vh;
}
</style>
