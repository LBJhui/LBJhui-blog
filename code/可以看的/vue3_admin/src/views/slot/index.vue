<template>
  <!-- <VueSlot>
    <template #header="{ title }">
      <h1>{{ title }}</h1>
    </template>
    <div>渲染了默认插槽</div>
    <template #footer>
      <p>这是footer</p>
    </template>
  </VueSlot> -->
  <Comp></Comp>
  <component :is="CompH"></component>
  <component :is="CompHFunction"></component>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
// import VueSlot from './components/VueSlot.vue'
import { VueSlot } from './VueSlot.ts'
const Comp = () => {
  return h(
    VueSlot,
    {
      foo: () => h('div', null, 'foo'),
    },
    {
      header: ({ title }: { title: string }) => h('h1', null, title),
      default: () => h('div', null, '渲染了默认插槽'),
      footer: () => h('p', null, '这是footer'),
    },
  )
}

const msg = ref('hello')
const CompH = h(
  'div',
  {
    style: {
      color: 'red',
    },
  },
  msg.value,
)

const CompHFunction = () => {
  return h(
    'div',
    {
      style: {
        color: 'red',
      },
    },
    msg.value,
  )
}
setTimeout(() => {
  msg.value = 'world'
}, 2000)
</script>

<style scoped lang=""></style>
