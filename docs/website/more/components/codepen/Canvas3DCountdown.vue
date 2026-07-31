<template>
  <div class="canvas-3d-clock-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref(null)
const containerRef = ref(null)

let canvas, ctx, shapeCan, sCtx
const FIX_W = 600
const FIX_H = 400

let width = FIX_W
let height = FIX_H

let vanishPointY = height / 2
let vanishPointX = width / 2

let focalLength = 300
let angle = 0,
  angleY = 0,
  angleX = 0,
  angleZ = 0
let mouseX = 0,
  mouseY = 0

let emitter = null
let requestAnimationFrameId = null
let datGuiScript = null
let gui = null

const settings = {
  MouseRotation: false,
  ClockColor: {
    r: 0,
    g: 0,
    b: 0
  }
}

function loadDatGui() {
  return new Promise((resolve) => {
    if (window.dat) return resolve(window.dat)

    datGuiScript = document.createElement('script')
    datGuiScript.src = 'https://cdn.bootcdn.net/ajax/libs/dat-gui/0.7.9/dat.gui.min.js'
    datGuiScript.onload = () => resolve(window.dat)
    document.body.appendChild(datGuiScript)
  })
}

function Particle(options) {
  options = options || {}

  this.maxDist = 1000

  this.x = options.x || Math.random() * 10 - 5
  this.y = options.y || Math.random() * 10 - 5
  this.z = options.z || Math.random() * 10 - 5

  this.startX = this.x
  this.startY = this.y
  this.startZ = this.z

  this.xPos = 0
  this.yPos = 0

  this.angle = 0

  this.vx = 0
  this.vy = 0
  this.vz = 0

  this.color = [0, 0, 0, 255]
  this.render = true
  this.scaler = 2
}

Particle.prototype.explode = function () {
  this.vx = Math.random() * 30 - 15
  this.vy = Math.random() * 30 - 15
  this.vz = Math.random() * 30 - 15
}

Particle.prototype.rotate = function () {
  let x = this.startX * Math.cos(angleZ) - this.startY * Math.sin(angleZ)
  let y = this.startY * Math.cos(angleZ) + this.startX * Math.sin(angleZ)

  this.x = x
  this.y = y

  x = this.startX * Math.cos(angleY) - this.startZ * Math.sin(angleY)
  let z = this.startZ * Math.cos(angleY) + this.startX * Math.sin(angleY)

  this.x = x
  this.z = z

  y = this.startY * Math.cos(angleX) - this.startZ * Math.sin(angleX)
  z = this.startZ * Math.cos(angleX) + this.startY * Math.sin(angleX)

  this.y = y
  this.z = z
}

Particle.prototype.update = function () {
  this.x = this.startX += this.vx
  this.y = this.startY += this.vy
  this.z = this.startZ -= this.vz

  this.rotate()

  this.render = false

  if (this.z > -focalLength) {
    const scale = focalLength / (focalLength + this.z)

    this.size = scale * this.scaler

    this.xPos = vanishPointX + this.x * scale
    this.yPos = vanishPointY + this.y * scale

    const dx = this.startX - this.x
    const dy = this.startY - this.y
    const dz = this.startZ - this.z

    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

    if (dist < this.maxDist) {
      this.render = true
    }
  }
}

function Emitter() {
  this.particles = []
  this.shapeParts = []

  this.x = 1
  this.y = 1
  this.z = 1

  this.getShape()

  this.startTime = new Date().getTime()
  this.checkInterval = 200
}

Emitter.prototype.update = function () {
  const partLen = this.particles.length

  if (settings.MouseRotation) {
    angleX = (mouseY - vanishPointY) * 0.01
    angleY = (mouseX - vanishPointX) * 0.01
  } else {
    angleY = Math.sin((angle += 0.01))
    angleX = Math.sin(angle)
    angleZ = Math.sin(angle)
  }

  this.particles.sort((a, b) => b.z - a.z)

  for (let i = 0; i < partLen; i++) {
    const particle = this.particles[i]
    if (particle) particle.update()
  }
}

