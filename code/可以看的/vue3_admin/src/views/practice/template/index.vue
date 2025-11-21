<template>
  <div>
    vue组件内的模板复用
    <DefineTemplate v-slot="{ title, onFoo }">
      <!-- DefineTemplate 只能放到 UseTemplate 上面  -->
      <div>
        <div class="title">{{ title }}</div>
        <!-- <div class="content" @click="onFoo(111)">内容</div> -->
        <div class="content" @click="onClick">内容</div>
      </div>
    </DefineTemplate>
    <UseTemplate title="header" @foo="console.log"></UseTemplate>
  </div>
</template>

<script setup lang="ts">
import { createReusableTemplate } from './createReusableTemplate'

const [DefineTemplate, UseTemplate] = createReusableTemplate()

const onClick = () => {
  console.log('click')
}
</script>

<style scoped lang=""></style>
