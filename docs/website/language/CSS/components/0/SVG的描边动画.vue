<template>
  <div style="text-align: right">
    <svg class="icon" t="1732173154386" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1195" width="200" height="200">
      <path
        class="p"
        d="M18.944 353.92a41.92 41.92 0 0 0 0 59.136c16.32 16.32 42.656 16.32 58.944 0 239.456-240.288 627.68-240.288 867.168 0a41.504 41.504 0 0 0 58.88 0 41.92 41.92 0 0 0 0-59.136c-272-272.928-712.992-272.928-984.992 0z m806.528 131.392c-176.704-177.28-463.168-177.28-639.84 0a41.888 41.888 0 0 0 0 59.104 41.6 41.6 0 0 0 58.912 0 368.256 368.256 0 0 1 522.016 0 41.6 41.6 0 0 0 58.912 0 41.888 41.888 0 0 0 0-59.104z m-148.416 128.928a246.592 246.592 0 0 0-349.504 0 41.92 41.92 0 0 0 0 59.104 41.504 41.504 0 0 0 58.944 0 163.52 163.52 0 0 1 231.68 0 41.504 41.504 0 0 0 58.88 0c16.32-16.32 16.32-42.816 0-59.104z m-86.944 221.92c0-49.472-39.936-89.6-89.248-89.6a89.472 89.472 0 0 0-89.28 89.6c0 49.504 39.968 89.6 89.28 89.6a89.408 89.408 0 0 0 89.28-89.6z"
        fill="#666666"
        p-id="1196"></path>
    </svg>
    <button class="animate-btn" @click="handleStroke">描边动画</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  handleStroke()
})

const handleStroke = () => {
  const paths = document.querySelectorAll('.icon .p')
  paths.forEach((path) => {
    const len = path.getTotalLength() + 1
    path.style.setProperty('--l', len)
    // 移除动画类
    path.classList.remove('animate-stroke')
    // 强制重绘后添加动画类
    // window.requestAnimationFrame() 方法会告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。
    requestAnimationFrame(() => {
      path.classList.add('animate-stroke')
    })
  })
}
</script>

<style scoped>
svg {
  margin: 0 auto;
}
.p {
  stroke: red;
  stroke-width: 10px;
  fill: none;
  stroke-dasharray: var(--l);
  stroke-dashoffset: var(--l);
  /* animation: stroke 2s forwards; */
}
.animate-stroke {
  animation: stroke 5s forwards;
}
@keyframes stroke {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-btn {
  /* 基础样式 */
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #e53e3e; /* 红色系，和SVG描边色呼应 */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  /* 视觉增强 */
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
  transition: all 0.3s ease;
  /* 防止点击时的文字选中 */
  user-select: none;
  -webkit-user-select: none;
}

/* 悬停效果 */
.animate-btn:hover {
  background-color: #c53030;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(229, 62, 62, 0.4);
}

/* 点击按下效果 */
.animate-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(229, 62, 62, 0.3);
}
</style>
