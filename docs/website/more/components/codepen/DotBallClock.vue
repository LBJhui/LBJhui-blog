<template>
  <div class="dot-clock-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref(null)
let canvas, context
// 固定画布尺寸
const WINDOW_WIDTH = 600
const WINDOW_HEIGHT = 400
const RADIUS = 5 // 缩小小球半径
const NUMBER_GAP = 8 // 数字间隙缩小
const u = 0.65 // 碰撞损耗系数

let balls = [] // 下落小球数组
let currentNums = [] // 当前点阵数字
let timerId = null // 帧定时器ID

// 彩色小球色板
const colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC', '#99CC00', '#669900', '#FFBB33', '#FF8800', '#FF4444', '#CC0000']

// 0-9 + 冒号 : 的点阵矩阵
const digit = [
  // 0
  [
    [0, 0, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0]
  ],
  // 1
  [
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1, 1, 1]
  ],
  // 2
  [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 1, 1, 1, 1, 1]
  ],
  // 3
  [
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0]
  ],
  // 4
  [
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1]
  ],
  // 5
  [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0]
  ],
  // 6
  [
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0]
  ],
  // 7
  [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0]
  ],
  // 8
  [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0]
  ],
  // 9
  [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 0, 0]
  ],
  // 冒号 :
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
]

// 绘制单个点阵数字，返回下一个数字起始X
function drawSingleNumber(offsetX, offsetY, num, cxt) {
  const numMatrix = digit[num]
  const cellStep = RADIUS * 1.6 // 缩小格子间距
  for (let y = 0; y < numMatrix.length; y++) {
    for (let x = 0; x < numMatrix[y].length; x++) {
      if (numMatrix[y][x] === 1) {
        cxt.beginPath()
        cxt.arc(offsetX + RADIUS + cellStep * x, offsetY + RADIUS + cellStep * y, RADIUS, 0, 2 * Math.PI)
        cxt.fill()
      }
    }
  }
  offsetX += numMatrix[0].length * cellStep
  return offsetX
}

// 数字变化时生成下落彩球
function addBalls(item) {
  const num = item.num
  const numMatrix = digit[num]
  const cellStep = RADIUS * 1.6
  for (let y = 0; y < numMatrix.length; y++) {
    for (let x = 0; x < numMatrix[y].length; x++) {
      if (numMatrix[y][x] === 1) {
        const ball = {
          offsetX: item.offsetX + RADIUS + cellStep * x,
          offsetY: 40 + RADIUS + cellStep * y,
          color: colors[Math.floor(Math.random() * colors.length)],
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 10)) * 3 + Math.random(),
          vy: -4
        }
        balls.push(ball)
      }
    }
  }
}

// 渲染所有下落小球
function renderBalls(cxt) {
  for (const ball of balls) {
    cxt.beginPath()
    cxt.fillStyle = ball.color
    cxt.arc(ball.offsetX, ball.offsetY, RADIUS, 0, 2 * Math.PI)
    cxt.fill()
  }
}

// 更新小球位置、重力、边界碰撞
function updateBalls() {
  let i = 0
  for (let index = 0; index < balls.length; index++) {
    const ball = balls[index]
    ball.offsetX += ball.vx
    ball.offsetY += ball.vy
    ball.vy += ball.g
    // 底部地面反弹
    if (ball.offsetY > WINDOW_HEIGHT - RADIUS) {
      ball.offsetY = WINDOW_HEIGHT - RADIUS
      ball.vy = -ball.vy * u
    }
    // 左右边界内保留，超出丢弃
    if (ball.offsetX > RADIUS && ball.offsetX < WINDOW_WIDTH - RADIUS) {
      balls[i] = ball
      i++
    }
  }
  // 清理超出边界小球
  balls.length = i
}

// 绘制完整时分秒点阵时钟，对比新旧数字生成掉落小球
function drawDatetime(cxt) {
  cxt.fillStyle = '#005eac'
  const date = new Date()
  let offsetX = 60 // 整体右移一点，水平居中
  const offsetY = 140 // 垂直居中
  const nums = []

  // 时
  const hours = date.getHours()
  nums.push({ num: Math.floor(hours / 10) })
  nums.push({ num: hours % 10 })
  nums.push({ num: 10 })
  // 分
  const minutes = date.getMinutes()
  nums.push({ num: Math.floor(minutes / 10) })
  nums.push({ num: minutes % 10 })
  nums.push({ num: 10 })
  // 秒
  const seconds = date.getSeconds()
  nums.push({ num: Math.floor(seconds / 10) })
  nums.push({ num: seconds % 10 })

  // 绘制所有数字
  for (let x = 0; x < nums.length; x++) {
    nums[x].offsetX = offsetX
    offsetX = drawSingleNumber(offsetX, offsetY, nums[x].num, cxt)
    if (x < nums.length - 1) {
      if (nums[x].num !== 10 && nums[x + 1].num !== 10) {
        offsetX += NUMBER_GAP
      }
    }
  }

  // 首次初始化数字缓存
  if (currentNums.length === 0) {
    currentNums = JSON.parse(JSON.stringify(nums))
  } else {
    // 数字变化，生成掉落小球
    for (let index = 0; index < currentNums.length; index++) {
      if (currentNums[index].num !== nums[index].num) {
        addBalls(nums[index])
        currentNums[index].num = nums[index].num
      }
    }
  }

  renderBalls(cxt)
  updateBalls()
}

// 初始化画布与渲染循环
async function initCanvas() {
  canvas = canvasRef.value
  context = canvas.getContext('2d')
  canvas.width = WINDOW_WIDTH
  canvas.height = WINDOW_HEIGHT

  // 50ms刷新一帧
  timerId = setInterval(() => {
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
    drawDatetime(context)
  }, 50)
}

onMounted(async () => {
  await nextTick()
  initCanvas()
})

// 组件销毁：清除定时器，释放数据
onUnmounted(() => {
  if (timerId) clearInterval(timerId)
  balls = []
  currentNums = []
})
</script>

<style scoped>
.dot-clock-wrap {
  width: 600px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
  background: #000;
}
</style>
