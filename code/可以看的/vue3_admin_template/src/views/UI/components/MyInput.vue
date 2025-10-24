<template>
  <div class="my-input">
    <!-- 渡一 -->
    <el-input ref="inp" v-bind="$attrs">
      <template v-for="(, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}"></slot>
      </template>
    </el-input>

    <!-- 远方os -->
    <el-input v-bind="{ ...$attrs, ...props }"></el-input>
    <component :is="h(ElInput, { ...$attrs, ...props, ref: changeRef }, $slots)"></component>
  </div>
</template>

<!-- https://juejin.cn/post/7262343902889197629 -->
<script setup lang="ts">
/**
 * 二次封装的问题
 * 1. props 如何穿透出去
 * 2. 插槽 如何穿透过去
 * 3. 组件的方法，如何暴漏出去
 */
import { ElInput, type InputProps } from 'element-plus'
const props = defineProps<Partial<InputProps>>()
import type { FormInstance } from 'element-plus'
// 引入useAttrs方法:获取组件标签身上属性与事件
import { h, ref, useAttrs, useSlots, toRaw, defineExpose, getCurrentInstance } from 'vue'
// 此方法执行会返回一个对象
let $attrs = useAttrs()

// 插槽
let $slots = useSlots()
let inp = ref<FormInstance>()

// 对外暴露方法，在父组件中，可通过 ref 调用
defineExpose(toRaw(inp))

const vm = getCurrentInstance()
const changeRef = (inputInstance: FormInstance) => {
  vm.exposeProxy = vm.exposed = inputInstance || {}
}
</script>

<style scoped>
.my-input {
  transition: 0.3s;
}
.my-input:hover,
.my-input:focus-within {
  filter: drop-shadow(0 0 10px #409eff);
}
</style>
