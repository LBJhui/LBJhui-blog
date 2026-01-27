<template>
  <div class="container">
    <div class="demo box-shadow">box-shadow</div>
    <div class="demo drop-shadow">drop-shadow</div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.demo {
  width: 150px;
  margin: 20px;
  display: inline-block;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="deepskyblue"/></svg>') no-repeat center;
  background-size: contain;
  padding: 20px;
}
.box-shadow {
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);
}
.drop-shadow {
  filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
}
</style>
