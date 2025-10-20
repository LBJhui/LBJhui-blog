<template>
  <div>upload</div>
  <!-- 选择文件夹 -->
  <input type="file" webkitdirectory mozdirectory odirectory />
  <!-- 选择多个文件 -->
  <input type="file" multiple />
  <!-- 拖拽文件和文件夹 -->
  <div class="container-drag" @dragenter="dragenter" @dragover="dragover" @drop="drop"></div>

  <hr />
  <div class="container">
    <DragArea :exts="exts" :fileSize="maxSize" @drop="addFiles(...$event)"></DragArea>
    <div class="operation">
      <button>选择多个文件<input type="file" multiple /></button>
      <button>选择文件夹 <input type="file" webkitdirectory /></button>
    </div>
    <FileTable :files="files" @delete="deleteFiles($event)"></FileTable>
    <div class="operation">
      <button> 开始上传 </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const dragenter = (e: DragEvent) => {
  e.preventDefault()
}
const dragover = (e: DragEvent) => {
  e.preventDefault()
}
const drop = (e: DragEvent) => {
  e.preventDefault()
  for (const item of e.dataTransfer.items) {
    const entry = item.webkitGetAsEntry()
    if (entry.isDirectory) {
      // 目录
      const reader = entry.createReader()
      reader.readEntries((en) => {
        console.log(en)
      })
    } else {
      // 文件
      entry.file((f) => {
        console.log(f)
      })
    }
  }
}

/**
 * 交互 file
 *  1.如何选择多个文件
 *  2.如何选择文件夹
 *  3.如何拖拽文件或文件夹
 *
 * 网络
 *  1.如何实现多文件上传
 *    multipart/form-data
 *  2.如何实现进度跟踪
 *    XHR(axios)  / fetch
 *  3.如何实现取消上传
 *    xhr.abort()
 *    AbortController
 */
import DragArea from './components/DragArea.vue'
import FileTable from './components/FileTable.vue'
import { useUpload } from './compositions/useUpload'
const exts = ['.jpg', '.jpeg', '.bmp', '.webp', '.gif', '.png']
const maxSize = 1024 * 1024
const { files, addFiles, deleteFiles, pendingFiles, upload } = useUpload([], exts, maxSize)

const handleFileChange = (e) => {
  addFiles(...e.target.files)
}
</script>

<style scoped lang="scss">
.container-drag {
  border: 1px solid;
  width: 100%;
  height: 100px;
}

.container {
  width: 95%;
  margin: 20px auto;
  padding-bottom: 50vh;
}
.operation {
  margin: 1em 0;
  display: flex;
  column-gap: 10px;
}
.operation button {
  position: relative;
  cursor: pointer;
}
.operation input[type='file'] {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
