<template>
  <div>
    <ContentReader :text="text"></ContentReader>
  </div>
</template>

<script setup>
import ContentReader from './components/ContentReader.vue';

const text = `我说实话，我没有看过格力给我的工资条。我来格力电器的时候，我就说，董总，能不能给我一间离您比较近的办公室，我要随时跟你汇报。我哪怕每天什么事都不干，我就看她怎么开会，我听她每天讲什么、做什么，我都觉得是一件很幸福的事。`;
</script>

<style scoped></style>
