<template>
  <div>
    <div>获取组件的类型</div>
    <ElForm ref="formRef"></ElForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElForm } from 'element-plus'

const formRef = ref<InstanceType<typeof ElForm>>()
/**
 * 模板(构造器)
 * 实例
 */

function useCompRef1<T extends abstract new (...args: any[]) => any>() {
  return ref<InstanceType<T>>()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formRef2 = useCompRef1<typeof ElForm>()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useCompRef2<T extends abstract new (...args: any[]) => any>(_comp: T) {
  return ref<InstanceType<T>>()
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formRef3 = useCompRef2(ElForm)
</script>

<style scoped lang=""></style>
