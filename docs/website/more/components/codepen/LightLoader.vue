<template>
  <div class="loader-canvas-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const canvasRef = ref(null)
let canvas, ctx
const CANVAS_W = 600
const CANVAS_H = 400

let animationId = null
let lightLoaderInst = null

function LightLoader(c, cw, ch) {
  const _this = this
  this.c = c
  this.ctx = c.getContext('2d')
  this.cw = cw
  this.ch = ch
  this.loaded = 0
  this.loaderSpeed = 0.6
  this.loaderHeight = 10
  this.loaderWidth = 310
  this.loader = {
    x: this.cw / 2 - this.loaderWidth / 2,
    y: this.ch / 2 - this.loaderHeight / 2
  }
  this.particles = []
  this.particleLift = 180
  this.hueStart = 0
  this.hueEnd = 120
  this.hue = 0
  this.gravity = 0.15
  this.particleRate = 4

  this.init = function () {
    this.loop()
  }

  this.rand = function (rMi, rMa) {
    return ~~(Math.random() * (rMa - rMi + 1) + rMi)
  }

  this.updateLoader = function () {
    if (this.loaded < 100) {
      this.loaded += this.loaderSpeed
    } else {
      this.loaded = 0
    }
  }

  this.renderLoader = function () {
    this.ctx.fillStyle = '#000'
    this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight)
    this.hue = this.hueStart + (this.loaded / 100) * (this.hueEnd - this.hueStart)
    const newWidth = (this.loaded / 100) * this.loaderWidth
    this.ctx.fillStyle = `hsla(${this.hue}, 100%, 40%, 1)`
    this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight)
    this.ctx.fillStyle = '#222'
    this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight / 2)
  }

  this.Particle = function () {
    this.x = _this.loader.x + (_this.loaded / 100) * _this.loaderWidth - _this.rand(0, 1)
    this.y = _this.ch / 2 + _this.rand(0, _this.loaderHeight) - _this.loaderHeight / 2
    this.vx = (_this.rand(0, 4) - 2) / 100
    this.vy = (_this.rand(0, _this.particleLift) - _this.particleLift * 2) / 100
    this.width = _this.rand(1, 4) / 2
    this.height = _this.rand(1, 4) / 2
    this.hue = _this.hue
  }
  this.Particle.prototype.update = function (i) {
    this.vx += (_this.rand(0, 6) - 3) / 100
    this.vy += _this.gravity
    this.x += this.vx
    this.y += this.vy
    if (this.y > _this.ch) {
      _this.particles.splice(i, 1)
    }
  }
  this.Particle.prototype.render = function () {
    const light = _this.rand(50, 70)
    const alpha = _this.rand(20, 100) / 100
    _this.ctx.fillStyle = `hsla(${this.hue}, 100%, ${light}%, ${alpha})`
    _this.ctx.fillRect(this.x, this.y, this.width, this.height)
  }

  this.createParticles = function () {
    let i = this.particleRate
    while (i--) {
      this.particles.push(new this.Particle())
    }
  }
  this.updateParticles = function () {
    let i = this.particles.length
    while (i--) {
      this.particles[i].update(i)
    }
  }
  this.renderParticles = function () {
    let i = this.particles.length
    while (i--) {
      this.particles[i].render()
    }
  }

  this.clearCanvas = function () {
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.clearRect(0, 0, this.cw, this.ch)
    this.ctx.globalCompositeOperation = 'lighter'
  }

  this.loop = function () {
    const loopIt = () => {
      animationId = requestAnimationFrame(loopIt)
      _this.clearCanvas()
      _this.createParticles()
      _this.updateLoader()
      _this.updateParticles()
      _this.renderLoader()
      _this.renderParticles()
    }
    loopIt()
  }
}

function initCanvas() {
  canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  lightLoaderInst = new LightLoader(canvas, CANVAS_W, CANVAS_H)
  lightLoaderInst.init()
}

onMounted(async () => {
  await nextTick()
  initCanvas()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  lightLoaderInst = null
})
</script>

<style scoped>
.loader-canvas-wrap {
  width: 600px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
canvas {
  width: 100%;
  height: 100%;
  background: #111;
  display: block;
  border: 1px solid #171717;
}
</style>