Emitter.prototype.getShape = function () {
  const d = new Date()
  const hour = d.getHours() % 12
  const min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
  const sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds()
  const text = `${hour}:${min}:${sec}`

  sCtx.clearRect(0, 0, shapeCan.width, shapeCan.height)
  sCtx.font = '3em Arial'
  // 计算文字宽度，水平居中
  const textWidth = sCtx.measureText(text).width
  const textX = (shapeCan.width - textWidth) / 2
  // 【关键修复1】提高文字Y坐标，给顶部留出足够安全边距，避免顶部裁切
  const textY = 70
  sCtx.fillText(text, textX, textY)

  const imageData = sCtx.getImageData(0, 0, shapeCan.width, shapeCan.height).data

  for (let i = 0; i < imageData.length; i += 4) {
    const x = (i / 4) % shapeCan.width
    const y = Math.floor(i / 4 / shapeCan.width)
    const index = i

    if (imageData[i + 3] > 0) {
      for (let p = 0; p < 4; p++) {
        if (!this.shapeParts[index + p]) {
          const particle = new Particle({
            // 【关键修复2】微调粒子整体偏移，时钟文字在画布居中
            x: x * 2 - 220,
            y: y * 2 - 90,
            z: 10
          })

          this.shapeParts[index + p] = particle
          this.particles[index + p] = particle
        }
      }
    } else {
      for (let p = 0; p < 4; p++) {
        if (this.shapeParts[index + p]) {
          this.shapeParts[index + p].explode()
          this.shapeParts[index + p] = undefined
        }
      }
    }
  }
}

Emitter.prototype.render = function () {
  if (new Date().getTime() > this.startTime + this.checkInterval) {
    this.startTime = new Date().getTime()
    this.getShape()
  }

  const imgData = ctx.createImageData(width, height)
  const data = imgData.data

  const partLen = this.particles.length

  for (let i = 0; i < partLen; i++) {
    const particle = this.particles[i]

    if (particle && particle.render && particle.xPos < width && particle.xPos > 0 && particle.yPos > 0 && particle.yPos < height) {
      for (let w = 0; w < particle.size; w++) {
        for (let h = 0; h < particle.size; h++) {
          if (particle.xPos + w < width && particle.xPos + w > 0 && particle.yPos + h > 0 && particle.yPos + h < height) {
            const pData = (~~(particle.xPos + w) + ~~(particle.yPos + h) * width) * 4

            data[pData] = settings.ClockColor.r
            data[pData + 1] = settings.ClockColor.g
            data[pData + 2] = settings.ClockColor.b
            data[pData + 3] = particle.color[3]
          }
        }
      }
    } else if (particle && !particle.render) {
      this.particles[i] = undefined
    }
  }

  ctx.putImageData(imgData, 0, 0)
}

function renderLoop() {
  emitter.update()
  emitter.render()

  requestAnimationFrameId = requestAnimationFrame(renderLoop)
}

async function initCanvas() {
  await loadDatGui()

  canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  shapeCan = document.createElement('canvas')
  shapeCan.width = 400
  shapeCan.height = 120
  sCtx = shapeCan.getContext('2d')
  sCtx.font = '3em Arial'

  resizeCanvas()

  emitter = new Emitter()
  renderLoop()

  gui = new window.dat.GUI()

  gui.add(settings, 'MouseRotation').name('鼠标控制旋转')
  gui.addColor(settings, 'ClockColor').name('时钟粒子颜色')

  const guiDom = gui.domElement
  if (guiDom && containerRef.value) {
    containerRef.value.appendChild(guiDom)
    guiDom.style.position = 'absolute'
    guiDom.style.top = '8px'
    guiDom.style.right = '8px'
    guiDom.style.zIndex = '10'
    guiDom.style.pointerEvents = 'auto'
  }

  const mouseMoveHandler = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  window.addEventListener('mousemove', mouseMoveHandler)
  window.addEventListener('resize', resizeCanvas)
}

function resizeCanvas() {
  width = FIX_W
  height = FIX_H

  vanishPointY = height / 2
  vanishPointX = width / 2

  canvas.width = width
  canvas.height = height
}

onMounted(async () => {
  await nextTick()
  initCanvas()
})

onUnmounted(() => {
  if (requestAnimationFrameId) cancelAnimationFrame(requestAnimationFrameId)
  window.removeEventListener('resize', resizeCanvas)
  if (gui) gui.destroy()
  if (datGuiScript && datGuiScript.parentNode) datGuiScript.remove()
  emitter = null
})
</script>

<style scoped>
.canvas-3d-clock-container {
  width: 600px;
  height: 400px;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
