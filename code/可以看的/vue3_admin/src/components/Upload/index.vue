<template>
  <div>
    <el-upload v-model:file-list="fileList" :="attrs" @change="handleChange">
      <el-button class="upload-btn" type="primary" v-if="attrs.type === 'dashbutton'">
        <span class="iconfont icon-attachment"></span>
        上传
      </el-button>
      <template #tip>
        <span class="tip">{{ tip }}</span>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'

let attrs = useAttrs()
const model = defineModel()
defineProps(['tip'])
const handleChange = (file: any) => {
  model.value = file.raw
}

const fileList = ref([])
</script>

<style scoped lang="scss">
.upload-btn {
  background: #ffffff;
  border-radius: 2px;
  border: 1px dashed $primaryColor;
  color: $primaryColor;
  font-size: 14px;
  width: 90px;
}
.tip {
  margin-left: 9px;
  font-size: 14px;
  white-space: nowrap;
}
</style>
