<template>
  <div class="child">
    <h3>钱数props:{{ modelValue }}</h3>
    <button @click="handler1">父子组件数据同步</button>
    <h3>钱数defineModel:{{ money }}</h3>
    <button @click="handler2">父子组件数据同步</button>
  </div>
</template>

<script setup lang="ts">
// 接受props
let props = defineProps(['modelValue'])
let $emit = defineEmits(['update:modelValue'])
//子组件内部按钮的点击回调
const handler1 = () => {
  //触发自定义事件
  $emit('update:modelValue', props.modelValue + 1000)
}

// defineModel 语法糖
const [money, filter] = defineModel({
  type: Number,
  default: 0,
  set: (val) => {
    console.log('set', val)
    return val
  },
})

// 获取filter 修饰符
console.log('%c 🍺 filter', 'font-size:16px;color:#42b983', filter) // { number: true }

const handler2 = () => {
  //触发自定义事件
  money.value += 1000
}
</script>

<style scoped>
.child {
  width: 600px;
  height: 300px;
  background: skyblue;
}
</style>
